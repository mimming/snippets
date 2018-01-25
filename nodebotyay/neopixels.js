// Copyright 2018 Google Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

var five = require("johnny-five"),
  board, button;
var pixel = require("node-pixel");

board = new five.Board();

board.on("ready", function() {

  button = new five.Button(8);
  var led = new five.Led(7);
  var strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 16}, ], // this is preferred form for definition
    gamma: 1.5, // set to a gamma that works nicely for WS2812
  });

  board.repl.inject({
    button: button,
    led: led
  });

  button.on("down", function() {
    console.log("down");
    led.on();
    strip.color("#ff0000"); // turns entire strip red using a hex colour
    strip.show();
  });

  button.on("up", function() {
    console.log("up");
		led.off();
    strip.color("#00ff00"); // turns entire strip red using a hex colour
    strip.show();
  });
});
