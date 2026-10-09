#include "WsServerParser.h"
#include <AppEvents.h>
#include <PinManager.h>
#include <Arduino.h>
#include <Optimization/LatencyConfig.h>

namespace uniuno {

WsServerParser::WsServerParser(EventDispatcher* dispatcher, std::function<String()> stateProvider)
    : _dispatcher(dispatcher), _stateProvider(stateProvider) {}

void WsServerParser::parseMessage(const String& data, websockets::WebsocketsClient& client) {
    if (data.indexOf("\"command\":\"get_state\"") >= 0) {
        String stateJson = _stateProvider ? _stateProvider() : "{}";
        client.send(stateJson);
    } else if (data.indexOf("\"command\":\"set_state\"") >= 0) {
        // Simple non-blocking JSON parsing (Dashboard sends flat JSON)
        int pinIdx = data.indexOf("\"pin\":");
        int stateIdx = data.indexOf("\"state\":");
        if (pinIdx >= 0 && stateIdx >= 0) {
#if OPTIMIZE_WS_ZERO_ALLOC_PARSER
            const char* cstr = data.c_str();
            int pin = atoi(cstr + pinIdx + 6);
            int state = atoi(cstr + stateIdx + 8);
#else
            int pin = data.substring(pinIdx + 6).toInt();
            int state = data.substring(stateIdx + 8).toInt();
#endif
            PinStateChangeRequestEvent evt{pin, state == 1, 0};
            _dispatcher->dispatch(evt);
        }
    }
}

}  // namespace uniuno
