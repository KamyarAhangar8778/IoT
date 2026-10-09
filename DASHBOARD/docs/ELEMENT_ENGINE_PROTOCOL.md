# Element Engine Protocol Specification v1.0

## 📌 Overview
The **Element Engine** is a high-performance visual style interpreter and Windows Registry-like customization engine for the Achaemenid IoT Smart Home Dashboard. It allows power users, developers, and third-party UI design builders to completely redefine the visual aesthetic of the dashboard using standard JSON files adhering to the `.element.json` protocol.

---

## 🛠️ File Protocol Format (`.element.json`)

An `.element.json` file consists of 8 core style sections and metadata:

```json
{
  "meta": {
    "id": "custom-theme-id",
    "name": "Custom Theme Name",
    "author": "Designer Name",
    "version": "1.0",
    "description": "Short theme description"
  },
  "global": {
    "borderRadiusCard": "16px",
    "borderRadiusButton": "12px",
    "fontFamily": "var(--font-vazir)",
    "shadowIntensity": "0 10px 30px rgba(0,0,0,0.3)",
    "blurBackdrop": "12px",
    "primaryAccent": "#3b82f6",
    "secondaryAccent": "#8b5cf6"
  },
  "header": {
    "background": "rgba(15, 23, 42, 0.75)",
    "borderBottom": "1px solid rgba(255, 255, 255, 0.08)",
    "clockColor": "#38bdf8",
    "brandTitleColor": "#f8fafc",
    "voiceButtonBg": "rgba(59, 130, 246, 0.15)"
  },
  "groups": {
    "cardBg": "rgba(30, 41, 59, 0.5)",
    "cardBorder": "1px solid rgba(255, 255, 255, 0.06)",
    "headerTitleColor": "#f1f5f9",
    "headerBadgeBg": "rgba(51, 65, 85, 0.6)",
    "gapSpacing": "16px"
  },
  "segments": {
    "activeCardBg": "rgba(37, 99, 235, 0.2)",
    "inactiveCardBg": "rgba(15, 23, 42, 0.4)",
    "activeBorder": "1px solid rgba(59, 130, 246, 0.6)",
    "inactiveBorder": "1px solid rgba(255, 255, 255, 0.05)",
    "activeGlow": "0 0 20px rgba(59, 130, 246, 0.3)",
    "iconActiveColor": "#60a5fa",
    "iconInactiveColor": "#64748b",
    "toggleOnBg": "#2563eb",
    "toggleOffBg": "#334155"
  },
  "buttons": {
    "primaryBg": "#2563eb",
    "primaryText": "#ffffff",
    "secondaryBg": "rgba(51, 65, 85, 0.7)",
    "secondaryText": "#e2e8f0",
    "dangerBg": "#dc2626",
    "hoverScale": "1.02"
  },
  "drawers": {
    "background": "rgba(15, 23, 42, 0.95)",
    "headerBg": "rgba(30, 41, 59, 0.8)",
    "tabActiveBg": "#2563eb",
    "tabActiveText": "#ffffff",
    "borderColor": "rgba(255, 255, 255, 0.1)"
  },
  "matrixBg": {
    "color": "#00ffcc",
    "opacity": 0.15,
    "gridSize": 32,
    "twinkleSpeed": 3
  },
  "customVars": {
    "--custom-card-hover": "rgba(255, 255, 255, 0.05)"
  }
}
```

---

## 🏛️ Windows Registry Key Paths
The engine supports direct key path lookups and edits, e.g.:
- `global.primaryAccent`
- `segments.activeCardBg`
- `segments.activeGlow`
- `buttons.hoverScale`
- `matrixBg.color`

---

## 🎨 Built-in Engine Presets
1. **default-standard**: Classic clean dashboard theme.
2. **cyberpunk-neon**: Glowing magenta & cyan neon aesthetic.
3. **persian-gold**: Luxurious Achaemenid royal gold theme.

---

## 🔧 Developer Integration
To integrate or parse protocol files programmatically:
```ts
import { parseElementProtocol, generateElementEngineCSS } from "@/features/iot/engine";

const result = parseElementProtocol(jsonString);
if (result.success && result.config) {
  const css = generateElementEngineCSS(result.config);
  // Apply CSS to DOM
}
```
