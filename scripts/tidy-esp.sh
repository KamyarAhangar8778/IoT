#!/usr/bin/env bash
set -e

# ==============================================================================
# Achaemenid IoT - ESP32 clang-tidy Analyzer
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v clang-tidy &>/dev/null; then
    echo "[Error] clang-tidy is not installed."
    exit 1
fi

echo "[clang-tidy] Running clang-tidy static analysis on ESP C++ sources..."

FILES=$(find "$ROOT_DIR/ESP-CODE-S/src" -name "*.cpp" 2>/dev/null)

for f in $FILES; do
    echo "  -> Analyzing $(basename "$f")..."
    clang-tidy "$f" \
        --config-file="$ROOT_DIR/ESP-CODE-S/.clang-tidy" \
        -- \
        -std=c++17 \
        -DESP32 \
        -DARDUINO=10819 \
        -I"$ROOT_DIR/ESP-CODE-S/include" \
        -I"$ROOT_DIR/ESP-CODE-S/lib" \
        -I"$ROOT_DIR/ESP-CODE-S/src" \
        2>/dev/null || true
done

echo "[clang-tidy] Analysis complete."
