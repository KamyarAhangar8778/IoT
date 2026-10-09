#pragma once

#include <ArduinoWebsockets.h>
#include <Events/EventDispatcher.h>
#include <functional>
#include "IMessageParser.h"

namespace uniuno {

class WsClientParser : public IMessageParser {
public:
    using FastPathCallback = std::function<void(int pin, bool state)>;

    WsClientParser(EventDispatcher* dispatcher, FastPathCallback fastPath = nullptr);
    ~WsClientParser() override = default;

    void parseMessage(const websockets::WebsocketsMessage& message) override;

private:
    EventDispatcher* _dispatcher;
    FastPathCallback _fastPath;
};

}  // namespace uniuno
