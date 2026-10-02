#pragma once

#include <cstdint>
#include <Optimization/FastFunction.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief Exponential-backoff reconnect scheduler (no Ticker, no heap).
 *
 * The host calls tick() from its loop; when the backoff delay elapses we invoke
 * the user-provided reconnect function. Mirrors AchaemenidMQTT's existing
 * 1s/2s/4s backoff but lives inside the MQTT lib so the wrapper is simpler.
 */
class MqttReconnect {
public:
    static constexpr uint8_t MAX_RETRIES = 8;

    using ReconnectFn = uniuno::FastFunction<void(), 24>;

    void setReconnectFn(ReconnectFn fn) { reconnect_ = std::move(fn); }
    void reset() { retries_ = 0; scheduled_ms_ = 0; }

    void onDisconnect(uint32_t now_ms) {
        if (retries_ >= MAX_RETRIES) return;  // give up; host may ESP.restart()
        retries_++;
        uint32_t delay_s = (1u << (retries_ - 1));  // 1,2,4,8...
        scheduled_ms_ = now_ms + delay_s * 1000u;
    }

    void tick(uint32_t now_ms) {
        if (scheduled_ms_ != 0 && now_ms >= scheduled_ms_) {
            scheduled_ms_ = 0;
            if (reconnect_) reconnect_();
        }
    }

    uint8_t retries() const { return retries_; }

private:
    ReconnectFn reconnect_;
    uint8_t retries_ = 0;
    uint32_t scheduled_ms_ = 0;
};

} // namespace mqtt
} // namespace uniuno
