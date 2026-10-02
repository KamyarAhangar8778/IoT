#pragma once

#include <Arduino.h>
#include <Events/EventDispatcher.h>
#include <Optimization/FastFunction.h>

namespace uniuno {

/**
 * @brief MQTT command dispatcher with a sync fast-path for latency-critical
 * commands (e.g. on/off toggle).
 *
 * Hot commands bypass the event-bus entirely and invoke a registered
 * callback directly (sync, zero virtual dispatch, zero hash lookup).
 * Slower / complex commands still go through the IMqttPayloadHandler chain.
 */
class IMqttPayloadHandler {
public:
    virtual ~IMqttPayloadHandler() = default;
    virtual bool canHandle(uint8_t cmdType) const = 0;
    virtual void handle(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) = 0;
};

class MqttCommandDispatcher {
public:
    using SyncHandler = FastFunction<void(const uint8_t* payload, size_t len), 48>;

    MqttCommandDispatcher();
    ~MqttCommandDispatcher();

    void registerHandler(IMqttPayloadHandler* handler);

    /// Register a zero-overhead sync handler for a single cmdType (hot path).
    /// Replaces anything registered via registerHandler for that cmdType.
    void setSyncHandler(uint8_t cmdType, SyncHandler handler);

    /// Sync, direct dispatch — no event bus, no hash lookup for fast commands.
    HOT_PATH void handlePayload(const uint8_t* payload, size_t len, EventDispatcher* dispatcher);

private:
    static const int MAX_HANDLERS = 4;
    static const int MAX_SYNC = 8;

    IMqttPayloadHandler* handlers_[MAX_HANDLERS];
    int handlerCount_ = 0;

    struct SyncEntry {
        uint8_t cmdType;
        SyncHandler handler;
        bool active;
        SyncEntry() : cmdType(0), handler(), active(false) {}
    };
    SyncEntry sync_[MAX_SYNC];
};

} // namespace uniuno
