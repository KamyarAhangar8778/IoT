# ARCHITECTURE.md — Project Overview

> Purpose: gives a fast mental map of every top-level folder and file in this repo so you
> can orient yourself before reading code. Read this first on any session start.
>
> For the *system-level* design philosophy (layers, data allocation, ESP-NOW edges,
> why ESP32 RAM is the single source of truth) see [`docs/Architecture.md`](docs/Architecture.md)
> and [`docs/Project-Description.md`](docs/Project-Description.md).

---

## 1. What this project is

**Achaemenid IoT** — a smart-home platform with three moving parts:

1. **ESP32 firmware** (`ESP-CODE-S/`) — the "smart core" hub. Runs 4 protocols at once
   (MQTT client, WebSocket client to cloud, local WebSocket server on :81, ESP-NOW to edge
   nodes) using a dual-core async architecture. Holds device state in RAM.
2. **Web Dashboard** (`DASHBOARD/`) — a Next.js/React app, dynamically generated from a
   config JSON. Talks to the hub via Local WebSocket (in-home) or MQTT (remote).
3. **Cloudflare backend** (`CloudFlare/`, referenced by the code graph but **not present
   on disk in this checkout**) — Workers + Durable Objects + KV for config, auth, routing.

Build entry for firmware: `platformio.ini` (`src_dir = ESP-CODE-S/src`).

---

## 2. Top-level layout

| Path | What it is |
|------|------------|
| `ESP-CODE-S/` | ESP32 firmware (C++). Main deliverable. See §3. |
| `DASHBOARD/` | Next.js dashboard frontend (TypeScript/React). See §4. |
| `docs/` | Human-readable design & protocol docs. See §6. |
| `platformio.ini` | Firmware build config: board `esp32dev`, arduino framework, lib deps, include paths. |
| `GEMINI.md` | Project instructions for agents (read automatically). |


> `node_modules/`, `.pio/`, `.git/`, `out/` are build/dependency caches — ignored.

---

## 3. `ESP-CODE-S/` — ESP32 Firmware

### 3.1 `include/` — Header-only modules (the reusable core)
Compiled as part of `src/`. This is the bulk of the smart logic:

- **`Core/`** — `Async/` executor (global async task poller), `Error/` error types.
- **`Events/`** — Event bus (`EventDispatcher`, `IEventDispatcher`, `BaseEventDispatcher`),
  `EventHash`. Decoupled pub/sub between subsystems.
- **`MQTT/`** — MQTT client wrapper, callbacks, config, packet builder, protocol/transport
  layers, constants, types.
- **`Network/`** — `WiFi/` and `HTTP/` abstractions.
- **`Optimization/`** — custom high-performance, no-heap containers built for speed on MCU:
  `StaticString`, `StaticArray`, `StaticHashMap`, `SmallVector`, `StaticQueue`,
  `AtomicSharedPtr`, `FastFunction`, `SortStrategy`, `ArrayBase`, `HashMapBase`,
  `TypeTraits`, `CompilerTraits`. (See `Timer/` for why these exist.)
- **`Timer/`** — sophisticated timer subsystem (19 files): `Timer`, `TimerManager`,
  `TimerBuilder`, `TimerGroupsImpl`, `TimerHandle(Impl)`, `TimerStorage`, `TimerProcessor`,
  hardware timer impl, units/config/types. The hub uses one hardware timer at 1ms resolution
  driving all scheduled work.
- **`Utilities/`** — `logging.h`, `function_traits.h`, `sync_clock.h`.

### 3.2 `lib/` — Feature libraries (PlatformIO libs, each with its own `src/`)
- **`AchaemenidBootManager/`** — async boot sequence; `BootManager`, `ISegmentStorage`,
  `NvsSegmentStorage` (persists config in NVS).
- **`AchaemenidConfigProtocol/`** — parses the dashboard config JSON (`ConfigTypes.h`,
  `IConfigParser.h`, `AchaemenidConfigProtocol.cpp`).
- **`AchaemenidMQTT/`** — MQTT integration: `AchaemenidMQTT.h` + `core/` + `parsers/`.
- **`AchaemenidNetwork/`** — network manager (`INetworkManager.h`, `AchaemenidNetwork`).
  Multi-AP WiFi handling.
- **`AchaemenidRuleEngine/`** — automation/rule evaluation: `RuleEngine` + `evaluators/` +
  `strategies/`.
