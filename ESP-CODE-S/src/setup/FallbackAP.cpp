#include "FallbackAP.h"
#include <WiFi.h>
#include <WiFiServer.h>
#include <Preferences.h>
#include <Utilities/logging.h>
#include "NetworkStorage.h"
#include <ConfigTypes.h>

namespace uniuno {

static bool s_apRunning = false;
static WiFiServer* s_server = nullptr;
static unsigned long s_restartAt = 0;

static String urlDecode(const String& str) {
    String decoded = "";
    char temp[] = "0x00";
    unsigned int len = str.length();
    for (unsigned int i = 0; i < len; i++) {
        char c = str.charAt(i);
        if (c == '+') {
            decoded += ' ';
        } else if (c == '%' && i + 2 < len) {
            temp[2] = str.charAt(++i);
            temp[3] = str.charAt(++i);
            decoded += (char)strtol(temp, nullptr, 16);
        } else {
            decoded += c;
        }
    }
    return decoded;
}

void FallbackAP::start() {
    if (s_apRunning) return;

    Serial.println("\n=======================================================");
    Serial.println("  [FallbackAP] Starting Access Point Setup Mode...     ");
    Serial.println("=======================================================");

    WiFi.disconnect(true);
    delay(100);

    WiFi.mode(WIFI_AP);
    bool apCreated = (strlen(FALLBACK_AP_PASS) > 0)
        ? WiFi.softAP(FALLBACK_AP_SSID, FALLBACK_AP_PASS)
        : WiFi.softAP(FALLBACK_AP_SSID);

    if (!apCreated) {
        Serial.println("[FallbackAP] ERROR: Failed to start SoftAP!");
        return;
    }

    IPAddress apIP = WiFi.softAPIP();
    Serial.printf("[FallbackAP] AP SSID   : %s\n", FALLBACK_AP_SSID);
    Serial.printf("[FallbackAP] IP Address: %s\n", apIP.toString().c_str());
    Serial.println("[FallbackAP] Connect to this AP and open http://192.168.4.1 in browser.");
    Serial.println("=======================================================\n");

    if (s_server == nullptr) {
        s_server = new WiFiServer(80);
    }
    s_server->begin();
    s_apRunning = true;
    s_restartAt = 0;
}

bool FallbackAP::isRunning() {
    return s_apRunning;
}

void FallbackAP::stop() {
    if (!s_apRunning) return;
    if (s_server) {
        s_server->end();
        delete s_server;
        s_server = nullptr;
    }
    WiFi.softAPdisconnect(true);
    s_apRunning = false;
    Serial.println("[FallbackAP] SoftAP stopped.");
}

void FallbackAP::handleClient() {
    if (!s_apRunning || s_server == nullptr) return;

    if (s_restartAt > 0 && millis() >= s_restartAt) {
        Serial.println("[FallbackAP] Restarting ESP32 to connect to configured WiFi...");
        Serial.flush();
        ESP.restart();
    }

    WiFiClient client = s_server->available();
    if (!client) return;

    String request = "";
    unsigned long timeout = millis() + 1500;
    while (client.connected() && millis() < timeout) {
        if (client.available()) {
            char c = client.read();
            request += c;
            if (request.endsWith("\r\n\r\n")) break;
        }
    }

    if (request.indexOf("POST /save") >= 0 || request.indexOf("GET /save?") >= 0) {
        String bodyOrQuery = "";
        int saveIdx = request.indexOf("/save?");
        if (saveIdx >= 0) {
            int spaceIdx = request.indexOf(" ", saveIdx);
            bodyOrQuery = request.substring(saveIdx + 6, spaceIdx);
        } else {
            // Read POST body if present
            while (client.available()) {
                bodyOrQuery += (char)client.read();
            }
        }

        String ssid = "";
        String pass = "";

        int ssidPos = bodyOrQuery.indexOf("ssid=");
        if (ssidPos >= 0) {
            int ampPos = bodyOrQuery.indexOf("&", ssidPos);
            ssid = bodyOrQuery.substring(ssidPos + 5, ampPos >= 0 ? ampPos : bodyOrQuery.length());
            ssid = urlDecode(ssid);
        }

        int passPos = bodyOrQuery.indexOf("pass=");
        if (passPos >= 0) {
            int ampPos = bodyOrQuery.indexOf("&", passPos);
            pass = bodyOrQuery.substring(passPos + 5, ampPos >= 0 ? ampPos : bodyOrQuery.length());
            pass = urlDecode(pass);
        }

        if (ssid.length() > 0) {
            Serial.printf("[FallbackAP] Received New WiFi Credentials:\n");
            Serial.printf("[FallbackAP]   SSID: '%s'\n", ssid.c_str());
            Serial.printf("[FallbackAP]   Pass: '%s'\n", pass.c_str());

            ConfigLoadedEvent cfg;
            cfg.wifiCount = 1;
            strncpy(cfg.wifi[0].ssid, ssid.c_str(), sizeof(cfg.wifi[0].ssid) - 1);
            cfg.wifi[0].ssid[sizeof(cfg.wifi[0].ssid) - 1] = '\0';
            strncpy(cfg.wifi[0].password, pass.c_str(), sizeof(cfg.wifi[0].password) - 1);
            cfg.wifi[0].password[sizeof(cfg.wifi[0].password) - 1] = '\0';
            cfg.wifi[0].valid = true;

            saveNetworkConfig(cfg);
            Serial.println("[FallbackAP] Credentials saved to NVS successfully!");

            String resp = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nConnection: close\r\n\r\n"
                          "<!DOCTYPE html><html dir='rtl' lang='fa'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                          "<title>سامانه مرزی پاسارگاد</title><style>"
                          "body{font-family:sans-serif;background:#0d1117;color:#e6edf3;text-align:center;padding:40px 20px;}"
                          ".card{background:#161b22;padding:30px;border-radius:16px;max-width:400px;margin:auto;border:1px solid #30363d;}"
                          "h2{color:#f59e0b;}p{color:#8b949e;line-height:1.6;}"
                          "</style></head><body><div class='card'>"
                          "<h2>تنظیمات با موفقیت ذخیره شد!</h2>"
                          "<p>دستگاه تا چند ثانیه دیگر ریستارت شده و به شبکه <b>" + ssid + "</b> متصل خواهد شد.</p>"
                          "</div></body></html>";
            client.print(resp);
            client.flush();
            client.stop();

            s_restartAt = millis() + 1500;
            return;
        }
    }

    // Serve HTML Setup Page
    String html = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nConnection: close\r\n\r\n"
                  "<!DOCTYPE html><html dir='rtl' lang='fa'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                  "<title>تنظیمات وای‌فای سامانه پاسارگاد</title><style>"
                  "body{font-family:sans-serif;background:#0b0f19;color:#e6edf3;margin:0;padding:24px 16px;display:flex;justify-content:center;}"
                  ".box{background:#161e2e;padding:28px;border-radius:20px;width:100%;max-width:380px;border:1px solid #2d3748;box-shadow:0 10px 25px rgba(0,0,0,0.5);}"
                  "h2{color:#fbbf24;font-size:20px;margin-bottom:8px;}"
                  "p{color:#94a3b8;font-size:13px;line-height:1.5;margin-bottom:20px;}"
                  "label{display:block;text-align:right;font-size:13px;color:#cbd5e1;margin-bottom:6px;}"
                  "input{width:100%;box-sizing:border-box;padding:12px 14px;margin-bottom:18px;border-radius:10px;border:1px solid #334155;background:#0f172a;color:#fff;font-size:14px;outline:none;}"
                  "input:focus{border-color:#fbbf24;}"
                  "button{width:100%;padding:13px;border-radius:10px;border:none;background:#f59e0b;color:#0f172a;font-weight:bold;font-size:15px;cursor:pointer;transition:background 0.2s;}"
                  "button:hover{background:#d97706;}"
                  ".badge{display:inline-block;padding:3px 8px;border-radius:6px;background:#1e293b;color:#38bdf8;font-size:11px;margin-bottom:14px;}"
                  "</style></head><body><div class='box'>"
                  "<div class='badge'>حالت اضطراری پیکربندی</div>"
                  "<h2>پاسارگاد IoT - اتصال وای‌فای</h2>"
                  "<p>ارتباط با مودم‌های قبلی برقرار نشد. لطفاً نام و رمز عبور مودم یا هات‌اسپات خود را وارد کنید.</p>"
                  "<form action='/save' method='GET'>"
                  "<label>نام شبکه وای‌فای (SSID):</label>"
                  "<input type='text' name='ssid' required placeholder='SSID مودم شما'>"
                  "<label>رمز عبور (Password):</label>"
                  "<input type='password' name='pass' placeholder='رمز وای‌فای'>"
                  "<button type='submit'>ذخیره و اتصال به مودم</button>"
                  "</form></div></body></html>";

    client.print(html);
    client.flush();
    client.stop();
}

} // namespace uniuno
