#include "SystemSetup.h"
#include <core/Globals.h>
#include <Core/Error/ErrorHandler.h>
#include <Utilities/logging.h>
#include <AppEvents.h>
#include <parsers/MqttCommandDispatcher.h>
#include <parsers/StateParsers.h>
#include <parsers/SegmentParsers.h>
#include <parsers/RuleParsers.h>
#include <core/WebSocketClient.h>
#include <core/WebSocketServer.h>
#include <WiFi.h>
#include <RuleEngine.h>
#include <Network/WiFi/ESP32WiFiAdapter.h>
#include <AchaemenidNetwork.h>

void setupErrorHandler() {
    uniuno::ErrorHandler::getInstance().onError([](const uniuno::ErrorInfo& info) {
        const char* sev = info.severity == uniuno::ErrorSeverity::CRITICAL  ? "CRIT"
                          : info.severity == uniuno::ErrorSeverity::ERROR   ? "ERR"
                          : info.severity == uniuno::ErrorSeverity::WARNING ? "WARN"
                                                                            : "INFO";
        Serial.printf("[%s] %s: %s\n", sev, info.context, info.message);
    });
    uniuno::ErrorHandler::getInstance().setThrottle("HTTP", 5000);
    uniuno::ErrorHandler::getInstance().setThrottle("MQTT", 5000);
}

void setupNetworkAndTime() {
    static uniuno::ESP32WiFiAdapter wifiAdapter;
    ::network = new uniuno::AchaemenidNetwork(&wifiAdapter);
}

void setupTimer() {
    uniuno::TimerFeatures features;
    features.timeout = true;
    features.interval = true;
    features.clear = true;
    appTimer = new uniuno::Timer(features, millis, &eventBus);

    // حذف شد: safety-net interval که هر ۶۰ ثانیه printStatus صدا میزد
    // و باعث می‌شد که sync غیرضروری برای پین‌ها صورت بگیرد.
    // وضعیت پین‌ها فقط هنگام بوت (BootManager) یک‌بار چاپ می‌شود.

    appTimer->setInterval(
        []() {
            if (!configLoaded || !::network || !::network->isConnected()) return;
            // Ping removed: MQTT connection is natively maintained by the custom MqttClient (keep-alive)
            // LWT (Last Will and Testament) on /Status topic now handles offline detection.
        },
        60000);
}

void setupMqtt() {
    mqttDispatcher = new uniuno::MqttCommandDispatcher();

    static uniuno::StateParsers stateHandler;
    static uniuno::SegmentParsers segmentHandler;
    static uniuno::RuleParsers ruleHandler;

    mqttDispatcher->registerHandler(&stateHandler);
    mqttDispatcher->registerHandler(&segmentHandler);
    mqttDispatcher->registerHandler(&ruleHandler);

    mqttClient.setCallback([](const uint8_t* payload, size_t len) {
        if (mqttDispatcher) {
            mqttDispatcher->handlePayload(payload, len, &eventBus);
        }
    });

    // Sync fast-path for on/off command (cmdType 0x01): bypass event bus
    // entirely and toggle the pin directly in the MQTT data callback.
    // Latency: broker → TCP recv → parse → pin set = single call chain.
    mqttDispatcher->setSyncHandler(0x01, [](const uint8_t* payload, size_t len) {
        if (len < 3) return;
        int pinNum = payload[1];
        bool value = (payload[2] == 0x01);
        int timer = (len >= 7) ? (int)(payload[3] | (payload[4] << 8) | (payload[5] << 16) | (payload[6] << 24)) : 0;

        Serial.printf("[MQTT FastPath] Pin %d -> %s (timer=%ds)\n", pinNum, value ? "ON" : "OFF", timer);

        if (pinManager.getIsHandledByPin(pinNum)) {
            Serial.printf("[MQTT FastPath] Pin %d is handled by a rule. Ignored.\n", pinNum);
            return;
        }
        pinManager.setPinState(pinNum, value);

        // Sync: dispatch confirmed state change for dashboard/Cloudflare sync
        PinStateChangedEvent changedEvt{pinNum, value, true};
        eventBus.dispatch(changedEvt);

        if (value && timer > 0 && appTimer) {
            // Auto-off via sync timer (deferred through app timer, not event bus)
            int p = pinNum;
            appTimer->setTimeout(
                [p]() {
                    if (pinManager.getIsHandledByPin(p)) return;
                    pinManager.setPinState(p, false);

                    // Dispatch state change for auto-off confirmation
                    PinStateChangedEvent offEvt{p, false, true};
                    eventBus.dispatch(offEvt);
                },
                timer * 1000);
        }
    });
}

void setupWebSocket() {
    auto stateProvider = []() -> String { return pinManager.exportStateJson(); };

    auto wsFastPath = [](int pin, bool state) {
        if (pinManager.getIsHandledByPin(pin)) return;
        pinManager.setPinState(pin, state);
        PinStateChangedEvent changedEvt{pin, state, true};
        eventBus.dispatch(changedEvt);
    };

    wsClient = new uniuno::AchaemenidWebSocketClient(&eventBus, stateProvider, wsFastPath);
    wsServer = new uniuno::AchaemenidWebSocketServer(&eventBus, stateProvider);

    wsClient->begin("wss://api.agkalaa.ir/ws");
}

void setupRuleEngine() {
    RuleContext ctx = {&mqttClient, appTimer, &executor, &eventBus, &pinManager, &isDashboardOnline};
    ruleEngine = new RuleEngine(ctx);
}
