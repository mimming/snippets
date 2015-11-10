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
var Firebase = require("firebase");

var board = new five.Board();

var firebaseRef = new Firebase("https://firehippos.firebaseio-demo.com/");

board.on("ready", function () {

  var hippos = {
    yellow: new five.Servo(9), 
    green: new five.Servo(6), 
    pink: new five.Servo(5), 
    orange: new five.Servo(3)
  }; 


  var sweepHippo = function (snapshot) {
    var hippoValue = snapshot.val();
    if (hippoValue == "down") {
      console.log(snapshot.key() + " down");
      hippos[snapshot.key()].max();
      //setTimeout(function() {
      //  hippos[snapshot.key()].min();
      //}, 1200);
    } else {
      console.log(snapshot.key() + " up");
      hippos[snapshot.key()].min();
    }
  }

  firebaseRef.child("yellow").on("value", sweepHippo);
  firebaseRef.child("green").on("value", sweepHippo);
  firebaseRef.child("pink").on("value", sweepHippo);
  firebaseRef.child("orange").on("value", sweepHippo);
});
