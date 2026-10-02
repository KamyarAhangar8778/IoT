#include "WsClientParser.h"
#include <AppEvents.h>
#include <ArduinoJson.h>
#include <Optimization/CompilerTraits.h>
#include <Optimization/LatencyConfig.h>

namespace uniuno {

WsClientParser::WsClientParser(EventDispatcher* dispatcher, FastPathCallback fastPath)
    : _dispatcher(dispatcher), _fastPath(std::move(fastPath)) {}

HOT_PATH void WsClientParser::parseMessage(const websockets::WebsocketsMessage& message) {
    if (LIKELY(message.isBinary())) {
        const char* data = message.c_str();
        const size_t len = message.length();

        // Single pin binary format: [0x06][pin][state]
        if (LIKELY(len >= 3) && LIKELY(data[0] == 0x06)) {
            const int pin = static_cast<int>(static_cast<uint8_t>(data[1]));
            const bool state = (static_cast<uint8_t>(data[2]) != 0);

#if OPTIMIZE_WS_DIRECT_SYNC_PIN
            // Fast-Path: اجرای مستقیم بدون عبور از EventBus برای کمترین تاخیر
            if (_fastPath) {
                _fastPath(pin, state);
            } else {
                Serial.printf("[WebSocket] Automation Triggered! Pin: %d, State: %d\n", pin, state);
                PinStateChangeRequestEvent event{pin, state, 0};
                _dispatcher->dispatch(event);
            }
#else
            Serial.printf("[WebSocket] Automation Triggered! Pin: %d, State: %d\n", pin, state);
            PinStateChangeRequestEvent event{pin, state, 0};
            _dispatcher->dispatch(event);
#endif
        }
        // Batch binary format: [0x08][count][pin1][state1]...
        else if (LIKELY(len >= 2) && data[0] == 0x08) {
            const uint8_t count = static_cast<uint8_t>(data[1]);
            if (len >= 2 + (count * 2)) {
                Serial.printf("[WebSocket] Batch Automation Triggered! Actions: %u\n", count);
                for (uint8_t i = 0; i < count; ++i) {
                    const int pin = static_cast<int>(static_cast<uint8_t>(data[2 + i*2]));
                    const bool state = (static_cast<uint8_t>(data[3 + i*2]) != 0);
                    PinStateChangeRequestEvent event{pin, state, 0};
                    _dispatcher->dispatch(event);
                }
            }
        }
    } else {
        String text = message.data();
        if (text.startsWith("ESP_CFG_V2")) {
            Serial.println("[WebSocket] Received Config payload. Dispatching event...");
            ConfigPayloadReceivedEvent cfgEvt{text.c_str()};
            _dispatcher->dispatch(cfgEvt);
        } else if (text.indexOf("\"state_sync\"") >= 0) {
            Serial.println("[WebSocket] Received state_sync payload from Cloudflare");
            StaticJsonDocument<1024> doc;
            DeserializationError error = deserializeJson(doc, text);
            if (!error && doc.containsKey("states")) {
                JsonObject states = doc["states"].as<JsonObject>();
                for (JsonPair kv : states) {
                    int pin   = String(kv.key().c_str()).toInt();
                    bool state = kv.value().as<bool>();
                    PinStateChangeRequestEvent event{pin, state, 0};
                    _dispatcher->dispatch(event);
                }
                Serial.println("[WebSocket] Initial states applied successfully.");
            }
        } else {
            Serial.printf("[WebSocket] Text: %s\n", text.c_str());
        }
    }
}

} // namespace uniuno
