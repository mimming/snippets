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

board = new five.Board();

board.on("ready", function() {

  button = new five.Button(8);
  let led = new five.Led(7);
  let motors = new five.Motors([
    { pins: { dir: 12, pwm: 11 }, invertPWM: true },
    { pins: { dir: 4, pwm: 5}, invertPWM: true }
  ]);


  board.repl.inject({
    button: button,
    led: led,
    motors: motors
  });

  console.log("Full speed ahead!");
  motors.forward(255);


  button.on("down", function() {
    console.log("down");
    led.on();
  });

  button.on("up", function() {
    console.log("up");
		led.off();
  });
});
