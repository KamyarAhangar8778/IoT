#pragma once

#include <cstdint>

namespace uniuno {
namespace mqtt {

// ============================================================
// MQTT 3.1.1 Protocol Constants (type-safe enum class)
// ============================================================

enum class PacketType : uint8_t {
    RESERVED = 0,
    CONNECT = 1,
    CONNACK = 2,
    PUBLISH = 3,
    PUBACK = 4,
    PUBREC = 5,
    PUBREL = 6,
    PUBCOMP = 7,
    SUBSCRIBE = 8,
    SUBACK = 9,
    UNSUBSCRIBE = 10,
    UNSUBACK = 11,
    PINGREQ = 12,
    PINGRESP = 13,
    DISCONNECT = 14
};

// Fixed-header flags for each packet type
namespace HeaderFlag {
constexpr uint8_t CONNECT_RESERVED = 0x00;
constexpr uint8_t CONNACK_RESERVED = 0x00;
constexpr uint8_t PUBLISH_DUP = 0x08;
constexpr uint8_t PUBLISH_QOS0 = 0x00;
constexpr uint8_t PUBLISH_QOS1 = 0x02;
constexpr uint8_t PUBLISH_QOS2 = 0x04;
constexpr uint8_t PUBLISH_RETAIN = 0x01;
constexpr uint8_t PUBACK_RESERVED = 0x00;
constexpr uint8_t PUBREC_RESERVED = 0x00;
constexpr uint8_t PUBREL_RESERVED = 0x02;
constexpr uint8_t PUBCOMP_RESERVED = 0x00;
constexpr uint8_t SUBSCRIBE_RESERVED = 0x02;
constexpr uint8_t SUBACK_RESERVED = 0x00;
constexpr uint8_t UNSUBSCRIBE_RESERVED = 0x02;
constexpr uint8_t UNSUBACK_RESERVED = 0x00;
constexpr uint8_t PINGREQ_RESERVED = 0x00;
constexpr uint8_t PINGRESP_RESERVED = 0x00;
constexpr uint8_t DISCONNECT_RESERVED = 0x00;
}  // namespace HeaderFlag

// CONNECT packet connect-flags
namespace ConnectFlag {
constexpr uint8_t USERNAME = 0x80;
constexpr uint8_t PASSWORD = 0x40;
constexpr uint8_t WILL_RETAIN = 0x20;
constexpr uint8_t WILL_QOS0 = 0x00;
constexpr uint8_t WILL_QOS1 = 0x08;
constexpr uint8_t WILL_QOS2 = 0x10;
constexpr uint8_t WILL = 0x04;
constexpr uint8_t CLEAN_SESSION = 0x02;
constexpr uint8_t RESERVED = 0x00;
}  // namespace ConnectFlag

// Protocol level for MQTT 3.1.1
constexpr uint8_t PROTOCOL_LEVEL = 0x04;

// Maximum remaining-length encoding size (4 bytes)
constexpr uint8_t MAX_REMAINING_LENGTH_BYTES = 4;

// Invalid packet id (0 is forbidden by the protocol)
constexpr uint16_t INVALID_PACKET_ID = 0;

}  // namespace mqtt
}  // namespace uniuno
