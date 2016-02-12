/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 /**
 Here's my Cloud Pub/Sub hello world! 
 Create an OAuth token, paste it into this file, and your ESP8266 
 will push a payload to Cloud Pub/Sub until it expires.

 Next up: Get auth working
 Someday: Build a library around this
 */
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

void setup() {
  Serial.begin(9600);

  // connect to wifi.
  WiFi.begin("WIFI_SSID");
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());

  // Send an http request
  String url = "";
  HTTPClient http;
  http.begin("https://pubsub.googleapis.com/v1/projects/mimming-demo/topics/esp8266hello:publish", "A0 F0 5C 41 6A 66 54 6E 26 C6 8B E6 39 0E 32 51 51 9D A3 23");
  http.addHeader("content-type", "application/json");
  http.addHeader("authorization", "Bearer OAUTH_TOKEN_GOES_HERE");
  String value = "{\"messages\": [{\"data\": \"SGVsbG8gQ2xvdWQgUHViL1N1YiEgSGVyZSBpcyBteSBtZXNzYWdlIQ==\"}]}";
  int statusCode =  http.sendRequest("POST", (uint8_t*)value.c_str(), value.length());
  
  Serial.println(statusCode);
  Serial.println(http.getString());
}

void loop() {
}
