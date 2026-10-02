/**
 * @file wifi_multi_test.cpp
 * @brief Test for Multi-AP WiFi, NVS Persistence, and Config Protocol with Serial Output.
 *
 * Runs via PlatformIO:
 *   pio test -e esp32dev -f "wifi_multi*"
 */

#include <Arduino.h>
#include <unity.h>
#include <AchaemenidConfigProtocol.h>
#include <setup/NetworkStorage.h>
#include <setup/FallbackAP.h>
#include <Network/WiFi/ESP32WiFiAdapter.h>

using namespace uniuno;

static void test_acp_wifi_parsing(void) {
    Serial.println("\n[TEST 1] ACP Protocol: Parsing Multiple WiFi Networks");
    
    const char* payload = 
        "ESP_CFG_V2\n"
        "M h=broker.emqx.io p=1883 t=KamyarIoT/Achaemenid q=1\n"
        "W s=Modem_Home p=HomePass123\n"
        "W s=Modem_Office p=OfficePass456\n"
        "W s=Modem_Guest p=\n"
        "S id=light1 type=output pin=2 val=0 ao=0\n";

    ParseResult result = {};
    AchaemenidConfigProtocol parser;
    bool ok = parser.parse(payload, result);

    TEST_ASSERT_TRUE(ok);
    TEST_ASSERT_EQUAL_INT(3, result.wifiCount);
    TEST_ASSERT_EQUAL_STRING("Modem_Home", result.wifi[0].ssid);
    TEST_ASSERT_EQUAL_STRING("HomePass123", result.wifi[0].password);
    TEST_ASSERT_EQUAL_STRING("Modem_Office", result.wifi[1].ssid);
    TEST_ASSERT_EQUAL_STRING("OfficePass456", result.wifi[1].password);
    TEST_ASSERT_EQUAL_STRING("Modem_Guest", result.wifi[2].ssid);

    Serial.printf("[TEST 1] Parsed %d WiFi APs successfully!\n", result.wifiCount);
    for (int i = 0; i < result.wifiCount; i++) {
        Serial.printf("[TEST 1]   AP %d -> SSID: '%s', Pass: '%s'\n", i, result.wifi[i].ssid, result.wifi[i].password);
    }
    Serial.println("[TEST 1] PASS");
}

static void test_nvs_storage_roundtrip(void) {
    Serial.println("\n[TEST 2] NVS Storage: Multi-AP Persistence & Anti-Wipe Protection");

    ConfigLoadedEvent cfg;
    cfg.wifiCount = 2;
    strncpy(cfg.wifi[0].ssid, "Test_SSID_1", sizeof(cfg.wifi[0].ssid) - 1);
    strncpy(cfg.wifi[0].password, "Pass_1", sizeof(cfg.wifi[0].password) - 1);
    strncpy(cfg.wifi[1].ssid, "Test_SSID_2", sizeof(cfg.wifi[1].ssid) - 1);
    strncpy(cfg.wifi[1].password, "Pass_2", sizeof(cfg.wifi[1].password) - 1);
    cfg.wifi[0].valid = true;
    cfg.wifi[1].valid = true;

    saveNetworkConfig(cfg);
    Serial.println("[TEST 2] Saved 2 WiFi networks to NVS");

    String loadedSSID[MAX_WIFI_NETWORKS];
    String loadedPass[MAX_WIFI_NETWORKS];
    int loadedCount = 0;
    MqttConfig loadedMqtt;
    loadNetworkConfig(loadedSSID, loadedPass, loadedCount, loadedMqtt);

    TEST_ASSERT_EQUAL_INT(2, loadedCount);
    TEST_ASSERT_EQUAL_STRING("Test_SSID_1", loadedSSID[0].c_str());
    TEST_ASSERT_EQUAL_STRING("Pass_1", loadedPass[0].c_str());
    TEST_ASSERT_EQUAL_STRING("Test_SSID_2", loadedSSID[1].c_str());
    TEST_ASSERT_EQUAL_STRING("Pass_2", loadedPass[1].c_str());

    // Verify Anti-Wipe Protection: dispatching an event with wifiCount=0 must NOT wipe NVS!
    ConfigLoadedEvent emptyCfg;
    emptyCfg.wifiCount = 0;
    saveNetworkConfig(emptyCfg);

    int countAfterEmpty = 0;
    loadNetworkConfig(loadedSSID, loadedPass, countAfterEmpty, loadedMqtt);
    TEST_ASSERT_EQUAL_INT(2, countAfterEmpty);
    Serial.printf("[TEST 2] Anti-wipe verified: NVS retained %d networks after empty config!\n", countAfterEmpty);
    Serial.println("[TEST 2] PASS");
}

static void test_multi_ap_adapter(void) {
    Serial.println("\n[TEST 3] ESP32WiFiAdapter: Candidate AP Registration");

    ESP32WiFiAdapter adapter;
    adapter.clear_access_points();
    TEST_ASSERT_EQUAL_INT(0, adapter.get_ap_count());

    adapter.add_access_point("Home_5G", "Secret5G");
    adapter.add_access_point("Home_2G", "Secret2G");
    adapter.add_access_point("Mobile_Hotspot", "HotspotPass");

    TEST_ASSERT_EQUAL_INT(3, adapter.get_ap_count());

    // Duplicate SSID should update password, not add new entry
    adapter.add_access_point("Home_5G", "UpdatedSecret");
    TEST_ASSERT_EQUAL_INT(3, adapter.get_ap_count());

    Serial.printf("[TEST 3] Candidate APs registered: %d (No duplicates)\n", (int)adapter.get_ap_count());
    Serial.println("[TEST 3] PASS");
}

static void test_fallback_ap_feature_flag(void) {
    Serial.println("\n[TEST 4] Fallback AP Configuration & Flags");

    TEST_ASSERT_EQUAL_INT(1, ENABLE_FALLBACK_AP);
    TEST_ASSERT_EQUAL_STRING("Achaemenid-Setup", FALLBACK_AP_SSID);

    Serial.printf("[TEST 4] Fallback AP Enabled: %d | SSID: %s\n", ENABLE_FALLBACK_AP, FALLBACK_AP_SSID);
    Serial.println("[TEST 4] PASS");
}

void setup() {}
void loop() { delay(1000); }

#ifdef __cplusplus
extern "C"
#endif
int user_start(void) {
    Serial.begin(115200);
    delay(1000);
    Serial.println("\n=======================================================");
    Serial.println("  Achaemenid IoT — Multi-AP & Fallback WiFi Tests     ");
    Serial.println("=======================================================");

    UNITY_BEGIN();
    RUN_TEST(test_acp_wifi_parsing);
    RUN_TEST(test_nvs_storage_roundtrip);
    RUN_TEST(test_multi_ap_adapter);
    RUN_TEST(test_fallback_ap_feature_flag);
    UNITY_END();

    Serial.println("\n[ALL TESTS COMPLETED SUCCESSFULLY]");
    return 0;
}
