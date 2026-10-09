#pragma once

#include <Ticker.h>
#include <MQTT/MqttTypes.h>
#include <WiFi.h>

namespace uniuno {

class AchaemenidMQTT;  // Forward declaration

/**
 * @brief Handles MQTT reconnection logic and exponential backoff
 *
 * NOTE: reconnection is driven by the custom MqttClient's internal
 * MqttReconnect (exponential backoff). This manager keeps a Ticker-based
 * fallback for hard restarts only.
 */
class MqttConnectionManager {
public:
    MqttConnectionManager(AchaemenidMQTT* mqttClient);

    void onConnect();
    void onDisconnect(uniuno::mqtt::DisconnectReason reason);
    void resetRetries();

private:
    static void reconnectWrapper(AchaemenidMQTT* instance);

    AchaemenidMQTT* _mqttClient;
    Ticker _reconnectTimer;
    uint8_t _reconnectRetries = 0;
};

}  // namespace uniuno
