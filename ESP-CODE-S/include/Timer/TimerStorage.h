#pragma once

#include "TimerConfig.h"
#include "TimerTypes.h"
#include "Optimization/StaticArray.h"
#include "Optimization/SortStrategy.h"
#include "Optimization/CompilerTraits.h"
#include <algorithm>

namespace uniuno {

/**
 * @class TimerStorage
 * @brief Manages memory pools and O(1) id->node lookups for timers.
 *
 * Uses Generational Slot Map for absolute O(1) lookup without any Hash Maps.
 * Uses Min-Heap for O(log N) fast insertions.
 */
template <size_t MaxTimers = 32>
class TimerStorage {
public:
    TimerStorage() : timeout_count_(0), interval_count_(0), generation_counter_(0) {
        for (size_t i = 0; i < MaxTimers; i++) {
            free_nodes_.push_back(&pool_[i]);
        }
    }

    ~TimerStorage() = default;

    TimerNode* allocateNode(TimerId& out_id) {
        if (UNLIKELY(free_nodes_.empty())) return nullptr;
        TimerNode* node = free_nodes_.back();
        free_nodes_.pop_back();

        uint16_t index = node - pool_;
        uint16_t gen = ++generation_counter_;
        if (gen == 0) gen = ++generation_counter_;  // Skip 0

        out_id = TimerId{((uint32_t)gen << 16) | index};
        return node;
    }

    void freeNode(TimerNode* node) {
        node->~TimerNode();
        new (node) TimerNode();  // Re-construct to clean state
        node->state = TimerState::Inactive;
        free_nodes_.push_back(node);
    }

    HOT_PATH void addActiveNode(TimerNode* node) {
        if (UNLIKELY(active_timers_.full())) {
            freeNode(node);  // Pool leak fix
            return;
        }

#ifdef TIMER_HEAP_OPTIMIZED
        active_timers_.push_back(node);
        node->heap_index_ = active_timers_.size() - 1;  // last slot until a sift moves it
        heapSiftUp(active_timers_.size() - 1);
#else
        HeapSortStrategy::add_sorted(active_timers_, std::move(node), [](const TimerNode* a, const TimerNode* b) {
            return (long)(a->next_call_ms - b->next_call_ms) > 0;  // Min-Heap
        });
#endif
    }

    TimerNode* lookup(TimerId id) {
        if (id.value == 0) return nullptr;
        uint16_t index = id.getIndex();
        if (index >= MaxTimers) return nullptr;
        TimerNode* node = &pool_[index];
        if (node->id == id && node->state != TimerState::Inactive) return node;
        return nullptr;
    }

    const TimerNode* lookup_const(TimerId id) const {
        if (id.value == 0) return nullptr;
        uint16_t index = id.getIndex();
        if (index >= MaxTimers) return nullptr;
        const TimerNode* node = &pool_[index];
        if (node->id == id && node->state != TimerState::Inactive) return node;
        return nullptr;
    }

#ifdef TIMER_HEAP_OPTIMIZED
    bool removeActiveNode(TimerNode* node) {
        uint16_t idx = node->heap_index_;
        if (UNLIKELY(idx >= active_timers_.size() || active_timers_[idx] != node)) {
            // Index drifted (shouldn't happen if every heap mutation keeps it in sync);
            // fall back to a scan so behavior is still correct.
            for (size_t i = 0; i < active_timers_.size(); i++) {
                if (active_timers_[i] == node) {
                    idx = (uint16_t)i;
                    goto found;
                }
            }
            return false;
        }
    found:
        if (idx + 1 == active_timers_.size()) {
            // Last element: plain pop.
            active_timers_.pop_back();
        } else {
            heapSwap(idx, active_timers_.size() - 1);
            active_timers_.pop_back();
            // The node formerly at the end now lives at `idx`: restore heap order.
            if (idx > 0 && heapBefore(active_timers_[idx], active_timers_[parent(idx)])) {
                heapSiftUp(idx);
            } else {
                heapSiftDown(idx);
            }
        }
        node->heap_index_ = 0;  // No longer in the heap
        return true;
    }

