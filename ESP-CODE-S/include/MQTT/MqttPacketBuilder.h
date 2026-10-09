#pragma once

#include <cstdint>
#include <cstddef>
#include <cstring>
#include <MQTT/MqttConstants.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief Zero-allocation MQTT packet builder.
 *
 * Writes MQTT 3.1.1 packets directly into a caller-provided buffer.
 * All methods return the number of bytes written (0 on error).
 * Uses FORCE_INLINE + LIKELY/UNLIKELY for maximum throughput.
 *
 * RAM TRADE-OFF (Tool #1): caller supplies a large pre-allocated buffer,
 * so no heap allocation ever happens on the hot path.
 */
class MqttPacketBuilder {
public:
    /**
     * @brief Encode a remaining-length value per MQTT spec (max 4 bytes).
     * @return Number of bytes written to @p out.
     */
    static FORCE_INLINE uint8_t encodeRemainingLength(uint32_t remaining_length, uint8_t* out) {
        uint8_t pos = 0;
        do {
            uint8_t encoded = remaining_length % 128;
            remaining_length /= 128;
            if (remaining_length > 0) encoded |= 0x80;
            out[pos++] = encoded;
        } while (remaining_length > 0);
        return pos;
    }

    /**
     * @brief Build a CONNECT packet.
     * @param buf   Destination buffer.
     * @param cap   Destination capacity.
     * @param cfg   Client config fields (client_id, clean_session, keep_alive,
     *              username, password, will).
     * @return Bytes written, or 0 if the packet does not fit.
     */
    template <typename ConfigT>
    static size_t buildConnect(uint8_t* buf, size_t cap, const ConfigT& cfg) {
        const char* client_id = cfg.client_id.c_str();
        const char* username = cfg.username.empty() ? nullptr : cfg.username.c_str();
        const char* password = cfg.password.empty() ? nullptr : cfg.password.c_str();
        const char* will_topic = cfg.will_topic.empty() ? nullptr : cfg.will_topic.c_str();
        const char* will_payload = cfg.will_payload.empty() ? nullptr : cfg.will_payload.c_str();

        const uint16_t client_len = strlen(client_id);
        const uint16_t user_len = username ? (uint16_t)strlen(username) : 0;
        const uint16_t pass_len = password ? (uint16_t)strlen(password) : 0;
        const uint16_t will_topic_len = will_topic ? (uint16_t)strlen(will_topic) : 0;
        const uint16_t will_pay_len = will_payload ? (uint16_t)strlen(will_payload) : 0;

        // Variable header: protocol name (2+4) + level(1) + flags(1) + keepalive(2)
        uint32_t remaining = 2 + 4 + 1 + 1 + 2 + 2 + client_len;
        if (will_topic) remaining += 2 + will_topic_len + 2 + will_pay_len;
        if (username) remaining += 2 + user_len;
        if (password) remaining += 2 + pass_len;

        uint8_t rl_buf[MAX_REMAINING_LENGTH_BYTES];
        uint8_t rl_len = encodeRemainingLength(remaining, rl_buf);
        size_t total = 1 + rl_len + remaining;
        if (UNLIKELY(total > cap)) return 0;

        size_t pos = 0;
        buf[pos++] = ((uint8_t)PacketType::CONNECT << 4) | HeaderFlag::CONNECT_RESERVED;
        memcpy(buf + pos, rl_buf, rl_len);
        pos += rl_len;

        // Protocol name "MQTT"
        buf[pos++] = 0x00;
        buf[pos++] = 0x04;
        buf[pos++] = 'M';
        buf[pos++] = 'Q';
        buf[pos++] = 'T';
        buf[pos++] = 'T';
        // Protocol level
        buf[pos++] = PROTOCOL_LEVEL;
        // Connect flags
        uint8_t flags = 0;
        if (cfg.clean_session) flags |= ConnectFlag::CLEAN_SESSION;
        if (username) flags |= ConnectFlag::USERNAME;
        if (password) flags |= ConnectFlag::PASSWORD;
        if (will_topic) {
            flags |= ConnectFlag::WILL;
            if (cfg.will_retain) flags |= ConnectFlag::WILL_RETAIN;
            if (cfg.will_qos == 1)
                flags |= ConnectFlag::WILL_QOS1;
            else if (cfg.will_qos == 2)
                flags |= ConnectFlag::WILL_QOS2;
        }
        buf[pos++] = flags;
        // Keep alive
        buf[pos++] = (uint8_t)(cfg.keep_alive_s >> 8);
        buf[pos++] = (uint8_t)(cfg.keep_alive_s & 0xFF);
        // Client id
        buf[pos++] = (uint8_t)(client_len >> 8);
        buf[pos++] = (uint8_t)(client_len & 0xFF);
        memcpy(buf + pos, client_id, client_len);
        pos += client_len;
        // Will
        if (will_topic) {
            buf[pos++] = (uint8_t)(will_topic_len >> 8);
            buf[pos++] = (uint8_t)(will_topic_len & 0xFF);
            memcpy(buf + pos, will_topic, will_topic_len);
            pos += will_topic_len;
            buf[pos++] = (uint8_t)(will_pay_len >> 8);
            buf[pos++] = (uint8_t)(will_pay_len & 0xFF);
            if (will_pay_len) {
                memcpy(buf + pos, will_payload, will_pay_len);
                pos += will_pay_len;
            }
        }
        // Username / password
        if (username) {
            buf[pos++] = (uint8_t)(user_len >> 8);
            buf[pos++] = (uint8_t)(user_len & 0xFF);
            memcpy(buf + pos, username, user_len);
            pos += user_len;
        }
        if (password) {
            buf[pos++] = (uint8_t)(pass_len >> 8);
            buf[pos++] = (uint8_t)(pass_len & 0xFF);
            memcpy(buf + pos, password, pass_len);
            pos += pass_len;
        }
        return pos;
    }

    /**
     * @brief Build a PUBLISH packet.
     * @return Bytes written, or 0 if it does not fit.
     */
    static FORCE_INLINE size_t buildPublish(uint8_t* buf, size_t cap, uint16_t topic_length, const char* topic,
                                            uint16_t packet_id, const uint8_t* payload, size_t payload_length,
                                            uint8_t qos, bool retain, bool dup) {
        uint32_t remaining = 2 + topic_length + payload_length;
        if (qos != 0) remaining += 2;

        uint8_t rl_buf[MAX_REMAINING_LENGTH_BYTES];
        uint8_t rl_len = encodeRemainingLength(remaining, rl_buf);
        size_t total = 1 + rl_len + remaining;
        if (UNLIKELY(total > cap)) return 0;

        uint8_t fixed = (uint8_t)PacketType::PUBLISH << 4;
        if (dup) fixed |= HeaderFlag::PUBLISH_DUP;
        if (retain) fixed |= HeaderFlag::PUBLISH_RETAIN;
        if (qos == 1)
            fixed |= HeaderFlag::PUBLISH_QOS1;
        else if (qos == 2)
            fixed |= HeaderFlag::PUBLISH_QOS2;

        size_t pos = 0;
        buf[pos++] = fixed;
        memcpy(buf + pos, rl_buf, rl_len);
        pos += rl_len;
        buf[pos++] = (uint8_t)(topic_length >> 8);
        buf[pos++] = (uint8_t)(topic_length & 0xFF);
        memcpy(buf + pos, topic, topic_length);
        pos += topic_length;
        if (qos != 0) {
            buf[pos++] = (uint8_t)(packet_id >> 8);
            buf[pos++] = (uint8_t)(packet_id & 0xFF);
        }
        if (payload_length) {
            memcpy(buf + pos, payload, payload_length);
            pos += payload_length;
        }
        return pos;
    }

    /** @brief Build a SUBSCRIBE packet. */
    static FORCE_INLINE size_t buildSubscribe(uint8_t* buf, size_t cap, uint16_t packet_id, uint16_t topic_length,
                                              const char* topic, uint8_t qos) {
        uint32_t remaining = 2 + 2 + topic_length + 1;
        uint8_t rl_buf[MAX_REMAINING_LENGTH_BYTES];
        uint8_t rl_len = encodeRemainingLength(remaining, rl_buf);
        size_t total = 1 + rl_len + remaining;
        if (UNLIKELY(total > cap)) return 0;

        size_t pos = 0;
        buf[pos++] = ((uint8_t)PacketType::SUBSCRIBE << 4) | HeaderFlag::SUBSCRIBE_RESERVED;
        memcpy(buf + pos, rl_buf, rl_len);
        pos += rl_len;
        buf[pos++] = (uint8_t)(packet_id >> 8);
        buf[pos++] = (uint8_t)(packet_id & 0xFF);
        buf[pos++] = (uint8_t)(topic_length >> 8);
        buf[pos++] = (uint8_t)(topic_length & 0xFF);
        memcpy(buf + pos, topic, topic_length);
        pos += topic_length;
        buf[pos++] = qos;
        return pos;
    }

    /** @brief Build an UNSUBSCRIBE packet. */
    static FORCE_INLINE size_t buildUnsubscribe(uint8_t* buf, size_t cap, uint16_t packet_id, uint16_t topic_length,
                                                const char* topic) {
        uint32_t remaining = 2 + 2 + topic_length;
        uint8_t rl_buf[MAX_REMAINING_LENGTH_BYTES];
        uint8_t rl_len = encodeRemainingLength(remaining, rl_buf);
        size_t total = 1 + rl_len + remaining;
        if (UNLIKELY(total > cap)) return 0;

        size_t pos = 0;
        buf[pos++] = ((uint8_t)PacketType::UNSUBSCRIBE << 4) | HeaderFlag::UNSUBSCRIBE_RESERVED;
        memcpy(buf + pos, rl_buf, rl_len);
        pos += rl_len;
        buf[pos++] = (uint8_t)(packet_id >> 8);
        buf[pos++] = (uint8_t)(packet_id & 0xFF);
        buf[pos++] = (uint8_t)(topic_length >> 8);
        buf[pos++] = (uint8_t)(topic_length & 0xFF);
        memcpy(buf + pos, topic, topic_length);
        pos += topic_length;
        return pos;
    }

    /** @brief Build a PINGREQ packet (2 bytes). */
    static FORCE_INLINE size_t buildPingReq(uint8_t* buf, size_t cap) {
        if (UNLIKELY(cap < 2)) return 0;
        buf[0] = ((uint8_t)PacketType::PINGREQ << 4) | HeaderFlag::PINGREQ_RESERVED;
        buf[1] = 0;
        return 2;
    }

    /** @brief Build a DISCONNECT packet (2 bytes). */
    static FORCE_INLINE size_t buildDisconnect(uint8_t* buf, size_t cap) {
        if (UNLIKELY(cap < 2)) return 0;
        buf[0] = ((uint8_t)PacketType::DISCONNECT << 4) | HeaderFlag::DISCONNECT_RESERVED;
        buf[1] = 0;
        return 2;
    }

    /** @brief Build a 4-byte ack packet (PUBACK/PUBREC/PUBREL/PUBCOMP). */
    static FORCE_INLINE size_t buildAck(uint8_t* buf, size_t cap, PacketType type, uint8_t flags, uint16_t packet_id) {
        if (UNLIKELY(cap < 4)) return 0;
        buf[0] = ((uint8_t)type << 4) | flags;
        buf[1] = 2;
        buf[2] = (uint8_t)(packet_id >> 8);
        buf[3] = (uint8_t)(packet_id & 0xFF);
        return 4;
    }
};

}  // namespace mqtt
}  // namespace uniuno
