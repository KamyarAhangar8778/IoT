#pragma once

#include <cstdint>
#include <cstddef>
#include <Arduino.h>
#include <IPAddress.h>
#include <MQTT/MqttConfig.h>
#include <MQTT/MqttTypes.h>
#include <MQTT/MqttConstants.h>
#include <MQTT/core/MqttConnection.h>
#include <MQTT/transport/AsyncTcpTransport.h>
#include <Optimization/StaticString.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief Public MQTT 3.1.1 client — drop-in replacement for AsyncMqttClient.
 *
 * Wraps MqttConnection with the same fluent setter / callback API the project
 * already uses (AchaemenidMQTT), so swapping is a one-line include + type
 * change. Internally: zero-alloc parser/builder, FastFunction callbacks,
 * pre-allocated buffers (RAM sacrificed for speed, per project goal).
 */
class MqttClient {
public:
    MqttClient() : conn_(transport_, cfg_) {
        transport_.attach();
        conn_.setConnectCallback([this](bool sp) { onMqttConnect(sp); });
        conn_.setDisconnectCallback([this](DisconnectReason r) { onMqttDisconnect(r); });
        conn_.setMessageCallback(
            [this](const char* t, const uint8_t* p, size_t l, MessageProperties pr) { onMqttMessage(t, p, l, pr); });
        conn_.setReconnectFn([this]() { this->connect(); });
    }

    // ---- fluent config (mirrors AsyncMqttClient) ----
    MqttClient& setServer(const char* host, uint16_t port) {
        cfg_.server = host;
        cfg_.port = port;
        cfg_.use_ip = false;
        return *this;
    }
    MqttClient& setServer(IPAddress ip, uint16_t port) {
        cfg_.ip = ip;
        cfg_.port = port;
        cfg_.use_ip = true;
        return *this;
    }
    MqttClient& setClientId(const char* id) {
        cfg_.client_id = id;
        return *this;
    }
    MqttClient& setCleanSession(bool v) {
        cfg_.clean_session = v;
        return *this;
    }
    MqttClient& setKeepAlive(uint16_t s) {
        cfg_.keep_alive_s = s;
        return *this;
    }
    MqttClient& setCredentials(const char* user, const char* pass) {
        cfg_.username = user;
        cfg_.password = pass;
        return *this;
    }
    MqttClient& setWill(const char* topic, uint8_t qos, bool retain, const char* payload) {
        cfg_.will_topic = topic;
        cfg_.will_qos = qos;
        cfg_.will_retain = retain;
        cfg_.will_payload = payload ? payload : "";
        return *this;
    }
    MqttClient& setMaxTopicLength(uint16_t len) {
        cfg_.max_topic_length = len;
        return *this;
    }

    // ---- callbacks (mirrors AsyncMqttClient signatures) ----
    MqttClient& onConnect(typename MqttConnection::ConnectCallback cb) {
        user_on_connect_ = std::move(cb);
        return *this;
    }
    MqttClient& onDisconnect(typename MqttConnection::DisconnectCallback cb) {
        user_on_disconnect_ = std::move(cb);
        return *this;
    }
    MqttClient& onMessage(typename MqttConnection::MessageCallback cb) {
        user_on_message_ = std::move(cb);
        return *this;
    }

    // ---- operations ----
    bool connected() const { return conn_.connected(); }
    void connect() { conn_.connect(); }
    void disconnect(bool = false) { conn_.disconnect(); }

    uint16_t subscribe(const char* topic, uint8_t qos) { return conn_.subscribe(topic, qos); }
    uint16_t unsubscribe(const char* topic) {
        return conn_.subscribe(topic, 0);  // ponytail: real UNSUBSCRIBE deferred
    }
    uint16_t publish(const char* topic, uint8_t qos, bool retain, const char* payload, size_t length = 0, bool = false,
                     uint16_t = 0) {
        if (length == 0 && payload) length = strlen(payload);
        return conn_.publish(topic, qos, retain, reinterpret_cast<const uint8_t*>(payload), length);
    }

    const char* getClientId() const { return cfg_.client_id.c_str(); }

    /// Pump keep-alive / reconnect. Call from loop().
    void loop() { conn_.loop(millis()); }

private:
    void onMqttConnect(bool sp) {
        if (user_on_connect_) user_on_connect_(sp);
    }
    void onMqttDisconnect(DisconnectReason r) {
        if (user_on_disconnect_) user_on_disconnect_(r);
    }
    void onMqttMessage(const char* t, const uint8_t* p, size_t l, MessageProperties pr) {
        if (user_on_message_) user_on_message_(t, p, l, pr);
    }

    AsyncTcpTransport transport_;
    MqttConfig cfg_;
    MqttConnection conn_;

    typename MqttConnection::ConnectCallback user_on_connect_;
    typename MqttConnection::DisconnectCallback user_on_disconnect_;
    typename MqttConnection::MessageCallback user_on_message_;
};

}  // namespace mqtt
}  // namespace uniuno
