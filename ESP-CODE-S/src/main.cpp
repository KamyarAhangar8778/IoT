/**
 * @file main.cpp
 * @brief Achaemenid IoT Node - Event-Driven Architecture (Refactored)
 */

#include <Arduino.h>
#include <core/Globals.h>
#include <setup/SystemSetup.h>
#include <BootManager.h>
#include <RuleEngine.h>
#include <Utilities/logging.h>
#include <AppEvents.h>
#include "events/EventHandlers.h"
#include <setup/NetworkStorage.h>
#include <core/WebSocketServer.h>
#include <core/WebSocketClient.h>
#include <NvsSegmentStorage.h>
#include <setup/FallbackAP.h>
#include <Optimization/LatencyConfig.h>
#include <Optimization/SerialBenchmarkRunner.h>

void setup() {
    Serial.begin(115200);
    delay(1000);

    Serial.println("\n==========================================");
    Serial.println("  Achaemenid IoT Node - Modular Async     ");
    Serial.println("==========================================");

    setupErrorHandler();
    setupEventBus();
    setupNetworkAndTime();
    setupTimer();
    if (appTimer != nullptr) {
        appTimer->startHardwareTimer(1000);
        INFO("[System] Hardware timer started at 1ms resolution.");
    }
    setupMqtt();
    setupWebSocket();

    setupRuleEngine();

    // 1. Add master network configured in Globals.cpp first
    if (strlen(WIFI_SSID) > 0) {
        ::network->add_access_point(WIFI_SSID, WIFI_PASSWORD);
        INFOF("[System] Master WiFi registered from Globals.cpp: '%s'", WIFI_SSID);
    }

    // 2. Load Network Configuration from NVS
    String savedSSID[MAX_WIFI_NETWORKS];
    String savedPass[MAX_WIFI_NETWORKS];
    int savedCount = 0;
    MqttConfig savedMqtt;
    loadNetworkConfig(savedSSID, savedPass, savedCount, savedMqtt);

    if (savedCount > 0) {
        INFOF("[System] Found %d saved WiFi networks in NVS", savedCount);
        for (int i = 0; i < savedCount; i++) {
            if (savedSSID[i].length() > 0) {
                // If savedSSID is different from WIFI_SSID, add it as secondary
                if (strcmp(savedSSID[i].c_str(), WIFI_SSID) != 0) {
                    ::network->add_access_point(savedSSID[i].c_str(), savedPass[i].c_str());
                } else {
                    INFO("[System] Master SSID matches NVS entry. Prioritizing fresh credentials from Globals.cpp.");
                }
            }
        }
    }
    INFOF("[System] Multi-AP setup ready with %d total candidate networks.", (int)::network->get_ap_count());
    
    // Also restore MQTT if valid
    if (savedMqtt.valid) {
        mqttClient.begin(String(savedMqtt.host), savedMqtt.port, String(savedMqtt.baseTopic), savedMqtt.qos, "", "");
        mqttClient.subscribe(String(savedMqtt.baseTopic) + "/Command");
        INFOF("[System] Restored MQTT settings from NVS (Host: %s, Topic: %s)", savedMqtt.host, savedMqtt.baseTopic);
    } else {
        mqttClient.begin("broker.emqx.io", 1883, "KamyarIoT/Achaemenid", 1, "", "");
        mqttClient.subscribe("KamyarIoT/Achaemenid/Command");
        INFO("[System] Using default fallback MQTT (broker.emqx.io, Topic: KamyarIoT/Achaemenid/Command)");
    }

    INFO("[System] Setup completed. Starting Async Boot Sequence...");
    
    // Start Boot Sequence
    segmentStorage = new uniuno::NvsSegmentStorage();
    bootManager = new BootManager();

    BootContext bootCtx = {
        ::network,
        &pinManager,
        &executor,
        &eventBus,
        appTimer,
        segmentStorage,
        &configLoaded,
        &rawConfigPayload
    };
    bootManager->startBootSequenceAsync(bootCtx);
}

void loop() {
    // 1. Poll the global async executor (handles WiFi, NTP, Config)
    executor.poll();

    // 2. Drive MQTT keep-alive / reconnect in the main loop
    mqttClient.loop();

    // 3. Keep internal connection instances alive (httpClient removed)

    // 4. Process inputs for segments of type 'input'
    if (ruleEngine) {
#if OPTIMIZE_FAST_PROCESS_INPUTS
        static const auto onInputHandler = [](int pin, bool state, unsigned long dur, const RuleConfig& r) {
            ruleEngine->handleInput(pin, state, dur, r);
        };
        pinManager.processInputs(onInputHandler);
#else
        pinManager.processInputs([](int pin, bool state, unsigned long dur, const RuleConfig& r) {
            ruleEngine->handleInput(pin, state, dur, r);
        });
#endif
    }

    // 5. Poll Local WebSocket Server
    if (wsServer) wsServer->loop();

    // 6. WebSocket Client (Cloud API) - Zero Latency KeepAlive
    if (wsClient) wsClient->loop();

    // 7. Interactive Serial Commands
    if (Serial.available()) {
        char ch = Serial.read();
        if (ch == 'C' || ch == 'c') {
            Serial.println("\n[System] Clearing saved WiFi/MQTT credentials from NVS...");
            Preferences p;
            if (p.begin("AchaemenidNet", false)) {
                p.clear();
                p.end();
                Serial.println("[System] NVS network credentials cleared! Restarting ESP32 in 1s...\n");
                delay(1000);
                ESP.restart();
            }
        }
#if ENABLE_SERIAL_BENCHMARK
        else if (ch == 'B' || ch == 'b') {
            uniuno::SerialBenchmarkRunner::runBenchmarks();
        }
#endif
    }

#if ENABLE_FALLBACK_AP
    if (uniuno::FallbackAP::isRunning()) {
        uniuno::FallbackAP::handleClient();
    }
#endif
}