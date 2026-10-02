#pragma once

#include <cstdint>
#include <MQTT/MqttConstants.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief Keep-alive timer state machine (no heap, no Ticker).
 *
 * Runs inside the transport poll callback. Sends PINGREQ before the keep-alive
 * window elapses and disconnects on ping timeout to avoid half-open sockets.
 */
class MqttKeepAlive {
public:
    MqttKeepAlive() = default;

    void configure(uint16_t keep_alive_s) { keep_alive_ms_ = keep_alive_s * 1000u; }

    void reset(uint32_t now_ms) {
        last_activity_ms_ = now_ms;
        last_ping_ms_ = 0;
    }

    /// @return true when a PINGREQ should be sent now.
    bool shouldPing(uint32_t now_ms) const {
        if (last_ping_ms_ != 0) return false;  // already awaiting PINGRESP
        uint32_t since = now_ms - last_activity_ms_;
        return since >= keep_alive_ms_ * 7 / 10;  // 70% window
    }

    /// Record that a ping was just sent.
    void pingSent(uint32_t now_ms) { last_ping_ms_ = now_ms; }

    /// @return true when the broker has been silent too long (half-open).
    bool timedOut(uint32_t now_ms) const {
        if (last_ping_ms_ == 0) return false;
        return (now_ms - last_ping_ms_) >= (keep_alive_ms_ * 2);
    }

    /// Called on PINGRESP.
    void onPong(uint32_t now_ms) {
        last_ping_ms_ = 0;
        last_activity_ms_ = now_ms;
    }

    /// Called on any inbound activity.
    void activity(uint32_t now_ms) { last_activity_ms_ = now_ms; }

    /// Called every loop. Invokes @p sendPing when a PINGREQ is due.
    /// Returns true if the broker has timed out (half-open).
    template <typename SendPingFn>
    bool tick(uint32_t now_ms, SendPingFn sendPing) {
        if (shouldPing(now_ms)) {
            sendPing();
            return false;
        }
        return timedOut(now_ms);
    }

private:
    uint32_t keep_alive_ms_ = 15000;
    uint32_t last_activity_ms_ = 0;
    uint32_t last_ping_ms_ = 0;
};

} // namespace mqtt
} // namespace uniuno
