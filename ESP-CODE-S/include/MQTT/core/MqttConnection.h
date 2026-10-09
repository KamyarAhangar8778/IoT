#pragma once

#include <cstdint>
#include <cstddef>
#include <Arduino.h>
#include <MQTT/MqttConfig.h>
#include <MQTT/MqttTypes.h>
#include <MQTT/MqttConstants.h>
#include <MQTT/transport/ITransport.h>
#include <MQTT/protocol/MqttPacketParser.h>
#include <MQTT/MqttPacketBuilder.h>
#include <MQTT/core/MqttKeepAlive.h>
#include <MQTT/core/MqttSubscriptions.h>
#include <MQTT/core/MqttReconnect.h>
#include <MQTT/core/MqttOutbox.h>
#include <Optimization/StaticString.h>
#include <Optimization/FastFunction.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief Core MQTT 3.1.1 connection state machine.
 *
 * Owns: transport wiring, CONNECT/CONNACK handshake, inbound parsing (via
 * MqttPacketParser, zero-alloc), outbound framing (via MqttPacketBuilder),
 * keep-alive, and subscription tracking. This is the engine; MqttClient is the
 * public facade around it.
 *
 * RAM: pre-allocated TX buffer + topic buffer. Zero heap on hot path.
 */
class MqttConnection {
public:
    using ConnectCallback = FastFunction<void(bool session_present), 64>;
    using DisconnectCallback = FastFunction<void(DisconnectReason), 64>;
    using MessageCallback =
        FastFunction<void(const char* topic, const uint8_t* payload, size_t length, MessageProperties props), 128>;

    static constexpr uint16_t TX_CAP = 512;

    MqttConnection(ITransport& transport, const MqttConfig& cfg) : transport_(transport), cfg_(cfg) {
        keepalive_.configure(cfg_.keep_alive_s);
        transport_.setConnectCallback([this](bool c) { onTransportConnect(c); });
        transport_.setDataCallback([this](const uint8_t* d, size_t l) { onData(d, l); });
        transport_.setPollCallback([this]() { onPoll(); });
    }

    void setConnectCallback(ConnectCallback cb) { on_connect_ = std::move(cb); }
    void setDisconnectCallback(DisconnectCallback cb) { on_disconnect_ = std::move(cb); }
    void setMessageCallback(MessageCallback cb) { on_message_ = std::move(cb); }

    bool connected() const { return connected_; }

    void connect() {
        if (connected_ || connecting_) return;
        if (cfg_.use_ip) {
            transport_.connect(cfg_.ip, cfg_.port);
        } else {
            transport_.connect(cfg_.server.c_str(), cfg_.port);
        }
        connecting_ = true;
    }

    void disconnect() {
        if (!connected_) return;
        uint8_t buf[2];
        size_t n = MqttPacketBuilder::buildDisconnect(buf, sizeof(buf));
        transport_.add(buf, n);
        transport_.send();
        transport_.close(true);
        finishDisconnect(DisconnectReason::USER_REQUESTED);
    }

    uint16_t subscribe(const char* topic, uint8_t qos) {
        if (!connected_) return 0;
        uint16_t pid = nextPacketId();
        uint8_t buf[TX_CAP];
        size_t n = MqttPacketBuilder::buildSubscribe(buf, sizeof(buf), pid, (uint16_t)strlen(topic), topic, qos);
        if (n && transport_.add(buf, n)) {
            transport_.send();
            subs_.add(pid, topic, qos);
            return pid;
        }
        return 0;
    }

    uint16_t publish(const char* topic, uint8_t qos, bool retain, const uint8_t* payload, size_t length) {
        if (!connected_) return 0;
        uint16_t pid = (qos == 0) ? 0 : nextPacketId();
        uint8_t buf[TX_CAP];
        size_t n = MqttPacketBuilder::buildPublish(buf, sizeof(buf), (uint16_t)strlen(topic), topic, pid, payload,
                                                   length, qos, retain, false);
        if (!(n && transport_.add(buf, n))) {
            return 0;
        }
        transport_.send();
        // QoS1/2: retain in outbox until ACKed (retransmit on timeout/reconnect)
        if (qos != 0) {
            outbox_.store(qos, retain, false, pid, topic, (uint16_t)strlen(topic), payload, (uint16_t)length);
        }
        return (qos == 0) ? 1 : pid;
    }

    /// Retransmit outbound QoS1/2 messages whose ACK deadline elapsed.
    void pollOutbox(uint32_t now_ms) {
        outbox_.poll(now_ms, [this](const OutboxEntry& e) {
            uint8_t buf[TX_CAP];
            size_t n = MqttPacketBuilder::buildPublish(
                buf, sizeof(buf), (uint16_t)e.topic_length, reinterpret_cast<const char*>(outbox_.topicOf(e)),
                e.packet_id, outbox_.payloadOf(e), e.payload_length, e.qos, e.retain, true /*dup*/);
            if (n) {
                transport_.add(buf, n);
                transport_.send();
            }
        });
    }

    /// Called every loop with millis().
    void loop(uint32_t now_ms) {
        // keep-alive handled in onPoll (transport fires it ~125ms when connected)
        reconnect_.tick(now_ms);
        if (connected_) pollOutbox(now_ms);
    }

    void setReconnectFn(MqttReconnect::ReconnectFn fn) { reconnect_.setReconnectFn(std::move(fn)); }

private:
    void onTransportConnect(bool c) {
        if (c) {
            connecting_ = false;
            sendConnect();
        } else {
            connecting_ = false;
            if (connected_) {
                finishDisconnect(DisconnectReason::TCP_DISCONNECTED);
            } else {
                reconnect_.onDisconnect(millis());
            }
        }
    }

