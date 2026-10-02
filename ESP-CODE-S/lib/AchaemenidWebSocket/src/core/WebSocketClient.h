#pragma once

#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/semphr.h>
#include <ArduinoWebsockets.h>
#include <Events/EventDispatcher.h>
#include <functional>
#include "WebSocketConfig.h"
#include "../parsers/WsClientParser.h"

namespace uniuno {

class AchaemenidWebSocketClient {
public:
    using FastPathCallback = WsClientParser::FastPathCallback;
    AchaemenidWebSocketClient(EventDispatcher* dispatcher, std::function<String()> stateProvider,
                              FastPathCallback fastPath = nullptr);
    ~AchaemenidWebSocketClient();

    void begin(const String& serverUrl);
    void stop();
    void sendText(const String& payload);
    void requestConfig();
    void syncPinState(int pin, bool state);

    void loop();

private:


    void onMessageCallback(websockets::WebsocketsMessage message);
    void onEventsCallback(websockets::WebsocketsEvent event, String data);

    static void connectTask(void* param);
    void doConnect();

    websockets::WebsocketsClient* client_ = nullptr;
    WebSocketConfig config_;
    
    volatile bool isRunning_;
    volatile bool firstConnection_;
    portMUX_TYPE firstConnMux_ = portMUX_INITIALIZER_UNLOCKED;

    unsigned long lastPingTime_ = 0;
    volatile bool isConnecting_ = false;
    TaskHandle_t connectTaskHandle_ = nullptr;
    EventDispatcher* dispatcher_;
    std::function<String()> stateProvider_;
    WsClientParser* parser_;
};

} // namespace uniuno
