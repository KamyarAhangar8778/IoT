#include "Globals.h"

// =============================================
// Configuration
// =============================================
// const char *WIFI_SSID = "IRANCELL-FD-I40-E1-217F";
// const char *WIFI_PASSWORD = "8921927f";
const char *WIFI_SSID = "redminote11";
const char *WIFI_PASSWORD = "kavehlololo8778";

// =============================================
// Global Objects
// =============================================
uniuno::INetworkManager *network = nullptr;
String rawConfigPayload = "";
PinManager pinManager;
uniuno::AchaemenidMQTT mqttClient;
uniuno::Timer *appTimer = nullptr;
uniuno::EventDispatcher eventBus;
uniuno::Executor executor;
uniuno::AchaemenidWebSocketClient *wsClient = nullptr;
uniuno::AchaemenidWebSocketServer *wsServer = nullptr;
uniuno::MqttCommandDispatcher *mqttDispatcher = nullptr;
RuleEngine *ruleEngine = nullptr;
BootManager *bootManager = nullptr;
uniuno::ISegmentStorage *segmentStorage = nullptr;

// =============================================
// State Variables
// =============================================
bool configLoaded = false;
bool configFetchStarted = false;
bool ntpSynced = false;
bool isDashboardOnline = true;
uniuno::TimerHandle dashboardTimeoutTimer;
