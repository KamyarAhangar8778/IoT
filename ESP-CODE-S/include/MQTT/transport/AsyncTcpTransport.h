#pragma once

#include "ITransport.h"
#include <AsyncTCP.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief ITransport implementation backed by AsyncTCP's AsyncClient.
 *
 * Wraps the generic AsyncClient callbacks into the protocol-facing
 * FastFunction callbacks. Keeps the raw TCP layer out of MqttClient.
 */
class AsyncTcpTransport : public ITransport {
public:
    AsyncTcpTransport() = default;
    ~AsyncTcpTransport() override = default;

    void setConnectCallback(ConnectHandler cb) override { _onConnect = std::move(cb); }
    void setDataCallback(DataHandler cb) override       { _onData = std::move(cb); }
    void setPollCallback(PollHandler cb) override        { _onPoll = std::move(cb); }

    bool connect(const char* host, uint16_t port) override {
        if (_client.connected() || _connecting) return false;
        _connecting = true;
        return _client.connect(host, port);
    }

    bool connect(IPAddress ip, uint16_t port) override {
        if (_client.connected() || _connecting) return false;
        _connecting = true;
        return _client.connect(ip, port);
    }

    void close(bool now = false) override {
        _connecting = false;
        _client.close(now);
    }

    size_t add(const uint8_t* data, size_t len) override {
        return _client.add(reinterpret_cast<const char*>(data), len);
    }

    bool send() override {
        return _client.send();
    }

    size_t space() override {
        return _client.space();
    }

    bool connected() override {
        return _client.connected();
    }

    /// Wire AsyncClient events into our FastFunction callbacks. Call once.
    void attach() {
        _client.onConnect([](void* arg, AsyncClient* c) {
            auto self = static_cast<AsyncTcpTransport*>(arg);
            self->_connecting = false;
            // Apply latency tuning here, NOT in attach(): setNoDelay() is a no-op
            // on a NULL pcb, and _rx_last_packet is only set in AsyncClient::_connected.
            // Setting setRxTimeout before connect would close the socket on the
            // first poll if the device had been up >30s (now - _rx_last_packet >= 30s).
            self->_client.setNoDelay(true);
            self->_client.setAckTimeout(1000);
            self->_client.setRxTimeout(30);
            if (self->_onConnect) self->_onConnect(true);
        }, this);

        _client.onDisconnect([](void* arg, AsyncClient* c) {
            auto self = static_cast<AsyncTcpTransport*>(arg);
            self->_connecting = false;
            if (self->_onConnect) self->_onConnect(false);
        }, this);

        _client.onData([](void* arg, AsyncClient* c, void* data, size_t len) {
            auto self = static_cast<AsyncTcpTransport*>(arg);
            if (self->_onData) self->_onData(reinterpret_cast<const uint8_t*>(data), len);
        }, this);

        _client.onPoll([](void* arg, AsyncClient* c) {
            auto self = static_cast<AsyncTcpTransport*>(arg);
            if (self->_onPoll) self->_onPoll();
        }, this);
    }

private:
    AsyncClient _client;
    bool _connecting = false;

    ConnectHandler _onConnect;
    DataHandler    _onData;
    PollHandler    _onPoll;
};

} // namespace mqtt
} // namespace uniuno
