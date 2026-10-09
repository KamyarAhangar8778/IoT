#ifndef ACHAEMENID_NETWORK_H
#define ACHAEMENID_NETWORK_H

#include <Arduino.h>
#include <Network/WiFi/WiFiConnector.h>
#include <Network/WiFi/WiFiAdapter.h>
#include <Optimization/CompilerTraits.h>
#include <Future.h>
#include "INetworkManager.h"

namespace uniuno {

class AchaemenidNetwork : public INetworkManager {
public:
    // سازنده: مقداردهی اولیه آداپتور و کانکتور وای‌فای از طریق
    // تزریق وابستگی
    AchaemenidNetwork(WiFiAdapter* wifiAdapter);

    // تخریب‌کننده
    ~AchaemenidNetwork() override;

    // اضافه کردن شبکه وای‌فای به لیست
    void add_access_point(const char* ssid, const char* password) override;

    // پاکسازی کامل لیست شبکه‌ها برای بروزرسانی داینامیک
    void clear_access_points() override;

    // تعداد شبکه‌های ثبت شده
    size_t get_ap_count() const override;

    // اتصال با برگرداندن شیء Future
    Future<void, void, Error> connectAsync() override;

    // بررسی برقرار بودن اتصال شبکه (در مسیر داغ)
    HOT_PATH FORCE_INLINE bool isConnected() const override {
        return _connected && (_wifiAdapter->status() == WL_CONNECTED);
    }

    // دریافت رفرنس کانکتور وای‌فای
    WiFiConnector* getConnector() override { return &_wifiConnector; }

private:
    WiFiAdapter* _wifiAdapter;
    WiFiConnector _wifiConnector;
    Future<void, void, Error> _connectionFuture;
    bool _connected;
};

}  // namespace uniuno

#endif  // ACHAEMENID_NETWORK_H
