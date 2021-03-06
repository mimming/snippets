/*
     Copyright 2016, Google, Inc.
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

var five = require("johnny-five"),
  board, button;
var Firebase = require("firebase");

board = new five.Board();

board.on("ready", function() {

  // Create a new `button` hardware instance.
  // This example allows the button module to
  // create a completely default instance
  button = new five.Button(4);
  var led = new five.Led(12);
	var myFirebaseRef = new Firebase("https://firebutton.firebaseio-demo.com/button/");

  // "down" the button is pressed
  button.on("down", function() {
    console.log("down");
		myFirebaseRef.set("down");
  });

  // "up" the button is released
  button.on("up", function() {
    console.log("up");
		myFirebaseRef.set("up");
  });



	myFirebaseRef.on("value", function(snapshot) {
		var buttonState = snapshot.val(); 
	  if(buttonState == "down") {
		  led.on();
		} else {
		  led.off();
		}
	});
});

