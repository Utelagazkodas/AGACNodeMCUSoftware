#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include "HX711.h"
#include "ArduinoJson.h"
#include <vector>

// Replace with your network credentials
const char *ssid = "nuh uh";
const char *password = "nuh ug";

// WebSocket server details
const char *websockets_server_host = "192.168.3.252";
const uint16_t websockets_server_port = 443; // Make sure your server is listening on this port
const char *websockets_server_path = "/";    // WebSocket path if needed

// WebSocket server token
const char *token = "token";

// Create a WebSocket client object
WebSocketsClient webSocket;

// Create scale object
HX711 scale;

int GCK_pin = D0;
int DATA_pin = D2;

int Ignite_pin = D1;
// 0 if not launched
unsigned long launched = 0;

const int loadcellOffset = 87250;
const int loadcellDivider = 23089;


// Vectors to store data temporarily
std::vector<float> forces;
std::vector<unsigned long> timestamps;

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
        if (strcmp((char *)payload, "{\"entries\":[{\"table\":\"launched\",\"values\":[null]}]}") == 0)
        {
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
unsigned long lastRead = 0;

void loop()
{
    // Run the WebSocket client
    webSocket.loop();

    // Record data every loop iteration
    if (launched != 0)
    {
        lastRead = millis();

        // Read the current force and timestamp
        float currentForce = (scale.read() + loadcellOffset) / (float)loadcellDivider;
        unsigned long currentTime = millis() - launched;

        // Store the values
        forces.push_back(currentForce);
        timestamps.push_back(currentTime);
    }

    // Send data every second
    if (millis() - lastSend >= 1000 && launched != 0 && forces.size() != 0 && timestamps.size() != 0)
    {
        lastSend = millis();

        // Prepare JSON payload
        DynamicJsonDocument doc(1024);

        JsonArray entries = doc.createNestedArray("entries");

        // Create first object for timestamps
        JsonObject timestampObj = entries.createNestedObject();
        timestampObj["table"] = "timestamp";
        JsonArray timestampValues = timestampObj.createNestedArray("values");
        for (unsigned long timestamp : timestamps)
        {
            timestampValues.add(timestamp);
        }

        // Create second object for forces
        JsonObject forceObj = entries.createNestedObject();
        forceObj["table"] = "force";
        JsonArray forceValues = forceObj.createNestedArray("values");
        for (float force : forces)
        {
            forceValues.add(force);
        }

        // Serialize the JSON document to a string
        String jsonString;
        serializeJson(doc, jsonString);

        // Send the JSON string over the WebSocket
        webSocket.sendTXT(jsonString);

        // Clear the vectors after sending
        forces.clear();
        timestamps.clear();
    }
}
