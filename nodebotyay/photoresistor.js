var five = require("johnny-five"),
  board, button;
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

board = new five.Board();

board.on("ready", function() {

  button = new five.Button(8);
  var led = new five.Led(7);
  var photoresistor = new five.Sensor({
    pin: "A2",
    freq: 250
  });


  board.repl.inject({
    button: button,
    led: led,
    photoresistor: photoresistor
  });

  button.on("down", function() {
    console.log("down");
    led.on();
  });

  button.on("up", function() {
    console.log("up");
		led.off();
  });

  photoresistor.on("data", function() {
    if(this.value > 700) {
      console.log("I'm upside down!");
    }
  });
});
