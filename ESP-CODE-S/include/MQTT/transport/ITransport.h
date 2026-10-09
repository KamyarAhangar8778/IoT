#pragma once

#include <cstdint>
#include <cstddef>
#include <IPAddress.h>
#include <Optimization/FastFunction.h>

namespace uniuno {
namespace mqtt {

/**
 * @brief Transport abstraction for the MQTT client.
 *
 * Decouples the protocol layer (MqttClient) from the physical connection
 * (TCP/TLS) so the protocol can be unit-tested with a fake transport.
 *
 * RAM NOTE: callbacks use FastFunction (SBO, no heap). onData receives a
 * pointer into the transport's RX buffer — it is only valid for the duration
 * of the callback (zero-copy).
 */
class ITransport {
public:
    using ConnectHandler = FastFunction<void(bool connected), 24>;
    using DataHandler = FastFunction<void(const uint8_t* data, size_t len), 24>;
    using PollHandler = FastFunction<void(), 24>;

    virtual ~ITransport() = default;

    virtual void setConnectCallback(ConnectHandler cb) = 0;
    virtual void setDataCallback(DataHandler cb) = 0;
    virtual void setPollCallback(PollHandler cb) = 0;

    /// Connect to broker by hostname. Returns false if already connecting.
    virtual bool connect(const char* host, uint16_t port) = 0;
    /// Connect to broker by IP. Returns false if already connecting.
    virtual bool connect(IPAddress ip, uint16_t port) = 0;
    /// Close the connection immediately (now=true) or gracefully.
    virtual void close(bool now = false) = 0;

    /// Queue bytes for sending (may be buffered by the transport).
    virtual size_t add(const uint8_t* data, size_t len) = 0;
    /// Flush queued bytes to the socket.
    virtual bool send() = 0;
    /// Bytes available in the TCP send window.
    virtual size_t space() = 0;

    virtual bool connected() = 0;
};

}  // namespace mqtt
}  // namespace uniuno