    void sendConnect() {
        uint8_t buf[TX_CAP];
        size_t n = MqttPacketBuilder::buildConnect(buf, sizeof(buf), cfg_);
        if (n && transport_.add(buf, n)) {
            transport_.send();
            keepalive_.reset(millis());
            // Re-deliver any QoS1/2 messages still awaiting ACK from a prior session.
            outbox_.resendAll([this](const OutboxEntry& e) {
                uint8_t b[TX_CAP];
                size_t m = MqttPacketBuilder::buildPublish(
                    b, sizeof(b), (uint16_t)e.topic_length, reinterpret_cast<const char*>(outbox_.topicOf(e)),
                    e.packet_id, outbox_.payloadOf(e), e.payload_length, e.qos, e.retain, true /*dup*/);
                if (m) {
                    transport_.add(b, m);
                    transport_.send();
                }
            });
        } else {
            // Not enough TCP window — close and let reconnect handle it.
            transport_.close(true);
            finishDisconnect(DisconnectReason::NOT_ENOUGH_SPACE);
        }
    }

    void onData(const uint8_t* data, size_t len) {
        keepalive_.activity(millis());
        size_t pos = 0;
        while (pos < len) {
            if (parser_.onData(data, len, pos, topic_buf_, cfg_.max_topic_length)) {
                handleParsed();
                parser_.reset();
            } else {
                break;
            }
        }
    }

    void onPoll() {
        if (!connected_) return;
        uint32_t now = millis();
        bool timed_out = keepalive_.tick(now, [this, now]() { sendPing(now); });
        if (timed_out) {
            transport_.close(true);
            finishDisconnect(DisconnectReason::KEEP_ALIVE_TIMEOUT);
        }
    }

    void handleParsed() {
        const ParsedPacket& p = parser_.parsed();
        switch (p.type) {
            case PacketType::CONNACK:
                if (p.connect_return_code == 0) {
                    connected_ = true;
                    keepalive_.reset(millis());
                    if (on_connect_) on_connect_(p.session_present);
                } else {
                    transport_.close(true);
                    finishDisconnect(DisconnectReason::TCP_DISCONNECTED);
                }
                break;
            case PacketType::PINGRESP:
                keepalive_.onPong(millis());
                break;
            case PacketType::PUBLISH: {
                uint8_t qos = (p.flags & 0x06) >> 1;
                MessageProperties props{qos, (p.flags & 0x08) != 0, (p.flags & 0x01) != 0};
                if (on_message_ && p.topic) {
                    on_message_(p.topic, p.payload, p.payload_length, props);
                }
                // QoS1/2: acknowledge the broker so it stops retransmitting.
                if (qos == 1) {
                    sendAck(PacketType::PUBACK, HeaderFlag::PUBACK_RESERVED, p.packet_id);
                } else if (qos == 2) {
                    sendAck(PacketType::PUBREC, HeaderFlag::PUBREC_RESERVED, p.packet_id);
                }
                break;
            }
            case PacketType::SUBACK:
                Serial.printf("[MQTT] SUBACK confirmed by broker! (packet_id: %u)\n", p.packet_id);
                break;
            case PacketType::UNSUBACK:
                break;
            case PacketType::PUBACK:
                outbox_.ack(p.packet_id);
                break;
            case PacketType::PUBREC:
                // QoS2 outbound: step 2 — broker got PUBLISH, send PUBREL.
                outbox_.ack(p.packet_id);
                sendAck(PacketType::PUBREL, HeaderFlag::PUBREL_RESERVED, p.packet_id);
                break;
            case PacketType::PUBREL:
                // QoS2 inbound: step 3 — broker releasing, send PUBCOMP.
                sendAck(PacketType::PUBCOMP, HeaderFlag::PUBCOMP_RESERVED, p.packet_id);
                break;
            case PacketType::PUBCOMP:
                // QoS2 outbound: final step — message fully acknowledged.
                outbox_.ack(p.packet_id);
                break;
            default:
                break;
        }
    }

    void sendPing(uint32_t now_ms) {
        uint8_t buf[2];
        size_t n = MqttPacketBuilder::buildPingReq(buf, sizeof(buf));
        if (n && transport_.add(buf, n)) {
            transport_.send();
            keepalive_.pingSent(now_ms);
        }
    }

    /// Send a 4-byte ACK packet (PUBACK/PUBREC/PUBREL/PUBCOMP).
    void sendAck(PacketType type, uint8_t flag, uint16_t packet_id) {
        uint8_t buf[4];
        size_t n = MqttPacketBuilder::buildAck(buf, sizeof(buf), type, flag, packet_id);
        if (n && transport_.add(buf, n)) transport_.send();
    }

    void finishDisconnect(DisconnectReason reason) {
        bool was = connected_;
        connected_ = false;
        connecting_ = false;
        subs_.clear();
        outbox_.clear();
        parser_.reset();
        keepalive_.reset(0);
        if (was && on_disconnect_)
            on_disconnect_(reason);
        else if (!was)
            reconnect_.onDisconnect(millis());
    }

    uint16_t nextPacketId() {
        if (++packet_id_ == 0) packet_id_ = 1;  // 0 forbidden
        return packet_id_;
    }

    ITransport& transport_;
    const MqttConfig& cfg_;

    MqttPacketParser parser_;
    MqttKeepAlive keepalive_;
    MqttSubscriptions subs_;
    MqttReconnect reconnect_;
    MqttOutbox<16, 1024> outbox_;

    char topic_buf_[256];  // >= max_topic_length
    uint16_t packet_id_ = 0;

    bool connected_ = false;
    bool connecting_ = false;

    ConnectCallback on_connect_;
    DisconnectCallback on_disconnect_;
    MessageCallback on_message_;
};

}  // namespace mqtt
}  // namespace uniuno
