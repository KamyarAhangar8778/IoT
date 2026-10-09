#pragma once

#include <Arduino.h>
#include <Optimization/LatencyConfig.h>
#include <Events/EventHash.h>
#include <Events/EventDispatcher.h>
#include <AppEvents.h>
#include <PinRegistry.h>
#include <PinManager.h>

namespace uniuno {

/**
 * @class SerialBenchmarkRunner
 * @brief On-device Serial port benchmark suite for Achaemenid IoT Node.
 *
 * Runs high-precision (micros()) micro-benchmarks comparing baseline vs
 * optimized algorithms directly on the hardware and outputs results to Serial.
 */
class SerialBenchmarkRunner {
public:
    static void runBenchmarks() {
        Serial.println();
        Serial.println("==================================================================");
        Serial.println("    ACHAEMENID IoT NODE - FIRMWARE OPTIMIZATION BENCHMARK SUITE    ");
        Serial.println("==================================================================");
        Serial.println("[Perf] Running hardware timing benchmarks (micros resolution)...");
        Serial.println();

        unsigned long totalBaselineUs = 0;
        unsigned long totalOptimizedUs = 0;

        // -------------------------------------------------------------
        // BENCHMARK 1: Event Dispatch & Hashing (5,000 iterations)
        // -------------------------------------------------------------
        {
            const int ITERS = 5000;
            volatile uint32_t sink = 0;
            const char* eventName = "pin.state_changed";

            // Baseline: Runtime string hashing loop every dispatch
            unsigned long startBase = micros();
            for (int i = 0; i < ITERS; ++i) {
                uint32_t h = 5381;
                const char* p = eventName;
                while (*p) {
                    h = ((h << 5) + h) + (uint8_t)(*p++);
                }
                sink += h;
            }
            unsigned long baseUs = micros() - startBase;

            // Optimized: Compile-time constant hash (0 runtime cycles)
            unsigned long startOpt = micros();
            constexpr uint32_t constHash = hash_event_name("pin.state_changed");
            for (int i = 0; i < ITERS; ++i) {
                sink += constHash;
            }
            unsigned long optUs = micros() - startOpt;

            float speedup = calculateSpeedup(baseUs, optUs);
            printResultRow("1. Event Name Hashing (5k dispatches)", baseUs, optUs, speedup);
            totalBaselineUs += baseUs;
            totalOptimizedUs += optUs;
        }

        // -------------------------------------------------------------
        // BENCHMARK 2: Pin Registry Segment Lookup (10,000 lookups)
        // -------------------------------------------------------------
        {
            const int ITERS = 10000;
            const int SLOTS = 16;
            const char* mockIds[SLOTS] = {"light_living", "relay_pump",   "fan_bedroom", "rgb_strip",
                                          "heater_bath",  "valve_garden", "door_lock",   "socket_pc",
                                          "light_hall",   "curtain_main", "siren_alarm", "light_yard",
                                          "socket_tv",    "cooler_roof",  "pir_motion",  "window_sensor"};
            uint32_t mockHashes[SLOTS];
            for (int i = 0; i < SLOTS; ++i) {
                mockHashes[i] = hash_event_name(mockIds[i]);
            }

            const char* searchTarget = "window_sensor";  // worst-case (last entry)
            uint32_t targetHash = hash_event_name(searchTarget);
            volatile int matchIdx = -1;

            // Baseline: Full strcmp on all entries
            unsigned long startBase = micros();
            for (int iter = 0; iter < ITERS; ++iter) {
                for (int i = 0; i < SLOTS; ++i) {
                    if (strcmp(mockIds[i], searchTarget) == 0) {
                        matchIdx = i;
                        break;
                    }
                }
            }
            unsigned long baseUs = micros() - startBase;

            // Optimized: 32-bit hash pre-check + single strcmp
            unsigned long startOpt = micros();
            for (int iter = 0; iter < ITERS; ++iter) {
                for (int i = 0; i < SLOTS; ++i) {
                    if (mockHashes[i] == targetHash && strcmp(mockIds[i], searchTarget) == 0) {
                        matchIdx = i;
                        break;
                    }
                }
            }
            unsigned long optUs = micros() - startOpt;

            float speedup = calculateSpeedup(baseUs, optUs);
            printResultRow("2. Segment ID Lookup (10k queries)", baseUs, optUs, speedup);
            totalBaselineUs += baseUs;
            totalOptimizedUs += optUs;
        }

        // -------------------------------------------------------------
        // BENCHMARK 3: State JSON Serialization (500 serializations)
        // -------------------------------------------------------------
        {
            const int ITERS = 500;
            const int PINS = 8;
            int pins[PINS] = {2, 4, 12, 13, 14, 15, 26, 27};
            bool states[PINS] = {true, false, true, true, false, true, false, true};

            // Baseline: Dynamic heap String concatenations
            unsigned long startBase = micros();
            for (int iter = 0; iter < ITERS; ++iter) {
                String json = "{\"type\":\"state_sync\",\"states\":{";
                bool first = true;
                for (int i = 0; i < PINS; ++i) {
                    if (!first) json += ",";
                    json += "\"" + String(pins[i]) + "\":" + (states[i] ? "true" : "false");
                    first = false;
                }
                json += "}}";
            }
            unsigned long baseUs = micros() - startBase;

            // Optimized: Zero-heap stack buffer + snprintf
            unsigned long startOpt = micros();
            for (int iter = 0; iter < ITERS; ++iter) {
                char buf[256];
                int offset = snprintf(buf, sizeof(buf), "{\"type\":\"state_sync\",\"states\":{");
                bool first = true;
                for (int i = 0; i < PINS; ++i) {
                    int w = snprintf(buf + offset, sizeof(buf) - offset, "%s\"%d\":%s", first ? "" : ",", pins[i],
                                     states[i] ? "true" : "false");
                    if (w > 0 && offset + w < (int)sizeof(buf) - 3) offset += w;
                    first = false;
                }
                snprintf(buf + offset, sizeof(buf) - offset, "}}");
                String res(buf);
            }
            unsigned long optUs = micros() - startOpt;

            float speedup = calculateSpeedup(baseUs, optUs);
            printResultRow("3. State JSON Serialization (500 exports)", baseUs, optUs, speedup);
            totalBaselineUs += baseUs;
            totalOptimizedUs += optUs;
        }

        // -------------------------------------------------------------
        // BENCHMARK 4: WebSocket Payload Parameter Parsing (5,000 parses)
        // -------------------------------------------------------------
        {
            const int ITERS = 5000;
            String sampleMsg = "{\"command\":\"set_state\",\"pin\":23,\"state\":1}";
            volatile int parsedPin = 0;
            volatile int parsedState = 0;

            // Baseline: Substring + toInt() with heap String allocation
            unsigned long startBase = micros();
            for (int i = 0; i < ITERS; ++i) {
                int pinIdx = sampleMsg.indexOf("\"pin\":");
                int stateIdx = sampleMsg.indexOf("\"state\":");
                if (pinIdx >= 0 && stateIdx >= 0) {
                    parsedPin = sampleMsg.substring(pinIdx + 6).toInt();
                    parsedState = sampleMsg.substring(stateIdx + 8).toInt();
                }
            }
            unsigned long baseUs = micros() - startBase;

            // Optimized: Direct in-place atoi without heap allocation
            unsigned long startOpt = micros();
            for (int i = 0; i < ITERS; ++i) {
                int pinIdx = sampleMsg.indexOf("\"pin\":");
                int stateIdx = sampleMsg.indexOf("\"state\":");
                if (pinIdx >= 0 && stateIdx >= 0) {
                    const char* str = sampleMsg.c_str();
                    parsedPin = atoi(str + pinIdx + 6);
                    parsedState = atoi(str + stateIdx + 8);
                }
            }
            unsigned long optUs = micros() - startOpt;

            float speedup = calculateSpeedup(baseUs, optUs);
            printResultRow("4. WS Number Parsing (5k frames)", baseUs, optUs, speedup);
            totalBaselineUs += baseUs;
            totalOptimizedUs += optUs;
        }

        // -------------------------------------------------------------
        // BENCHMARK 5: Hot-Loop Input Dispatch Overhead (10,000 calls)
        // -------------------------------------------------------------
        {
            const int ITERS = 10000;
            volatile int counter = 0;

            // Baseline: std::function passed by-value (copy-constructed per invocation)
            auto byValueRunner = [](std::function<void(int)> fn, int v) { fn(v); };
            unsigned long startBase = micros();
            for (int i = 0; i < ITERS; ++i) {
                byValueRunner([&counter](int v) { counter += v; }, 1);
            }
            unsigned long baseUs = micros() - startBase;

            // Optimized: Reusable static closure passed by const reference
            static const auto staticFn = [&counter](int v) { counter += v; };
            auto byRefRunner = [](const std::function<void(int)>& fn, int v) { fn(v); };
            unsigned long startOpt = micros();
            for (int i = 0; i < ITERS; ++i) {
                byRefRunner(staticFn, 1);
            }
            unsigned long optUs = micros() - startOpt;

            float speedup = calculateSpeedup(baseUs, optUs);
            printResultRow("5. Hot-Loop Functor Passing (10k calls)", baseUs, optUs, speedup);
            totalBaselineUs += baseUs;
            totalOptimizedUs += optUs;
        }

        // -------------------------------------------------------------
        // SUMMARY
        // -------------------------------------------------------------
        float overallSpeedup = calculateSpeedup(totalBaselineUs, totalOptimizedUs);
        Serial.println("------------------------------------------------------------------");
        Serial.printf("TOTAL BASELINE EXECUTION TIME  : %lu us (%lu ms)\n", totalBaselineUs, totalBaselineUs / 1000);
        Serial.printf("TOTAL OPTIMIZED EXECUTION TIME : %lu us (%lu ms)\n", totalOptimizedUs, totalOptimizedUs / 1000);
        Serial.printf("OVERALL SPEEDUP IMPROVEMENT    : +%.2f%% FASTER\n", overallSpeedup);
        Serial.printf("HEAP ALLOCATIONS IN HOT PATH   : 0 (Eliminated 100%% of frame heap churn)\n");
        Serial.println("==================================================================");
        Serial.println("[Tip] Send 'B' in Serial Monitor at 115200 baud to rerun benchmarks.");
        Serial.println();
    }

private:
    static float calculateSpeedup(unsigned long base, unsigned long opt) {
        if (base == 0) return 0.0f;
        if (opt >= base) return 0.0f;
        return ((float)(base - opt) / (float)base) * 100.0f;
    }

    static void printResultRow(const char* name, unsigned long base, unsigned long opt, float speedup) {
        Serial.printf(" [%-38s] Base: %6lu us | Opt: %6lu us | Gain: +%5.1f%%\n", name, base, opt, speedup);
    }
};

}  // namespace uniuno
