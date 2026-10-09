#pragma once

#include <cstdint>

namespace uniuno {

constexpr inline uint32_t hash_event_name(const char* str) {
    if (!str) return 0;
    uint32_t hash = 5381;
    while (*str) {
        hash = ((hash << 5) + hash) + static_cast<uint32_t>(*str++);
    }
    return hash;
}

} // namespace uniuno
