#pragma once

#include <cstdint>
#include <cstddef>
#include <MQTT/MqttTypes.h>
#include <MQTT/MqttConstants.h>
#include <Optimization/StaticHashMap.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief Tracks active subscriptions and routes incoming PUBLISH to handlers.
 *
 * RAM: pre-allocated open-addressing hash map (no heap). The message callback
 * is global (single handler, like the generic lib's onMessage). This table
 * only stores the topic filter + packet id for SUBACK correlation and QoS2
 * dedup. Routing by topic is done via the single MessageCallback.
 */
class MqttSubscriptions {
public:
    static constexpr uint8_t MAX_SUBSCRIPTIONS = 16;

    struct Record {
        uint32_t topic_hash;
        uint16_t packet_id;  // SUBACK packet id that created this
        uint8_t qos;
        bool active;
    };

    MqttSubscriptions() = default;

    /// Register a pending subscription (before SUBACK arrives).
    bool add(uint16_t packet_id, const char* topic, uint8_t qos) {
        uint32_t h = hashTopic(topic);
        if (LIKELY(table_.size() < MAX_SUBSCRIPTIONS)) {
            Record r{h, packet_id, qos, true};
            return table_.insert(topic, r);
        }
        return false;
    }

    /// True if the topic matches a known subscription (exact compare).
    bool isSubscribed(const char* topic) const { return table_.contains(topic); }

    void clear() { table_.clear(); }
    size_t size() const { return table_.size(); }

    /// 32-bit FNV-1a hash of a topic string (used for SUBACK correlation).
    static FORCE_INLINE uint32_t hashTopic(const char* topic) {
        uint32_t h = 2166136261u;
        if (topic) {
            while (*topic) {
                h ^= static_cast<uint32_t>(static_cast<uint8_t>(*topic++));
                h *= 16777619u;
            }
        }
        return h;
    }

private:
    StaticHashMap<const char*, Record, MAX_SUBSCRIPTIONS> table_;
};

}  // namespace mqtt
}  // namespace uniuno