- **`AchaemenidWebSocket/`** — WebSocket client (cloud) & server (local):
  `AchaemenidWebSocketClient.h`, `AchaemenidWebSocketServer.h` + `core/` + `parsers/`.
- **`AppEvents/`** — app-level event definitions (`AppEvents.h`).
- **`ConfigApplier/`** — applies parsed config to hardware (`ConfigApplier.cpp/.h`).
- **`GpioSwitch/`** — low-level GPIO switch driver.
- **`PinManager/`** — registry & runtime state of pins: `PinManager`, `PinEntry`,
  `PinRegistry` + `core/` + `state/` + `timers/`.

### 3.3 `src/` — Firmware entry & glue
- **`main.cpp`** — `setup()`/`loop()`. Starts error handler, event bus, network+NTP, timer,
  MQTT, WebSocket, rule engine, loads NVS network config, kicks off async boot.
- **`core/`** — `Globals.h/.cpp` (global objects: `network`, `pinManager`, `mqttClient`,
  `appTimer`, `eventBus`, `executor`, `wsServer`, `wsClient`, `ruleEngine`, `bootManager`,
  `segmentStorage`), `WebSocketServer.h`, `WebSocketClient.h`.
- **`events/`** — `EventHandlers.cpp/.h` (subscribe handlers to the event bus).
- **`setup/`** — `SystemSetup`, `NetworkStorage` (NVS read/write of WiFi/MQTT creds).
- **`Optimization/`** — `.cpp` implementations for `ArrayBase`, `HashMapBase`.
- **`test/`** — PlatformIO unit tests (currently just a `README`).

**Data model (per `docs/Architecture.md`):** UI/config → Cloudflare KV (never sent to ESP32);
network config → ESP32 NVS/EEPROM (rare writes); **live pin state → ESP32 RAM only**
(no flash wear). ESP32 RAM is the single source of truth for device state.

---

## 4. `DASHBOARD/` — Next.js Web App

Next.js (App Router) + React + TypeScript + Tailwind. Dynamically renders modules/segments
from the hub's config JSON.

| Path | Role |
|------|------|
| `app/` | Next.js App Router: `layout.tsx`, `page.tsx`, `loading.tsx`, `not-found.tsx`, `globals.css`. |
| `components/` | Shared UI: `MasterHeader/` (brand, clock, theme, group filter, voice command, layout switcher…), `QueryProvider`, `AudioInitializer`. |
| `features/dashboard/` | Dashboard layout, workspace, drawers, layout hooks, `DashboardContext`. |
| `features/iot/` | IoT-specific UI: `IoTWorkspace`, modules/automations drawers, sortable segment cards, **`hooks/`** (MQTT/state hooks), **`services/`** (API clients), **`utils/`**. |
| `features/settings/` | Settings UI (UI config, matrix toggles, WiFi, voice). |
| `lib/audio/` | Sound/ambient manager (audio feedback). |
| `lib/presets.ts` | Default presets. |
| `public/` | Static assets. |
| `*.config.*`, `tsconfig.json`, `biome.json`, `package.json` | Tooling config. |

> `DASHBOARD/ARCHITECTURE.md`, `DESIGN.md`, `CLAUDE.md`, `README.md` hold deeper frontend docs.

---

## 5. `docs/` — Design & Protocol References

- `Architecture.md` / `Project-Description.md` — system architecture, layers, data allocation.
- `dashboard-configurations-protocol.md` — config JSON schema.
- `websocket-protocol-esp32.md`, `websocket-protocol-keys-events.md` — WS command/event protocol.
- `Guide-to-using-the-CloudFlare-Storag-API.md` — Cloudflare storage usage.
- `Agreement-Structure-Settings-JSON.md` — settings JSON agreement.
- `Information-required.md` — data the backend needs.

---

## 6. Cross-cutting notes

- **Hot paths / perf:** The codebase is heavily optimized for MCU speed — custom no-heap
  containers (`Optimization/`), atomic shared pointers, fast functors. RAM/flash are traded
  for latency per project rules.
- **Async everywhere:** Dual-core ESP32; a global `Executor` polls WiFi/NTP/config; the main
  `loop()` pumps MQTT, executor, rule engine inputs, and both WebSocket endpoints.
- **Build:** `platformio.ini` → `C:\Users\KAVEH\.platformio\penv\Scripts\platformio.exe run`.
- **CloudFlare dir** appears in the code-knowledge graph but is **not checked out locally**;
  the dashboard/worker code references it (config, dashboard, pins routes, Durable Object
  alarm manager). Treat it as external until present.
