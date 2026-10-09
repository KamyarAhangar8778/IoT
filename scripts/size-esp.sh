#!/usr/bin/env bash

# ==============================================================================
# Achaemenid IoT - ESP32 Firmware Size & Memory Profiler
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/ESP-CODE-S/.pio/build/esp32dev"
ELF_FILE="$BUILD_DIR/firmware.elf"

echo "=========================================================="
echo "      Achaemenid ESP32 Memory & Size Profiler             "
echo "=========================================================="

if [ -f "$ELF_FILE" ]; then
    echo "[Profiler] Found compiled binary: $ELF_FILE"
    echo ""
    if command -v pio &>/dev/null; then
        pio run -d "$ROOT_DIR" -t size 2>/dev/null || true
    fi
    echo ""
    echo "--- Section Breakdown ---"
    if command -v size &>/dev/null; then
        size -A "$ELF_FILE" 2>/dev/null | grep -E "(dram0|iram0|flash|text|data|bss)" || size "$ELF_FILE"
    fi
else
    echo "[Profiler] Firmware binary not yet built. Running static allocation profile..."
    echo ""
    echo "--- Static Data Structures Size Breakdown (Estimation) ---"
    echo "  - PinRegistry (16 pins x ~48 bytes)      : ~768 bytes (RAM)"
    echo "  - SmallVector Stack Storage              : Inline stack (0 heap)"
    echo "  - StaticHashMap (Hash Pre-filter table)  : ~1.2 KB (RAM)"
    echo "  - WebSocket JSON Format Stack Buffer     : 256 bytes (Stack transient)"
    echo "  - MQTT Binary Fast-Path Frame Buffer     : ~128 bytes (Stack transient)"
    echo "  - EventBus Dispatch Slot Array           : ~512 bytes (RAM)"
    echo ""
    echo "[Info] To profile the actual compiled ELF, run: 'npm run compile:esp && npm run size:esp'"
fi
echo "=========================================================="
