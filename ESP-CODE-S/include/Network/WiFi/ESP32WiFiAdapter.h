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
    return WiFi.mode(m);
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
          // Re-sync wifiMulti with updated credentials
          wifiMulti.cleanAPlist();
          for (size_t j = 0; j < credentials.size(); j++) {
            wifiMulti.addAP(credentials[j].ssid, credentials[j].pass);
          }
          Serial.printf("[WiFi] Updated password for AP '%s' in Multi-AP list.\n", ssid);
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
    wifiMulti.cleanAPlist();
    Serial.println("[WiFi] Multi-AP list cleared.");
  }

  size_t get_ap_count() const override {
    return credentials.size();
  }

  FORCE_INLINE wl_status_t status() override { 
    return WiFi.status(); 
  }

  wl_status_t run(uint32_t connectTimeoutMs = 6000) override {
    if (status() == WL_CONNECTED) {
      return WL_CONNECTED;
    }

    if (credentials.empty()) {
      Serial.println("[WiFi] No AP credentials registered to connect.");
      return WL_CONNECT_FAILED;
    }

    Serial.printf("[WiFi] Attempting connection to %d candidate network(s)...\n", (int)credentials.size());

    // 1. Try WiFiMulti scan & select strongest AP
    wl_status_t multiStatus = wifiMulti.run(connectTimeoutMs);
    if (multiStatus == WL_CONNECTED) {
      Serial.printf("[WiFi] Connected via Multi-AP to '%s' | RSSI: %d dBm | IP: %s\n",
                    WiFi.SSID().c_str(), WiFi.RSSI(), WiFi.localIP().toString().c_str());
#if OPTIMIZE_WIFI_NO_SLEEP
      WiFi.setSleep(false);
      esp_wifi_set_ps(WIFI_PS_NONE);
#endif
      return WL_CONNECTED;
    }

    // 2. Direct fallback: try connecting directly to candidate networks
    Serial.println("[WiFi] Multi-AP scan did not connect. Trying direct connection...");
    for (size_t i = 0; i < credentials.size(); i++) {
      Serial.printf("[WiFi] Direct connection to '%s' (pass len: %d)...\n",
                    credentials[i].ssid, (int)strlen(credentials[i].pass));
      WiFi.disconnect(false);
      delay(100);
      WiFi.begin(credentials[i].ssid, credentials[i].pass);

      unsigned long start = millis();
      while (millis() - start < 7000) {
        if (WiFi.status() == WL_CONNECTED) {
          Serial.printf("[WiFi] Connected directly to '%s' | IP: %s\n",
                        credentials[i].ssid, WiFi.localIP().toString().c_str());
#if OPTIMIZE_WIFI_NO_SLEEP
          WiFi.setSleep(false);
          esp_wifi_set_ps(WIFI_PS_NONE);
#endif
          return WL_CONNECTED;
        }
        delay(250);
      }
      Serial.printf("[WiFi] Direct connection to '%s' failed (status: %d).\n",
                    credentials[i].ssid, (int)WiFi.status());
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
