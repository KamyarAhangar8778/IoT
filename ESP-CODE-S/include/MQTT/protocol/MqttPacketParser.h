#pragma once

#include <cstdint>
#include <cstddef>
#include <MQTT/MqttConstants.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief Zero-allocation MQTT packet parser (State Machine).
 *
 * REPLACES the generic library's virtual Packet hierarchy + new/delete.
 * Parsing is a single switch over a byte-parse state — no virtual calls,
 * no heap allocation, FORCE_INLINE'd for hot-path throughput.
 *
 * Body handling: after the fixed header + remaining-length, ALL packet
 * types are consumed as a uniform "body" of exactly remaining_length bytes.
 * For PUBLISH the topic/packet-id fields are decoded incrementally and the
 * payload is exposed as a zero-copy pointer into the RX buffer.
 */

enum class ParseState : uint8_t { FIXED_HEADER = 0, REMAINING_LENGTH = 1, BODY = 2 };

struct ParsedPacket {
    PacketType type = PacketType::RESERVED;
    uint8_t flags = 0;
    uint32_t remaining_length = 0;

    // PUBLISH fields
    uint16_t topic_length = 0;
    const char* topic = nullptr;  // points into the caller's topic buffer
    uint16_t packet_id = 0;
    const uint8_t* payload = nullptr;  // points into the RX data (zero-copy)
    uint32_t payload_length = 0;
    uint32_t payload_offset = 0;
    bool has_payload = false;

    // CONNACK fields
    bool session_present = false;
    uint8_t connect_return_code = 0;

    // SUBACK status (first return code)
    uint8_t ack_status = 0;
};

class MqttPacketParser {
public:
    MqttPacketParser() = default;

    /** @brief Reset to idle (start of a new packet). */
    HOT_PATH FORCE_INLINE void reset() {
        state_ = ParseState::FIXED_HEADER;
        rl_pos_ = 0;
        body_pos_ = 0;
        parsed_ = ParsedPacket{};
    }

    /**
     * @brief Feed RX bytes into the parser.
     * @param topic_buf Topic accumulation buffer (>= max_topic+1 bytes).
     * @param pos Current byte offset in data, updated as bytes are parsed.
     * @return true when a complete packet has been parsed (check parsed()).
     */
    HOT_PATH FORCE_INLINE bool onData(const uint8_t* data, size_t len, size_t& pos, char* topic_buf,
                                      uint16_t max_topic) {
        while (pos < len) {
            switch (state_) {
                case ParseState::FIXED_HEADER: {
                    const uint8_t byte = data[pos++];
                    parsed_.type = (PacketType)(byte >> 4);
                    parsed_.flags = byte & 0x0F;
                    state_ = ParseState::REMAINING_LENGTH;
                    break;
                }
                case ParseState::REMAINING_LENGTH: {
                    const uint8_t byte = data[pos++];
                    rl_buf_[rl_pos_++] = byte;
                    if ((byte & 0x80) == 0) {
                        parsed_.remaining_length = decodeRemainingLength();
                        rl_pos_ = 0;
                        if (UNLIKELY(parsed_.remaining_length == 0)) {
                            // Zero-length packet (PINGRESP / DISCONNECT)
                            state_ = ParseState::FIXED_HEADER;
                            return true;
                        }
                        state_ = ParseState::BODY;
                    }
                    break;
                }
                case ParseState::BODY: {
                    const uint32_t remaining_body = parsed_.remaining_length - body_pos_;
                    size_t chunk = len - pos;
                    if (chunk > remaining_body) chunk = remaining_body;

                    if (LIKELY(parsed_.type == PacketType::PUBLISH)) {
                        consumePublish(data, pos, chunk, topic_buf, max_topic);
                    } else {
                        consumeGeneric(data, pos, chunk);
                    }

                    body_pos_ += chunk;
                    pos += chunk;

                    if (UNLIKELY(body_pos_ >= parsed_.remaining_length)) {
                        // Packet body fully consumed
                        if (parsed_.type == PacketType::PUBLISH) {
                            parsed_.payload_length = parsed_.payload_offset;
                        }
                        state_ = ParseState::FIXED_HEADER;
                        return true;
                    }
                    break;
                }
            }
        }
        return false;
    }

