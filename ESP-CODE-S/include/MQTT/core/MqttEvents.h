#pragma once

#include <cstdint>
#include <cstddef>
#include <MQTT/MqttTypes.h>

namespace uniuno {
namespace mqtt {

// ============================================================
// MQTT events for EventDispatcher integration
// Pattern: TimerEvents.h — each event struct has a static Name
// used for hashing by EventDispatcher
// ============================================================

struct MqttConnectedEvent {
    static constexpr const char* Name = "mqtt.connected";
    bool session_present;
};

struct MqttDisconnectedEvent {
    static constexpr const char* Name = "mqtt.disconnected";
    DisconnectReason reason;
    bool will_retry;
};

struct MqttMessageEvent {
    static constexpr const char* Name = "mqtt.message";
    const char* topic;       // pointer into internal buffer (no copy)
    const uint8_t* payload;  // pointer into internal buffer (no copy)
    size_t length;
    uint8_t qos;
    bool retain;
    bool dup;
};

struct MqttPublishAckEvent {
    static constexpr const char* Name = "mqtt.publish.ack";
    uint16_t packet_id;
    uint8_t qos;
};

struct MqttSubscribeAckEvent {
    static constexpr const char* Name = "mqtt.subscribe.ack";
    uint16_t packet_id;
    uint8_t status;
};

struct MqttUnsubscribeAckEvent {
    static constexpr const char* Name = "mqtt.unsubscribe.ack";
    uint16_t packet_id;
};

struct MqttKeepAliveTickEvent {
    static constexpr const char* Name = "mqtt.keepalive.tick";
    uint32_t last_activity_ms;
};

}  // namespace mqtt
}  // namespace uniuno
