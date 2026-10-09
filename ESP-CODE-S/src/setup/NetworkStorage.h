#ifndef NETWORK_STORAGE_H
#define NETWORK_STORAGE_H

#include <Arduino.h>
#include <AchaemenidConfigProtocol.h>
#include <AppEvents.h>

void saveNetworkConfig(const ConfigLoadedEvent& config);
void loadNetworkConfig(String ssid[MAX_WIFI_NETWORKS], String pass[MAX_WIFI_NETWORKS], int& count,
                       MqttConfig& mqttConfig);

#endif  // NETWORK_STORAGE_H
