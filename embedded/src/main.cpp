#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include "HX711.h"
#include "ArduinoJson.h"

// Replace with your network credentials
const char *ssid = "miért nézed egyáltalán ezt?";
const char *password = "nincs leak";

// WebSocket server details
const char *websockets_server_host = "192.168.31.130";
const uint16_t websockets_server_port = 12345; // Make sure your server is listening on this port
const char *websockets_server_path = "/";    // WebSocket path if needed

// Create a WebSocket client object
WebSocketsClient webSocket;

// create scale object
HX711 scale;

int GCK_pin = D0;
int DATA_pin = D2;

// Callback function to handle WebSocket events
void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    case WStype_DISCONNECTED:
        Serial.println("WebSocket Disconnected");
        break;
    case WStype_CONNECTED:
        Serial.println("WebSocket Connected");
        webSocket.sendTXT("MBkV5Qz2PiymBoDWVoFc");

        // Send a message when connected
        break;
    case WStype_TEXT:
        Serial.printf("WebSocket message received: %s\n", payload);
        break;
    case WStype_BIN:
        Serial.println("WebSocket binary message received");
        break;
    case WStype_ERROR:
        Serial.println("Error");
        break;
    }
}

void setup()
{
    // Initialize serial communication
    Serial.begin(9600);
    delay(300);

    // Connect to Wi-Fi
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    // Initialize WebSocket
    webSocket.begin(websockets_server_host, websockets_server_port, websockets_server_path);
    webSocket.onEvent(webSocketEvent);
            webSocket.sendTXT("MBkV5Qz2PiymBoDWVoFc");


    // Initialize scale
    scale.begin(DATA_pin, GCK_pin);
    scale.tare();
    
}

void loop()
{
    
    // Run the WebSocket client
    webSocket.loop();

    static unsigned long lastSend = 0;
    if (millis() - lastSend > 700)
    {
        lastSend = millis();
        
        char buffer[46];
        sprintf(buffer, "{\"table\":\"POWEEER\",\"value\":%ld}", scale.read());
        Serial.println(buffer);
        webSocket.sendTXT(buffer);
    }
}
