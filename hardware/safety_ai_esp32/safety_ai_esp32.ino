/**
 * SAFETY AI – Smart Accident Detection & Emergency Response System
 * Target Board: ESP32 Dev Module
 * Sensors: SW-420 Vibration Sensor, Sound Sensor
 * Communications: Onboard Wi-Fi (Primary), SIM800L GSM Module (Failover Backup)
 * 
 * Expected Workflow:
 * 1. Monitored sensors detect impact (High Vibration & High Sound simultaneously).
 * 2. ESP32 triggers emergency sequence.
 * 3. ESP32 establishes network connection (checks WiFi first, falls back to SIM800L GPRS).
 * 4. Sends HTTP POST containing location/severity metadata payload to /api/accident endpoint.
 * 5. Cooldown period blocks repeated triggers for 10 seconds.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>

// ======================== CONFIGURATION ========================
// Wi-Fi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server API Endpoint (Replace with your actual hosted Next.js API domain or IP)
const char* apiEndpoint = "http://localhost:3000/api/accident"; // e.g. "http://192.168.1.100:3000/api/accident" or hosted domain

// GSM APN Configurations (for SIM800L GPRS backup)
const char* gsmApn = "internet"; // AirTel/Jio/Vi APN config (e.g. "portalnmms" or "www" or "internet")

// Pin Assignments
#define VIBRATION_PIN  12  // SW-420 Digital Out connected to GPIO12
#define SOUND_PIN      13  // Sound Sensor Digital/Analog Out connected to GPIO13

// SIM800L UART Connections (using HardwareSerial 2 on ESP32)
#define SIM800L_RX     16  // SIM800L TX connected to ESP32 RX2 (GPIO16)
#define SIM800L_TX     17  // SIM800L RX connected to ESP32 TX2 (GPIO17)

// Cooldown Constants
const unsigned long COOLDOWN_MS = 10000; // 10-second alert lockout (Rule 5)

// System State Variables
unsigned long lastAlertTime = 0;
bool isCooldownActive = false;

// Serial Communication for SIM800L
HardwareSerial sim800l(2); 

// ======================== INITIALIZATION ========================
void setup() {
  Serial.begin(115200);
  sim800l.begin(9600, SERIAL_8N1, SIM800L_RX, SIM800L_TX);
  
  pinMode(VIBRATION_PIN, INPUT);
  pinMode(SOUND_PIN, INPUT);
  
  Serial.println("\n=======================================================");
  Serial.println("SAFETY AI - Smart Accident Detection System Init...");
  Serial.println("=======================================================");

  // Initialize WiFi connection
  connectToWiFi();
  
  // Verify SIM800L response
  initSIM800L();
}

// ======================== MAIN LOOP ========================
void loop() {
  // Check if cooldown timer has expired
  if (isCooldownActive && (millis() - lastAlertTime >= COOLDOWN_MS)) {
    isCooldownActive = false;
    Serial.println("[SYSTEM] Cooldown period expired. Monitoring re-engaged.");
  }

  // Sample sensor values
  int vibrationVal = digitalRead(VIBRATION_PIN);
  int soundVal = digitalRead(SOUND_PIN);

  // Trigger conditions: BOTH sensors must detect high levels (Rule 4)
  // SW-420 output is normally LOW, goes HIGH on vibration pulses.
  // Sound sensor output goes HIGH or LOW depending on active-level configuration.
  if (vibrationVal == HIGH && soundVal == HIGH) {
    if (!isCooldownActive) {
      Serial.println("\n[ALERT] IMPACT DETECTED! High Vibration & High Sound registered.");
      triggerAccidentReport();
    } else {
      Serial.print("."); // Silent dot to signify ignored event during cooldown
      delay(500);
    }
  }

  delay(50); // High frequency polling
}

// ======================== WIFI UTILITIES ========================
void connectToWiFi() {
  Serial.print("[WiFi] Connecting to network: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  // Wait up to 8 seconds for connection
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 16) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connection established successfully!");
    Serial.print("[WiFi] IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WiFi] Timeout. Falling back to GSM GPRS communications mode.");
  }
}

// ======================== EMERGENCY REPORT TRIGGER ========================
void triggerAccidentReport() {
  lastAlertTime = millis();
  isCooldownActive = true;
  
  // JSON payload construction (Required Format)
  String jsonPayload = "{\"status\":\"ACCIDENT\",\"location\":\"Chennai Highway\",\"severity\":\"HIGH\",\"time\":\"AUTO\"}";
  
  Serial.println("[SYSTEM] Initiating dispatch API transmission...");
  
  if (WiFi.status() == WL_CONNECTED) {
    sendPostWiFi(jsonPayload);
  } else {
    sendPostGSM(jsonPayload);
  }
}

// ======================== HTTP POST VIA WI-FI ========================
void sendPostWiFi(String payload) {
  HTTPClient http;
  
  Serial.println("[HTTP-WiFi] Connecting to host API endpoint...");
  http.begin(apiEndpoint);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    Serial.print("[HTTP-WiFi] Response Code: ");
    Serial.println(httpResponseCode);
    
    String responseBody = http.getString();
    Serial.println("[HTTP-WiFi] API Response Payload: ");
    Serial.println(responseBody); // Rule 6 - Print response
  } else {
    Serial.print("[HTTP-WiFi] Error Sending POST Request: ");
    Serial.println(http.errorToString(httpResponseCode).c_str());
  }
  
  http.end();
}

// ======================== GSM COMMUNICATIONS (AT COMMANDS) ========================
void initSIM800L() {
  Serial.println("[SIM800L] Checking module communications interface...");
  sendATCommand("AT", 1000);
  sendATCommand("AT+CSQ", 1000);     // Check signal quality
  sendATCommand("AT+CREG?", 1000);   // Check network registration status
}

void sendPostGSM(String payload) {
  Serial.println("[HTTP-GSM] Commencing GSM GPRS fallback POST pipeline...");
  
  // Set APN and initialize GPRS connection
  sendATCommand("AT+SAPBR=3,1,\"Contype\",\"GPRS\"", 2000);
  String apnCmd = "AT+SAPBR=3,1,\"APN\",\"" + String(gsmApn) + "\"";
  sendATCommand(apnCmd.c_str(), 2000);
  sendATCommand("AT+SAPBR=1,1", 3000); // Enable GPRS profile 1
  
  // Initialize HTTP engine
  sendATCommand("AT+HTTPINIT", 2000);
  sendATCommand("AT+HTTPPARA=\"CID\",1", 2000);
  
  String urlCmd = "AT+HTTPPARA=\"URL\",\"" + String(apiEndpoint) + "\"";
  sendATCommand(urlCmd.c_str(), 2000);
  sendATCommand("AT+HTTPPARA=\"CONTENT\",\"application/json\"", 2000);
  
  // Load JSON payload size and content
  String dataCmd = "AT+HTTPDATA=" + String(payload.length()) + ",5000";
  sendATCommand(dataCmd.c_str(), 2000);
  sim800l.println(payload); // Write payload data to buffer
  delay(1000);
  
  // Trigger POST action (1 = POST)
  Serial.println("[HTTP-GSM] Dispatching POST request...");
  sendATCommand("AT+HTTPACTION=1", 6000);
  
  // Read API response code and body
  sendATCommand("AT+HTTPREAD", 3000);
  
  // Terminate HTTP and GPRS profile
  sendATCommand("AT+HTTPTERM", 2000);
  sendATCommand("AT+SAPBR=0,1", 2000);
  
  Serial.println("[HTTP-GSM] Transmission process finished.");
}

// AT command sender helper
void sendATCommand(const char* cmd, int timeout) {
  Serial.print("[AT] Transmitting: ");
  Serial.println(cmd);
  
  sim800l.println(cmd);
  unsigned long start = millis();
  
  // Read response buffer until timeout
  while (millis() - start < timeout) {
    while (sim800l.available()) {
      char c = sim800l.read();
      Serial.write(c); // Output response to Serial Monitor
    }
  }
  Serial.println();
}
