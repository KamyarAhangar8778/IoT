#!/usr/bin/env bash
set -e

# ==============================================================================
# Achaemenid IoT - ESP32 C++ Static Analysis & Linter (cppcheck)
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v cppcheck &>/dev/null; then
    echo "[Error] cppcheck is not installed. Run 'apt-get install -y cppcheck'"
    exit 1
fi

echo "[Linter] Running cppcheck on ESP-CODE-S codebase..."

cppcheck \
    --enable=warning,performance,portability \
    --inline-suppr \
    --suppress=missingIncludeSystem \
    --suppress=missingInclude \
    --suppress=unmatchedSuppression \
    --suppress=unusedFunction \
    --std=c++17 \
    --language=c++ \
    -I"$ROOT_DIR/ESP-CODE-S/include" \
    -I"$ROOT_DIR/ESP-CODE-S/lib" \
    "$ROOT_DIR/ESP-CODE-S/src" \
    "$ROOT_DIR/ESP-CODE-S/lib"

echo "[Linter] Static analysis completed successfully."
