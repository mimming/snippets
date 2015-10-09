/*
     Copyright 2015, Google, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var five = require('johnny-five');
var raspi = require('raspi-io');
var Firebase = require("firebase");

var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {

  var button = new five.Button('GPIO20');
  var led = new five.Led('GPIO23');

  var rootRef = new Firebase("https://firebutton.firebaseio-demo.com/");
  var buttonRef = rootRef.child("button");

  // Turn the LED on, so we know the bot is running
  led.on();

  // Write button state to Firebase
  button.on("up", function() {
    console.log("button up");
    buttonRef.set("up");
  });

  button.on("down", function() {
    console.log("button down");
    buttonRef.set("down");
  });

  // Control the LED from Firebase
  buttonRef.on("value", function(snapshot) {
    var val = snapshot.val();
    if(val == "down") {
      console.log("turning led on");
      led.on();
    } else {
      console.log("turning led off");
      led.off();
    }
  });
});
