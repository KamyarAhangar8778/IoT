#pragma once

#include <cstdint>
#include <cstddef>
#include <IPAddress.h>
#include <Optimization/StaticString.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief MQTT Configuration container using stack/bss-friendly StaticString.
 * Prevents heap fragmentation on the ESP32 by avoiding dynamic Strings.
 * Replaces the 15+ raw setter methods of the generic AsyncMqttClient.
 */
struct MqttConfig {
    StaticString<128> server;      ///< Broker hostname or IP
    uint16_t port = 1883;          ///< Broker port
    uint8_t qos = 0;               ///< Default QoS (0, 1, 2)
    bool clean_session = true;     ///< Clean session flag
    uint16_t keep_alive_s = 15;    ///< Keep-alive interval in seconds

    StaticString<64> client_id;    ///< MQTT client identifier
    StaticString<64> username;     ///< Optional username
    StaticString<64> password;     ///< Optional password

    StaticString<128> will_topic;  ///< Optional Last-Will topic
    StaticString<128> will_payload;///< Optional Last-Will payload
    uint8_t will_qos = 0;          ///< Last-Will QoS
    bool will_retain = false;      ///< Last-Will retain flag

    /// Maximum topic length accepted by the parser (pre-allocated buffer)
    uint16_t max_topic_length = 128;

    /// Transport target: hostname (use_ip=false) or resolved IP (use_ip=true)
    bool use_ip = false;
    IPAddress ip;

    bool isValid() const {
        return !server.empty() && !client_id.empty();
    }
};

} // namespace mqtt
} // namespace uniuno
