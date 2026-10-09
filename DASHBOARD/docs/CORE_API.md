# مستندات هسته و معماری چند تمی داشبورد (Headless IoT Core API)

این سند راهنمای جامع معماری و نحوه پیاده‌سازی و توسعه تم‌های فرانت‌اند (Themes) بدون نیاز به تغییر در کدهای بک‌اند، همگام‌سازی Cloudflare، ارتباطات MQTT، هوک‌های ESP32 یا منطق سخت‌افزاری است.

---

## ۱. فلسفه معماری (Headless Backend vs. Dynamic Frontend Themes)

در این داشبورد، **منطق کنترل (Core Engine)** کاملاً از **لایه نمایش و قالب (UI Shells)** تفکیک شده است:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Cloudflare Pages / Static SPA                   │
├────────────────────────────────────────────────────────────────────────┤
│  🧠 لایه هسته و بک‌اند (Headless IoT Engine & State):                   │
│  - Zustand Store (Segments, Groups, Pins, Macros, Automations, Rules)  │
│  - MQTT Service & WebSocket Client (ارتباط زنده با ESP32)             │
│  - Cloudflare Sync & KV Storage (همگام‌سازی تنظیمات و ذخیره‌سازی ابری)  │
│  - Automation & Macro Execution Engine (موتور اجرای شرط‌ها و فرامین)    │
│  - Speech Recognition & Audio Synthesizer (دستیار صوتی و موتور صوتی)   │
├────────────────────────────────────────────────────────────────────────┤
│  🎨 لایه پوسته‌ها و فرانت‌اند (Visual Theme Shells):                     │
│  ├── Achaemenid Theme (جزیره‌ای، گرد، خط میخی، گلس‌مورفیسم)             │
│  ├── Terminal CLI Theme (ترمینال، لبه‌های تیز، فونت مونو، گرید چسبیده) │
│  └── Industrial Ribbon Theme (نواری، فشرده، فلت، مانیتورینگ متمرکز)   │
└────────────────────────────────────────────────────────────────────────┘
```

تمام تم‌ها از یک قرارداد یکسان (Single Source of Truth) تغذیه می‌کنند. وقتی کاربر تم را عوض می‌کند:
1. هیچ کانکشن MQTT قطع نمی‌شود.
2. پین‌های ESP32 و وضعیت رله‌ها ریست نمی‌شوند.
3. فقط لایه نمایشی React (HTML/CSS) تعویض می‌شود.

---

## ۲. مشخصات و استیت‌های هسته (Read-Only State)

تم‌ها می‌توانند مقادیر زیر را از هوک `useIoTStore` یا از طریق `useDashboard()` بخوانند:

| متغیر / فیلد | نوع داده | توضیحات |
| :--- | :--- | :--- |
| `segments` | `Segment[]` | آرایه‌ای از تمام سگمنت‌ها (شامل `id`, `title`, `pin`, `group`, `mode`, `rule`, `auto_off`) |
| `pinsState` | `Record<string, boolean>` | وضعیت زنده هر پین ESP32 به صورت کلید-مقدار (مثلاً `{"12": true, "14": false}`) |
| `groupsOrder` | `string[]` | لیست نام گروه‌ها و اولویت ترتیب آن‌ها |
| `groupConfigs` | `Record<string, { maxCols: number }>` | تنظیمات چیدمان و تعداد ستون‌های هر گروه |
| `macros` | `Macro[]` | لیست ماکروهای تعریف‌شده کاربر برای اجرای دسته‌جمعی پین‌ها |
| `automations` | `Automation[]` | سناریوهای اتوماسیون زمان‌بندی‌شده و شرایط آب‌وهوا |
| `activeTheme` | `string` | شناسه تم فعال جاری (`"achaemenid" \| "terminal" \| "ribbon"`) |
| `isFullyReady` | `boolean` | وضعیت آماده‌بودن همگام‌سازی اولیه با کلودفلر و سخت‌افزار |
| `lowDataMode` | `boolean` | وضعیت فعال بودن حالت کاهش مصرف داده اینترنت |

---

## ۳. متدهای اجرایی هسته (Core Action APIs)

برای اعمال تغییرات از داخل هر تم، تم کافیست متدهای زیر را فراخوانی کند:

### الف) کنترل پین‌ها و سگمنت‌ها (Hardware Controls)
```typescript
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

const {
  handleTogglePin,       // (pin: string) => Promise<void> : معکوس کردن وضعیت پین در ESP32 و استیت
  handleSetPinState,     // (pin: string, state: boolean) => Promise<void> : تنظیم صریح وضعیت پین
  handleBatchPinState,   // (pinStates: Record<string, boolean>) => Promise<void> : اعمال گروهی
  handleUpdateSegmentMode, // (id: string, mode: "switch" | "push") => void : تغییر مود کلید
} = useDashboard();
```

### ب) مدیریت و ویرایش ساختار (Segment & Group Management)
```typescript
const {
  handleAddSegment,       // (segmentData) => void : اضافه کردن سگمنت جدید
  handleRemoveSegment,    // (segmentId: string) => void : حذف سگمنت
  handleRemoveGroup,      // (groupId: string) => void : حذف کامل یک گروه
  handleGroupColsChange,  // (groupId: string, cols: number) => void : تغییر ستون‌های گروه
} = useDashboard();
```

### ج) باز کردن پنل‌ها و کشوها (Navigation & Drawers)
```typescript
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

// باز کردن منوی تنظیمات، ماژول‌ها یا اتوماسیون:
useIoTStore.getState().setIsMenuOpen(true);
useIoTStore.getState().setIsModulesMenuOpen(true);
useIoTStore.getState().setIsAutomationsMenuOpen(true);
```
---

## ۴. استایل و شخصی‌سازی ظاهر

تمام متغیرهای رنگی، فونت، چیدمان و جلوه‌های داشبورد از طریق تنظیمات جامع و موتور استایل برنامه قابل مدیریت هستند.

