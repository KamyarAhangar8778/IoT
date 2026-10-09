==========================================
  Achaemenid IoT Node - Modular Async     
==========================================
[INFO]::[ESP-CODE-S/src/main.cpp:34]:[System] Hardware timer started at 1ms resolution.
[  1092][E][WiFiClientSocketOps.cpp:35] setSocketOption(): fail on -1, errno: 9, "Bad file number"
[INFO]::[ESP-CODE-S/src/setup/NetworkStorage.cpp:100]:[NetworkStorage] [DEBUG] Stored Network 0 - SSID: 'redminote111', Pass: 'kavehlololo8778'
[INFO]::[ESP-CODE-S/src/setup/NetworkStorage.cpp:118]:[NetworkStorage] [DEBUG] Stored MQTT Config - Host: 'broker.emqx.io', Port: 1883, Topic: 'KamyarIoT/Achaemenid', QOS: 0
[INFO]::[ESP-CODE-S/src/setup/NetworkStorage.cpp:129]:[NetworkStorage] Loaded 1 WiFi networks and MQTT config from NVS
[INFO]::[ESP-CODE-S/src/main.cpp:49]:[System] Found 1 saved WiFi networks in NVS
[WiFi] Multi-AP Registered: 'redminote111' (Total APs: 1)
[WiFi] Multi-AP Registered: 'redminote11' (Total APs: 2)
[INFO]::[ESP-CODE-S/src/main.cpp:59]:[System] Multi-AP setup ready with 2 total candidate networks.
[INFO]::[ESP-CODE-S/src/main.cpp:65]:[System] Restored MQTT settings from NVS (Host: broker.emqx.io, Topic: KamyarIoT/Achaemenid)
[INFO]::[ESP-CODE-S/src/main.cpp:72]:[System] Setup completed. Starting Async Boot Sequence...
[INFO]::[ESP-CODE-S/lib/AchaemenidBootManager/src/BootManager.cpp:46]:[Boot] Booting up... Loading config from NVS immediately.
[SegStorage] Loaded 5 segments from NVS (offline fallback)
[INFO]::[ESP-CODE-S/lib/PinManager/src/core/PinManager_Setup.cpp:49]:[PinManager] Added segment 'iszmn6e' on pin 2 (Type: output)
[INFO]::[ESP-CODE-S/lib/PinManager/src/state/PinStateManager.cpp:24]:[PinManager] 'iszmn6e' (pin 2) -> OFF
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:30]:[ConfigApplier] Pin 2 registered (id=iszmn6e, value=0)
[INFO]::[ESP-CODE-S/lib/PinManager/src/core/PinManager_Setup.cpp:49]:[PinManager] Added segment 'ocpa1hl' on pin 14 (Type: output)
[INFO]::[ESP-CODE-S/lib/PinManager/src/state/PinStateManager.cpp:24]:[PinManager] 'ocpa1hl' (pin 14) -> OFF
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:30]:[ConfigApplier] Pin 14 registered (id=ocpa1hl, value=0)
[INFO]::[ESP-CODE-S/lib/PinManager/src/core/PinManager_Setup.cpp:49]:[PinManager] Added segment '7xhkvz2' on pin 4 (Type: output)
[INFO]::[ESP-CODE-S/lib/PinManager/src/state/PinStateManager.cpp:24]:[PinManager] '7xhkvz2' (pin 4) -> OFF
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:30]:[ConfigApplier] Pin 4 registered (id=7xhkvz2, value=0)
[INFO]::[ESP-CODE-S/lib/PinManager/src/core/PinManager_Setup.cpp:49]:[PinManager] Added segment '48ef3dw' on pin 5 (Type: input)
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:30]:[ConfigApplier] Pin 5 registered (id=48ef3dw, value=0)
[INFO]::[ESP-CODE-S/lib/PinManager/src/core/PinManager_Setup.cpp:49]:[PinManager] Added segment 'y0stih7' on pin 19 (Type: input)
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:30]:[ConfigApplier] Pin 19 registered (id=y0stih7, value=0)
[INFO]::[ESP-CODE-S/lib/ConfigApplier/ConfigApplier.cpp:41]:[ConfigApplier] Applied 5 GPIO segments.
========= Pin Manager Status =========
  Active pins: 5 / 16
  [0] id=iszmn6e  type=output pin=2  state=OFF  autoOff=0s
  [1] id=ocpa1hl  type=output pin=14  state=OFF  autoOff=0s
  [2] id=7xhkvz2  type=output pin=4  state=OFF  autoOff=0s
  [3] id=48ef3dw  type=input pin=5  state=ON  autoOff=0s
  [4] id=y0stih7  type=input pin=19  state=ON  autoOff=0s
======================================
==========================================
  Instant Boot — Config loaded from NVS   
==========================================
[INFO]::[ESP-CODE-S/lib/AchaemenidBootManager/src/BootManager.cpp:62]:[BootManager] Starting WiFi connection (using configured APs)...
[INFO]::[ESP-CODE-S/lib/AchaemenidNetwork/AchaemenidNetwork.cpp:31]:[AchaemenidNetwork] Async connection to added SSIDs...
[WiFi] Successfully connected to AP: 'redminote111' | RSSI: -83 dBm | IP: 10.248.42.108
[INFO]::[ESP-CODE-S/lib/AchaemenidNetwork/AchaemenidNetwork.cpp:38]:[AchaemenidNetwork] Successfully connected to WiFi! Network: redminote111, IP: 10.248.42.108
[INFO]::[ESP-CODE-S/lib/AchaemenidBootManager/src/BootManager.cpp:18]:[Boot] WiFi Connected. Boot Tasks Complete.
[LocalWS] Server started on port 81
[WebSocket] [Task] Connecting to Cloudflare Worker...
[  7719][E][WiFiClientSocketOps.cpp:35] setSocketOption(): fail on -1, errno: 9, "Bad file number"
[MQTT] Connecting to broker.emqx.io...
[WebSocket] Connection Opened (First). Requesting config & states...
[WebSocket] [Task] Connected successfully!
[MQTT] Connected to MQTT broker!
[MQTT] Subscribed to topic: KamyarIoT/Achaemenid/Command (QoS 0)
[MQTT] SUBACK confirmed by broker! (packet_id: 1)