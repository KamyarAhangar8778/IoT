#pragma once

#include <MQTT/core/MqttConnection.h>

namespace uniuno {
namespace mqtt {

// Public callback aliases — convenience for consumers of MqttClient.
using ConnectCallback    = MqttConnection::ConnectCallback;
using DisconnectCallback = MqttConnection::DisconnectCallback;
using MessageCallback    = MqttConnection::MessageCallback;

} // namespace mqtt
} // namespace uniuno
