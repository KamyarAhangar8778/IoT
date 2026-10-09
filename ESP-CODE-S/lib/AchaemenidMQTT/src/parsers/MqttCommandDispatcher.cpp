#include "MqttCommandDispatcher.h"
#include "StateParsers.h"
#include "SegmentParsers.h"
#include "RuleParsers.h"
#include <Utilities/logging.h>
#include <Optimization/CompilerTraits.h>

namespace uniuno {

MqttCommandDispatcher::MqttCommandDispatcher() {}

MqttCommandDispatcher::~MqttCommandDispatcher() {
    // In a real system, you might delete handlers if the dispatcher owns them,
    // but here we assume the application layer owns the lifecycle (Dependency Injection).
}

void MqttCommandDispatcher::registerHandler(IMqttPayloadHandler* handler) {
    if (handlerCount_ < MAX_HANDLERS && handler != nullptr) {
        handlers_[handlerCount_++] = handler;
    }
}

HOT_PATH IRAM_ATTR void MqttCommandDispatcher::setSyncHandler(uint8_t cmdType, SyncHandler handler) {
    for (int i = 0; i < MAX_SYNC; ++i) {
        if (!sync_[i].active || sync_[i].cmdType == cmdType) {
            sync_[i].cmdType = cmdType;
            sync_[i].handler = std::move(handler);
            sync_[i].active = true;
            return;
        }
    }
    WARNING("[MQTT Dispatcher] Sync handler table full, dropping handler");
}

HOT_PATH void MqttCommandDispatcher::handlePayload(const uint8_t* payload, size_t len, EventDispatcher* dispatcher) {
    if (UNLIKELY(dispatcher == nullptr || payload == nullptr || len == 0)) return;

    uint8_t cmdType = payload[0];

    // Fallback for legacy JSON
    if (UNLIKELY(cmdType == '{')) {
        WARNING("[MQTT Handler] Legacy JSON is no longer supported to save memory. Ignoring.");
        return;
    }

    // Fast path: direct callback, no event bus, no hash lookup.
    for (int i = 0; i < MAX_SYNC; ++i) {
        if (LIKELY(sync_[i].active) && sync_[i].cmdType == cmdType) {
            sync_[i].handler(payload, len);
            return;
        }
    }

    // Slow path: event-dispatch chain via IMqttPayloadHandler.
    for (int i = 0; i < handlerCount_; ++i) {
        if (handlers_[i]->canHandle(cmdType)) {
            handlers_[i]->handle(payload, len, dispatcher);
            return;
        }
    }

    WARNINGF("[MQTT Handler] Unknown binary command type or no handler found: 0x%02X", cmdType);
}

} // namespace uniuno
