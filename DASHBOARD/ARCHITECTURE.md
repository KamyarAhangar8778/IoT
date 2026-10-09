# ARCHITECTURE.md — LLM Architecture Map & System Directory

> **LLM Context Optimization**: High-density architectural reference for AI/LLM context efficiency.

## 1. System Overview & Tech Stack
- **Framework**: Next.js 15 (App Router, Static SPA Export `output: "export"`). No `/api/*` server routes.
- **State Engine**: Zustand modular store (`useIoTStore`) with split slices.
- **Micro-Frontend Architecture**: Modular feature isolation in `features/` + single-responsibility modules (< 150 lines/file).
- **Styling & Aesthetics**: Tailwind CSS v4 + Element Engine CSS parser + CSS custom properties (Achaemenid/Persian theme).
- **Real-Time IoT & Sync**: MQTT (`wss://broker.emqx.io:8084/mqtt`) + Cloudflare Workers sync engine + ESP32 state sync.
- **Default System Constants**: Default Font = Vazirmatn (`vazir`), Sidebar = Collapsed (`isSidebarCollapsed: true`), Header Root = `<header>`.

---

## 2. Directory Taxonomy & Responsibilities

```
/
├── app/                        # Next.js App Router (layout.tsx, page.tsx, globals.css)
├── components/                 # Global UI & Header System
│   ├── MasterHeader/           # Responsive Header Dispatcher & Components
│   │   ├── HorizontalHeader/   # Unified Horizontal Header (<header>)
│   │   ├── VerticalHeader/     # Collapsible Left Sidebar Header (<header>)
│   │   ├── BrandBox/           # Logo & Title Banner
│   │   ├── ClockWidget/        # Jalali/Gregorian Real-Time Clock
│   │   ├── GlobalRuleSettings/ # Global IoT Rules & Automation Segment Cards
│   │   ├── QuickAccessControls/# Fast Action Buttons
│   │   └── VoiceCommandButton/ # Web Speech API Button & Handlers
│   ├── QueryProvider.tsx       # TanStack Query Wrapper
│   └── AudioInitializer.tsx    # Audio Context Bootstrapper
├── features/                   # Core Business Domains
│   ├── dashboard/              # Page Composition & Shell Layout
│   │   ├── components/layout/  # DashboardContainer, Header, Main, Footer, Drawers
│   │   ├── context/            # DashboardContext provider
│   │   └── hooks/              # Layout & Swipe Gestures
│   ├── iot/                    # Core IoT Engine & Micro-Controller Interface
│   │   ├── components/         # Workspace, Cards, Drawers, Cuneiform FX
│   │   │   ├── AutomationsDrawer/   # Automation Builder Drawer
│   │   │   ├── modules-drawer/      # Pin/Segment Config Drawer
│   │   │   ├── sortable-group/      # Drag & Drop Group Containers
│   │   │   ├── sortable-segment-card/# Individual Pin/Sensor Control Cards
│   │   │   └── cuneiform-background/ # Canvas/Worker Matrix Engine
│   │   ├── engine/             # Element Engine CSS Custom Property Parser
│   │   ├── hooks/
│   │   │   ├── store/          # Zustand Central State & Slices
│   │   │   └── achaemenidState/# Compound State Coordination
│   │   └── services/           # External Drivers (MQTT, Cloudflare, ESP32)
│   └── settings/               # System Preferences & Customizers
│       └── components/         # Discrete Config Sections (audio, colors, layout, etc.)
└── lib/                        # Cross-Cutting Shared Utilities
    └── audio/                  # Web Audio API Engine (SoundManager, AmbientManager)
```

---

## 3. Core State Architecture (Zustand Slices)

| Slice File (`features/iot/hooks/store/slices/`) | Responsibility & Primary State |
| :--- | :--- |
| `createAestheticSlice.ts` | Theme, Font (`vazir`), Header layout (`top`/`left`), Sidebar (`isSidebarCollapsed`), Matrix FX |
| `createConfigSlice.ts` | ESP32 device info, preferences, firmware metadata |
| `createSegmentsSlice.ts` | Pins, segment CRUD, relay states, auto-off timers |
| `createGroupsSlice.ts` | Group grid columns (1-3), ordering, layout configs |
| `createSyncSlice.ts` | MQTT broker status, Cloudflare worker sync state |
| `createSystemSlice.ts` | WiFi status, reboot counters, device telemetry |
| `createUiSlice.ts` | Low-data mode, active drawers, voice transcript, toast notifications |
| `createMenuSlice.ts` | Drawer visibility (`isMenuOpen`, `isModulesMenuOpen`, `isAutomationsMenuOpen`) |

---

## 4. Key Execution Flows

### A. Real-Time Telemetry & Sync
`ESP32 Hardware` ↔ `MQTT Service (features/iot/services/mqtt)` ↔ `useSyncSlice` ↔ `Zustand Store` ↔ `UI Components`

### B. Element Engine CSS Pipeline
`Settings / Presets` → `elementConfig` in Store → `ElementEngineStyleProvider` → `cssGenerator.ts` → Injected Dynamic `<style id="element-engine-dynamic-styles">`

### C. Audio Feedback Loop
`UI Action` → `SoundManager` → `playClickSynth()` / `playToggleOnSynth()` → `Web Audio Oscillator` (Zero external audio assets required for FX).

---

## 5. LLM Code Modification Rules & Guidelines
2. **Path Aliases**: Always use `@/*` imports (maps to project root).
3. **Icons**: Use `lucide-react` only. Do not inline SVGs unless required for dynamic border animations.
4. **Header Tag**: Use `<header>` for header containers.
5. **Types**: Import types explicitly from relative `types.ts` files within each module.