    const ParsedPacket& parsed() const { return parsed_; }

private:
    HOT_PATH FORCE_INLINE uint32_t decodeRemainingLength() {
        uint32_t multiplier = 1;
        uint32_t value = 0;
        for (uint8_t i = 0; i < rl_pos_; i++) {
            value += (rl_buf_[i] & 127) * multiplier;
            multiplier *= 128;
        }
        return value;
    }

    /** @brief Incremental PUBLISH body parsing (topic len, topic, packet id, payload). */
    HOT_PATH FORCE_INLINE void consumePublish(const uint8_t* data, size_t pos, size_t chunk, char* topic_buf,
                                              uint16_t max_topic) {
        const uint8_t qos = (parsed_.flags & 0x06) >> 1;
        size_t i = 0;
        // Topic length (2 bytes)
        while (i < chunk && body_pos_ + i < 2) {
            const uint8_t b = data[pos + i];
            if (body_pos_ + i == 0)
                parsed_.topic_length = (uint16_t)(b << 8);
            else
                parsed_.topic_length |= b;
            i++;
        }
        // Topic bytes
        if (body_pos_ + i >= 2 && body_pos_ + i < 2 + parsed_.topic_length) {
            while (i < chunk && body_pos_ + i < 2 + parsed_.topic_length) {
                const uint8_t b = data[pos + i];
                if (LIKELY(parsed_.topic_length <= max_topic)) {
                    topic_buf[(body_pos_ + i) - 2] = (char)b;
                }
                i++;
            }
            if (body_pos_ + i >= 2 + parsed_.topic_length) {
                topic_buf[parsed_.topic_length] = '\0';
                parsed_.topic = topic_buf;
            }
        }
        // Packet id (2 bytes) for QoS != 0
        const uint32_t id_start = 2 + parsed_.topic_length;
        if (qos != 0 && body_pos_ + i >= id_start && body_pos_ + i < id_start + 2) {
            while (i < chunk && body_pos_ + i < id_start + 2) {
                const uint8_t b = data[pos + i];
                if (body_pos_ + i == id_start)
                    parsed_.packet_id = (uint16_t)(b << 8);
                else
                    parsed_.packet_id |= b;
                i++;
            }
        }
        // Payload — the remainder of the body
        if (body_pos_ + i >= id_start + (qos ? 2 : 0)) {
            if (parsed_.payload_offset == 0 && i < chunk) {
                parsed_.payload = data + pos + i;
            }
            parsed_.payload_offset += (chunk - i);
            parsed_.has_payload = true;
        }
    }

    /** @brief Generic body consumption (CONNACK, SUBACK, PUBACK, ...). */
    HOT_PATH FORCE_INLINE void consumeGeneric(const uint8_t* data, size_t pos, size_t chunk) {
        switch (parsed_.type) {
            case PacketType::CONNACK: {
                for (size_t k = 0; k < chunk; k++) {
                    const uint32_t idx = body_pos_ + k;
                    if (idx == 0)
                        parsed_.session_present = (data[pos + k] & 0x01) != 0;
                    else if (idx == 1)
                        parsed_.connect_return_code = data[pos + k];
                }
                break;
            }
            case PacketType::SUBACK: {
                for (size_t k = 0; k < chunk; k++) {
                    const uint32_t idx = body_pos_ + k;
                    if (idx == 0)
                        parsed_.packet_id = (uint16_t)(data[pos + k] << 8);
                    else if (idx == 1)
                        parsed_.packet_id |= data[pos + k];
                    else if (idx == 2)
                        parsed_.ack_status = data[pos + k];
                }
                break;
            }
            case PacketType::UNSUBACK:
            case PacketType::PUBACK:
            case PacketType::PUBREC:
            case PacketType::PUBREL:
            case PacketType::PUBCOMP: {
                for (size_t k = 0; k < chunk; k++) {
                    const uint32_t idx = body_pos_ + k;
                    if (idx == 0)
                        parsed_.packet_id = (uint16_t)(data[pos + k] << 8);
                    else if (idx == 1)
                        parsed_.packet_id |= data[pos + k];
                }
                break;
            }
            default:
                break;  // ignore unknown body
        }
    }

    ParseState state_ = ParseState::FIXED_HEADER;
    uint8_t rl_buf_[MAX_REMAINING_LENGTH_BYTES];
    uint8_t rl_pos_ = 0;
    uint32_t body_pos_ = 0;
    ParsedPacket parsed_;
};

}  // namespace mqtt
}  // namespace uniuno
