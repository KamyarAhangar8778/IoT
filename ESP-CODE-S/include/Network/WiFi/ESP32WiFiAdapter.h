#pragma once

#ifdef ESP32

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiAdapter.h>
#include <Optimization/SmallVector.h>
#include <Optimization/CompilerTraits.h>
#include <Optimization/LatencyConfig.h>
#include <esp_wifi.h>

namespace uniuno {

struct WiFiCredential {
  char ssid[33];
  char pass[65];
};

class ESP32WiFiAdapter : public WiFiAdapter {
public:
  ESP32WiFiAdapter() {}

  FORCE_INLINE bool mode(WiFiMode_t m) override {
    bool result = WiFi.mode(m);
#if OPTIMIZE_WIFI_NO_SLEEP
    WiFi.setSleep(false); // <--- ZERO LATENCY WIFI
    esp_wifi_set_ps(WIFI_PS_NONE); // <--- HARD DISABLE MODEM SLEEP (jitter 300ms -> 2ms)
#endif
    return result;
  }

  FORCE_INLINE WiFiMode_t get_mode() override { 
    return WiFi.getMode(); 
  }

  bool add_access_point(const char *ssid, const char *passphrase) override {
    if (!ssid || ssid[0] == '\0') return false;

    // Check if already in list to avoid duplicates
    for (size_t i = 0; i < credentials.size(); i++) {
      if (strncmp(credentials[i].ssid, ssid, sizeof(credentials[i].ssid)) == 0) {
        // Update password if changed
        if (passphrase) {
          strncpy(credentials[i].pass, passphrase, sizeof(credentials[i].pass) - 1);
          credentials[i].pass[sizeof(credentials[i].pass) - 1] = '\0';
        }
        return true;
      }
    }

    if (!credentials.full()) {
      WiFiCredential cred;
      strncpy(cred.ssid, ssid, sizeof(cred.ssid) - 1);
      cred.ssid[sizeof(cred.ssid) - 1] = '\0';
      if (passphrase) {
        strncpy(cred.pass, passphrase, sizeof(cred.pass) - 1);
        cred.pass[sizeof(cred.pass) - 1] = '\0';
      } else {
        cred.pass[0] = '\0';
      }

      credentials.push_back(cred);
      wifiMulti.addAP(cred.ssid, cred.pass);
      Serial.printf("[WiFi] Multi-AP Registered: '%s' (Total APs: %d)\n", cred.ssid, (int)credentials.size());
      return true;
    }
    Serial.printf("[WiFi] Multi-AP list full (%d APs). Skipped: '%s'\n", (int)credentials.capacity(), ssid);
    return false;
  }

  void clear_access_points() override {
    credentials.clear();
    wifiMulti.APlist.clear();
    Serial.println("[WiFi] Multi-AP list cleared.");
  }

  size_t get_ap_count() const override {
    return credentials.size();
  }

  FORCE_INLINE wl_status_t status() override { 
    return WiFi.status(); 
  }

  wl_status_t run(uint32_t connectTimeoutMs = 5000) override {
    if (status() == WL_CONNECTED) {
      return WL_CONNECTED;
    }

    if (credentials.empty()) {
      return WL_CONNECT_FAILED;
    }

    // WiFiMulti.run() automatically scans and connects to the strongest signal AP (highest RSSI)
    uint32_t start_time = millis();
    while (millis() - start_time < connectTimeoutMs) {
      if (wifiMulti.run() == WL_CONNECTED) {
        Serial.printf("[WiFi] Successfully connected to AP: '%s' | RSSI: %d dBm | IP: %s\n",
                      WiFi.SSID().c_str(), WiFi.RSSI(), WiFi.localIP().toString().c_str());
        return WL_CONNECTED;
      }
      delay(10);
    }

    return WL_CONNECT_FAILED;
  }

  FORCE_INLINE bool disconnect(bool wifioff = false) override {
    return WiFi.disconnect(wifioff);
  }

private:
  SmallVector<WiFiCredential, 6> credentials;
  WiFiMulti wifiMulti;
};

} // namespace uniuno

#endif
