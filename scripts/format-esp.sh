#!/usr/bin/env bash
set -e

# ==============================================================================
# Achaemenid IoT - ESP32 C++ Code Formatter (clang-format)
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIRS=(
    "$ROOT_DIR/ESP-CODE-S/src"
    "$ROOT_DIR/ESP-CODE-S/include"
    "$ROOT_DIR/ESP-CODE-S/lib"
)

if ! command -v clang-format &>/dev/null; then
    echo "[Error] clang-format is not installed. Run 'apt-get install -y clang-format'"
    exit 1
fi

CHECK_MODE=0
if [[ "$1" == "--check" ]]; then
    CHECK_MODE=1
fi

FILES=$(find "${TARGET_DIRS[@]}" -type f \( -name "*.cpp" -o -name "*.h" -o -name "*.hpp" -o -name "*.c" \) 2>/dev/null)

if [ -z "$FILES" ]; then
    echo "[Formatter] No C++ files found."
    exit 0
fi

FILE_COUNT=$(echo "$FILES" | wc -l)

if [ "$CHECK_MODE" -eq 1 ]; then
    echo "[Formatter] Checking formatting for $FILE_COUNT ESP C++ files..."
    VIOLATIONS=0
    for f in $FILES; do
        if ! clang-format --dry-run --Werror "$f" 2>/dev/null; then
            echo "  [FAIL] $f requires formatting"
            VIOLATIONS=$((VIOLATIONS + 1))
        fi
    done
    if [ "$VIOLATIONS" -gt 0 ]; then
        echo "[Formatter] $VIOLATIONS file(s) need formatting. Run 'npm run format:esp' to fix."
        exit 1
    else
        echo "[Formatter] All $FILE_COUNT C++ files are correctly formatted!"
    fi
else
    echo "[Formatter] Formatting $FILE_COUNT ESP C++ files with clang-format..."
    echo "$FILES" | xargs -P 4 -n 20 clang-format -i
    echo "[Formatter] Successfully formatted $FILE_COUNT C++ files."
fi
