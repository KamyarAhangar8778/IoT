#pragma once

#include "EventDispatcherInterface.h"
#include <Optimization/LatencyConfig.h>

namespace uniuno {

template <size_t MaxEvents = 32, size_t MaxListeners = 8>
class EventDispatcherBase : public EventDispatcherCoreBase<MaxEvents, MaxListeners> {
public:
    using EventDispatcherCoreBase<MaxEvents, MaxListeners>::dispatch;
    using EventDispatcherCoreBase<MaxEvents, MaxListeners>::removeListener;
    using EventDispatcherCoreBase<MaxEvents, MaxListeners>::removeListenerById;
    using EventDispatcherCoreBase<MaxEvents, MaxListeners>::count;

    template <typename EventType>
    uint32_t on(void (*callback)(EventType*)) {
        if (UNLIKELY(!callback)) return 0;
        auto func = FastFunction<void(void*)>([callback](void* event) { callback(static_cast<EventType*>(event)); });
#if OPTIMIZE_COMPILE_TIME_EVENT_HASH
        constexpr uint32_t event_hash = hash_event_name(EventType::Name);
        return this->addListener(event_hash, std::move(func), false);
#else
        return this->addListener(hash_event_name(EventType::Name), std::move(func), false);
#endif
    }

    template <typename EventType, typename Lambda>
    uint32_t on(Lambda&& lambda) {
        auto func = FastFunction<void(void*)>(
            [lambda = std::forward<Lambda>(lambda)](void* event) mutable { lambda(static_cast<EventType*>(event)); });
#if OPTIMIZE_COMPILE_TIME_EVENT_HASH
        constexpr uint32_t event_hash = hash_event_name(EventType::Name);
        return this->addListener(event_hash, std::move(func), false);
#else
        return this->addListener(hash_event_name(EventType::Name), std::move(func), false);
#endif
    }

    template <typename EventType, typename Lambda>
    uint32_t on(Lambda* lambda) {
        if (UNLIKELY(!lambda)) return 0;
        auto func = FastFunction<void(void*)>([lambda](void* event) { (*lambda)(static_cast<EventType*>(event)); });
#if OPTIMIZE_COMPILE_TIME_EVENT_HASH
        constexpr uint32_t event_hash = hash_event_name(EventType::Name);
        return this->addListener(event_hash, std::move(func), false);
#else
        return this->addListener(hash_event_name(EventType::Name), std::move(func), false);
#endif
    }

    template <typename EventType, typename Lambda>
    uint32_t once(Lambda&& lambda) {
        auto func = FastFunction<void(void*)>(
            [lambda = std::forward<Lambda>(lambda)](void* event) mutable { lambda(static_cast<EventType*>(event)); });
#if OPTIMIZE_COMPILE_TIME_EVENT_HASH
        constexpr uint32_t event_hash = hash_event_name(EventType::Name);
        return this->addListener(event_hash, std::move(func), true);
#else
        return this->addListener(hash_event_name(EventType::Name), std::move(func), true);
#endif
    }

    template <typename EventType, typename Lambda>
    uint32_t once(Lambda* lambda) {
        if (UNLIKELY(!lambda)) return 0;
        auto func = FastFunction<void(void*)>([lambda](void* event) { (*lambda)(static_cast<EventType*>(event)); });
#if OPTIMIZE_COMPILE_TIME_EVENT_HASH
        constexpr uint32_t event_hash = hash_event_name(EventType::Name);
        return this->addListener(event_hash, std::move(func), true);
#else
        return this->addListener(hash_event_name(EventType::Name), std::move(func), true);
#endif
    }

    template <typename EventType>
    void dispatch(EventType& event) {
        ErrorHandler::safe(
            [&]() {
#if OPTIMIZE_COMPILE_TIME_EVENT_HASH
                constexpr uint32_t event_hash = hash_event_name(EventType::Name);
                this->dispatchEvent(&event, event_hash);
#else
                this->dispatchEvent(&event, hash_event_name(EventType::Name));
#endif
            },
            "EventDispatcher::dispatch<T>");
    }

    template <typename EventType>
    size_t removeListener() {
#if OPTIMIZE_COMPILE_TIME_EVENT_HASH
        constexpr uint32_t event_hash = hash_event_name(EventType::Name);
        return this->BaseEventDispatcher<MaxEvents, MaxListeners>::removeListener(event_hash);
#else
        return this->BaseEventDispatcher<MaxEvents, MaxListeners>::removeListener(hash_event_name(EventType::Name));
#endif
    }

    template <typename EventType>
    bool removeListenerById(uint32_t listener_id) {
#if OPTIMIZE_COMPILE_TIME_EVENT_HASH
        constexpr uint32_t event_hash = hash_event_name(EventType::Name);
        return this->BaseEventDispatcher<MaxEvents, MaxListeners>::removeListenerById(event_hash, listener_id);
#else
        return this->BaseEventDispatcher<MaxEvents, MaxListeners>::removeListenerById(hash_event_name(EventType::Name),
                                                                                      listener_id);
#endif
    }

    template <typename EventType>
    size_t count() const {
#if OPTIMIZE_COMPILE_TIME_EVENT_HASH
        constexpr uint32_t event_hash = hash_event_name(EventType::Name);
        return this->BaseEventDispatcher<MaxEvents, MaxListeners>::count(event_hash);
#else
        return this->BaseEventDispatcher<MaxEvents, MaxListeners>::count(hash_event_name(EventType::Name));
#endif
    }
};

using EventDispatcher = EventDispatcherBase<32, 8>;

}  // namespace uniuno
