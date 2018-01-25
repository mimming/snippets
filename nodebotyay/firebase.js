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

var admin = require("firebase-admin");

var serviceAccount = require("./serviceaccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodebotsyay.firebaseio.com/"
});

var db = admin.database();
var buttonRef = db.ref("button");

board = new five.Board();

board.on("ready", function() {

  button = new five.Button(8);
  var led = new five.Led(7);

  board.repl.inject({
    button: button,
    led: led
  });

  button.on("down", function() {
    buttonRef.set("down");
  });

  button.on("up", function() {
    buttonRef.set("up");
  });


  buttonRef.on("value", function(snapshot) {
    let val = snapshot.val();
    if(val == "down") {
      console.log("down");
      led.on();
    }  else {
      console.log("up");
      led.off();
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
});