    /// @brief Remove and return the root (earliest deadline) of the active heap.
    /// Used by TimerProcessor::process() so expired timers are drained in O(log n).
    TimerNode* popActiveTop() {
        if (UNLIKELY(active_timers_.empty())) return nullptr;
        TimerNode* top = active_timers_[0];
        active_timers_[0]->heap_index_ = 0;  // Root is leaving the heap
        if (active_timers_.size() == 1) {
            active_timers_.pop_back();
            return top;
        }
        heapSwap(0, active_timers_.size() - 1);
        active_timers_.pop_back();
        heapSiftDown(0);
        return top;
    }
#else
    bool removeActiveNode(TimerNode* node) {
        for (size_t i = 0; i < active_timers_.size(); i++) {
            if (active_timers_[i] == node) {
                active_timers_.erase(i);
                std::make_heap(active_timers_.begin(), active_timers_.end(),
                               [](const TimerNode* a, const TimerNode* b) {
                                   return (long)(a->next_call_ms - b->next_call_ms) > 0;
                               });
                return true;
            }
        }
        return false;
    }
#endif

    bool removePausedNode(TimerNode* node) {
        for (size_t i = 0; i < paused_timers_.size(); i++) {
            if (paused_timers_[i] == node) {
#ifdef TIMER_HEAP_OPTIMIZED
                // paused_timers_ is unordered: swap-with-last avoids the O(N) shift.
                paused_timers_[i] = paused_timers_.back();
                paused_timers_.pop_back();
#else
                paused_timers_.erase(i);
#endif
                return true;
            }
        }
        return false;
    }

    void clear() {
        active_timers_.clear();
        paused_timers_.clear();
        free_nodes_.clear();
        generation_counter_ = 0;
        for (size_t i = 0; i < MaxTimers; i++) {
            pool_[i].state = TimerState::Inactive;
#ifdef TIMER_HEAP_OPTIMIZED
            pool_[i].heap_index_ = 0;
#endif
            free_nodes_.push_back(&pool_[i]);
        }
        timeout_count_ = 0;
        interval_count_ = 0;
    }

    inline size_t count() const {
        return active_timers_.size() + paused_timers_.size();
    }
    inline size_t countTimeouts() const {
        return timeout_count_;
    }
    inline size_t countIntervals() const {
        return interval_count_;
    }

    inline void incTimeouts() {
        timeout_count_++;
    }
    inline void decTimeouts() {
        if (timeout_count_ > 0) timeout_count_--;
    }
    inline void incIntervals() {
        interval_count_++;
    }
    inline void decIntervals() {
        if (interval_count_ > 0) interval_count_--;
    }

    StaticArray<TimerNode*, MaxTimers>& getActiveTimers() {
        return active_timers_;
    }
    const StaticArray<TimerNode*, MaxTimers>& getActiveTimers() const {
        return active_timers_;
    }
    StaticArray<TimerNode*, MaxTimers>& getPausedTimers() {
        return paused_timers_;
    }

private:
#ifdef TIMER_HEAP_OPTIMIZED
    /// @brief Min-heap ordering: a fires earlier than b → a goes first.
    static FORCE_INLINE bool heapBefore(const TimerNode* a, const TimerNode* b) {
        return a->next_call_ms < b->next_call_ms;
    }
    static FORCE_INLINE uint16_t parent(uint16_t i) {
        return (i - 1) >> 1;
    }
    static FORCE_INLINE uint16_t left(uint16_t i) {
        return (i << 1) + 1;
    }

    FORCE_INLINE void heapSwap(uint16_t i, uint16_t j) {
        std::swap(active_timers_[i], active_timers_[j]);
        active_timers_[i]->heap_index_ = i;
        active_timers_[j]->heap_index_ = j;
    }

    /// @brief Bubble the node at @p i up until the heap property holds.
    void heapSiftUp(uint16_t i) {
        while (i > 0) {
            uint16_t p = parent(i);
            if (!heapBefore(active_timers_[i], active_timers_[p])) break;
            heapSwap(i, p);
            i = p;
        }
    }

    /// @brief Push the node at @p i down toward the smallest child until order holds.
    void heapSiftDown(uint16_t i) {
        const uint16_t n = active_timers_.size();
        while (true) {
            uint16_t smallest = i;
            const uint16_t l = left(i);
            if (l < n && heapBefore(active_timers_[l], active_timers_[smallest])) smallest = l;
            const uint16_t r = l + 1;
            if (r < n && heapBefore(active_timers_[r], active_timers_[smallest])) smallest = r;
            if (smallest == i) break;
            heapSwap(i, smallest);
            i = smallest;
        }
    }
#endif

    TimerNode pool_[MaxTimers];
    StaticArray<TimerNode*, MaxTimers> free_nodes_;
    StaticArray<TimerNode*, MaxTimers> active_timers_;
    StaticArray<TimerNode*, MaxTimers> paused_timers_;

    uint16_t generation_counter_;
    uint16_t timeout_count_;
    uint16_t interval_count_;
};

}  // namespace uniuno
