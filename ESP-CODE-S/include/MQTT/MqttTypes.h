#pragma once

#include <cstdint>
#include <cstddef>
#include <Optimization/FastFunction.h>

namespace uniuno {
namespace mqtt {

// ============================================================
// Lightweight message properties (no heap)
// ============================================================
struct MessageProperties {
    uint8_t qos;
    bool dup;
    bool retain;
};

// ============================================================
// Disconnect / error reasons
// ============================================================
enum class DisconnectReason : uint8_t {
    TCP_DISCONNECTED = 0,
    NOT_ENOUGH_SPACE = 1,
    TLS_BAD_FINGERPRINT = 2,
    KEEP_ALIVE_TIMEOUT = 3,
    USER_REQUESTED = 4
};

// ============================================================
// Pending ACK entry for outbound QoS1/2 acknowledgements
// ============================================================
struct PendingAck {
    uint8_t packet_type;
    uint8_t header_flag;
    uint16_t packet_id;
};

// ============================================================
// Pending QoS2 inbound message (awaiting PUBREL)
// ============================================================
struct PendingPubRel {
    uint16_t packet_id;
};

// ============================================================
// Outbox entry for outbound QoS1/2 messages (retry on reconnect)
// ============================================================
struct OutboxEntry {
    uint16_t packet_id;
    uint8_t qos;
    bool retain;
    bool dup;
    uint16_t topic_offset;   // offset into the outbox data buffer
    uint16_t payload_offset; // offset into the outbox data buffer
    uint16_t topic_length;
    uint16_t payload_length;
    uint32_t next_retry_ms;  // absolute millis() deadline for retransmission
    bool awaiting_ack;
};

// ============================================================
// Subscription entry (topic hash -> subscription record)
// ============================================================
struct Subscription {
    uint32_t topic_hash;
    uint8_t qos;
    uint16_t packet_id;   // SUBACK packet id that created this subscription
    bool active;
};

// ============================================================
// Callback aliases — all use FastFunction (SBO, no heap)
// ============================================================
using ConnectCallback     = FastFunction<void(bool session_present), 64>;
using DisconnectCallback  = FastFunction<void(DisconnectReason), 64>;
using MessageCallback     = FastFunction<void(const char* topic, const uint8_t* payload,
                                             size_t length, MessageProperties props), 128>;
using PublishCallback     = FastFunction<void(uint16_t packet_id), 64>;
using SubscribeCallback   = FastFunction<void(uint16_t packet_id, uint8_t status), 64>;
using UnsubscribeCallback = FastFunction<void(uint16_t packet_id), 64>;

} // namespace mqtt
} // namespace uniuno
