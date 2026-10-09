#ifndef FALLBACK_AP_H
#define FALLBACK_AP_H

#include <Arduino.h>

/**
 * @brief فلگ فعال/غیرفعال‌سازی حالت Fallback AP
 * در صورتی که 1 باشد، هنگام عدم اتصال به کاندیداهای وای‌فای، یک اکسس‌پوینت برای کانفیگ بالا می‌آید.
 * در صورتی که 0 باشد، قابلیت غیرفعال است و رفتار قبلی (تلاش مجدد/ریستارت) اعمال می‌شود.
 */
#ifndef ENABLE_FALLBACK_AP
#define ENABLE_FALLBACK_AP 1
#endif

#define FALLBACK_AP_SSID "Achaemenid-Setup"
#define FALLBACK_AP_PASS "" // اکسس‌پوینت باز برای سهولت در اتصال و اتصال اولیه سریع

namespace uniuno {

class FallbackAP {
public:
    /**
     * @brief راه‌اندازی حالت Access Point و وب‌سرور تنظیمات
     */
    static void start();

    /**
     * @brief پردازش درخواست‌های HTTP در حلقه اصلی loop
     */
    static void handleClient();

    /**
     * @brief وضعیت فعال بودن حالت Fallback AP
     */
    static bool isRunning();

    /**
     * @brief متوقف‌سازی حالت Access Point
     */
    static void stop();
};

} // namespace uniuno

#endif // FALLBACK_AP_H
