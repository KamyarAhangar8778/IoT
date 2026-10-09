#pragma once

#include <cstdint>
#include <cstddef>
#include <MQTT/MqttTypes.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief Stores outbound QoS1/2 messages for retransmission until ACKed.
 *
 * RAM TRADE-OFF: a single large pre-allocated data buffer holds all
 * topic+payload bytes. Entries are fixed-size slots (ring). This avoids heap
 * entirely and gives O(1) retain/retransmit — at the cost of a fixed ceiling
 * (outbox_capacity * max message size worth of RAM). The user chose speed
 * over RAM, so we pre-allocate aggressively.
 */
template <uint8_t Capacity, uint16_t DataCap>
class MqttOutbox {
public:
    MqttOutbox() : count_(0), head_(0), tail_(0), data_used_(0) {}

    /// Store a message for (re)transmission. Returns slot index or -1 if full.
    int32_t store(uint8_t qos, bool retain, bool dup, uint16_t packet_id, const char* topic, uint16_t topic_len,
                  const uint8_t* payload, uint16_t payload_len) {
        if (UNLIKELY(count_ >= Capacity)) return -1;
        if (UNLIKELY(data_used_ + topic_len + payload_len > DataCap)) return -1;

        uint16_t t_off = data_used_;
        copyInto(data_, t_off, topic, topic_len);
        uint16_t p_off = data_used_ + topic_len;
        copyInto(data_, p_off, reinterpret_cast<const char*>(payload), payload_len);
        data_used_ += topic_len + payload_len;

        uint8_t slot = tail_;
        entries_[slot] = OutboxEntry{packet_id, qos, retain, dup, t_off, p_off, topic_len, payload_len, 0, true};
        tail_ = (tail_ + 1) % Capacity;
        count_++;
        return slot;
    }

    /// Mark a message ACKed and free its data region (compaction on head).
    void ack(uint16_t packet_id) {
        for (uint8_t i = 0; i < count_; i++) {
            uint8_t idx = (head_ + i) % Capacity;
            if (entries_[idx].packet_id == packet_id && entries_[idx].awaiting_ack) {
                entries_[idx].awaiting_ack = false;
                freeEntry(idx);
                return;
            }
        }
    }

    /// Call once per loop; invokes @p send for any entry whose retry timer elapsed.
    template <typename SendFn>
    void poll(uint32_t now_ms, SendFn send) {
        for (uint8_t i = 0; i < count_; i++) {
            uint8_t idx = (head_ + i) % Capacity;
            OutboxEntry& e = entries_[idx];
            if (e.awaiting_ack && now_ms >= e.next_retry_ms) {
                e.next_retry_ms = now_ms + RETRY_MS;
                e.dup = true;
                send(e);
            }
        }
    }

    /// Resend everything still awaiting ACK (used after reconnect).
    template <typename SendFn>
    void resendAll(SendFn send) {
        for (uint8_t i = 0; i < count_; i++) {
            uint8_t idx = (head_ + i) % Capacity;
            if (entries_[idx].awaiting_ack) {
                entries_[idx].dup = true;
                send(entries_[idx]);
            }
        }
    }

    bool empty() const { return count_ == 0; }
    uint8_t size() const { return count_; }
    const OutboxEntry* get(uint8_t slot) const { return &entries_[slot]; }
    const uint8_t* topicOf(const OutboxEntry& e) const { return &data_[e.topic_offset]; }
    const uint8_t* payloadOf(const OutboxEntry& e) const { return &data_[e.payload_offset]; }

    void clear() {
        count_ = 0;
        head_ = 0;
        tail_ = 0;
        data_used_ = 0;
    }

private:
    static constexpr uint32_t RETRY_MS = 5000;

    void freeEntry(uint8_t idx) {
        // Simple compaction: shift all later data left. Keeps buffer tight.
        // ponytail: O(n) compaction acceptable — outbox is tiny (Capacity<=16).
        OutboxEntry& e = entries_[idx];
        uint16_t freed = e.topic_length + e.payload_length;
        uint16_t start = e.topic_offset;
        memmove(&data_[start], &data_[start + freed], data_used_ - start - freed);
        data_used_ -= freed;
        // Adjust offsets of entries after this one
        for (uint8_t i = 0; i < count_; i++) {
            uint8_t j = (head_ + i) % Capacity;
            if (j == idx) continue;
            if (entries_[j].topic_offset > start) entries_[j].topic_offset -= freed;
            if (entries_[j].payload_offset > start) entries_[j].payload_offset -= freed;
        }
        // Remove slot from ring
        if (idx == head_) {
            head_ = (head_ + 1) % Capacity;
        } else if (idx == (tail_ + Capacity - 1) % Capacity) {
            tail_ = idx;
        }
        count_--;
    }

    static void copyInto(uint8_t* dst, uint16_t off, const char* src, uint16_t len) {
        if (src && len) memcpy(dst + off, src, len);
    }

    OutboxEntry entries_[Capacity];
    uint8_t data_[DataCap];
    uint8_t count_;
    uint8_t head_;
    uint8_t tail_;
    uint16_t data_used_;
};

}  // namespace mqtt
}  // namespace uniuno
