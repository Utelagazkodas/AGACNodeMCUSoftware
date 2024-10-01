#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include "HX711.h"
#include "ArduinoJson.h"
#include <string.h>

// Replace with your network credentials
const char *ssid = "HUAWEI-dr64";
const char *password = "588Y293w";

// WebSocket server details
const char *websockets_server_host = "192.168.100.141";
const uint16_t websockets_server_port = 443; // Make sure your server is listening on this port
const char *websockets_server_path = "/";    // WebSocket path if needed

// Websocket server token
const char *token = "token";

// Create a WebSocket client object
WebSocketsClient webSocket;

// create scale object
HX711 scale;

int GCK_pin = D0;
int DATA_pin = D2;

int Ignite_pin = D1;

int Thermo_pin = A0;
// 0 if not launched
unsigned long launched = 0;

// Callback function to handle WebSocket events
void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    case WStype_DISCONNECTED:
        Serial.println("WebSocket Disconnected");
        launched = 0;
        break;
    case WStype_CONNECTED:
        Serial.println("WebSocket Connected");
        webSocket.sendTXT(token);
        webSocket.sendTXT("ready");

        // Send a message when connected
        break;
    case WStype_TEXT:
    
        if(strcmp((char*)payload, "{\"entries\":[{\"table\":\"launched\",\"values\":[null]}]}") == 0){
            Serial.println("launch");
            launched = millis();
            webSocket.sendTXT("launched");
        }
        break;
    case WStype_BIN:
        Serial.println("WebSocket binary message received");
        break;
    case WStype_ERROR:
        Serial.println("Error");
        launched = 0;
        break;
    }
}

void setup()
{
    pinMode(Thermo_pin, INPUT);

    pinMode(Ignite_pin, OUTPUT);
    digitalWrite(Ignite_pin, LOW);

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
            webSocket.sendTXT(token);


    // Initialize scale
    scale.begin(DATA_pin, GCK_pin);
    scale.tare();
    
}

unsigned long lastSend = 0;



void loop()
{
    if(launched == 0){
    digitalWrite(Ignite_pin, LOW);
    }
    else{
    digitalWrite(Ignite_pin, HIGH);
    }

    // Run the WebSocket client
    webSocket.loop();

    
    if (millis() - lastSend > 700 && launched != 0)
    {
        lastSend = millis();
        
        char buffer[128];
        sprintf(buffer, "{\"entries\" : [{\"table\" : \"force\", \"value\" : %ld}, {\"table\" : \"timestamp\", \"value\" : %ld}, {\"table\" : \"temperature\", \"value\" : %ld}]}", scale.read(), millis() - launched, 0);
        
        webSocket.sendTXT(buffer);
    }
}
