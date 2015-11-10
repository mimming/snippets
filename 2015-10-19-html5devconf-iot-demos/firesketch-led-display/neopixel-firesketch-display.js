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
pixel = require("node-pixel");
five = require("johnny-five");
Firebase = require("firebase");

var board = new five.Board();

board.on("ready", function() {
    var BOARD_SIZE = 60;
	var NEOPIXELS_SIZE = 5;

    var rootRef = new Firebase("https://firesketch.firebaseio-demo.com/");

    var strip = new pixel.Strip({
        data: 6,
        length: NEOPIXELS_SIZE * NEOPIXELS_SIZE,
        board: this,
        controller: "FIRMATA",
    });

    strip.on("ready", function() {
      console.log("init strip red");
      strip.color("#000000"); 

	  function drawPixel(snapshot) { updatePixel(snapshot, false); }
	  function clearPixel(snapshot) { updatePixel(snapshot, true); }

      function updatePixel(snapshot, clear) {
		// get location
		var logicalLoc = snapshot.key().split(":");
		console.log("got logical pixel", logicalLoc);
        // translate the pixel to strip location
		var physicalLoc = [];
		physicalLoc[0] = Math.floor(logicalLoc[0] * NEOPIXELS_SIZE / BOARD_SIZE);
		physicalLoc[1] = Math.floor(logicalLoc[1] * NEOPIXELS_SIZE / BOARD_SIZE);
		console.log("got physical pixel", physicalLoc);

		// get strip index 
		var stripPixel = (physicalLoc[0] * NEOPIXELS_SIZE) + physicalLoc[1];
		console.log("strip location: " + stripPixel);

		// get the color
        var val = snapshot.val();
		if(clear) {
		  // clear makes it go black
		  val="000";
		} 

		// convert it to longer format
		var channels = val.split("");
		var longColor = channels[0]+channels[0]+channels[1]+channels[1]+channels[2]+channels[2];
		console.log("long color: " + longColor);

		// write the color to the pixel
		var pixel = strip.pixel(stripPixel);
		if(pixel) {
		  pixel.color("#"+longColor); 
		  //strip.show();
		  console.log("coloing " + longColor + " at " + stripPixel);
        }
      }

      rootRef.on("child_added", drawPixel);
      rootRef.on("child_changed", drawPixel);
      rootRef.on("child_removed", clearPixel);

	  
      var display = function() {
          //var color = Math.floor(Math.random() * 99);
		  //var p1 = strip.pixel(1);
		  //p1.color("#ff"+ color + color); 
          //console.log("showing " + "#ff"+ color + color);
		  strip.show();
       }
      setInterval(display, 100);
    });
});
