var five = require("johnny-five");
var Firebase = require("firebase");

var rootRef = new Firebase("https://firesketch.firebaseio-demo.com/");
var board = new five.Board();
board.on("ready", function() {

  // Create a new `potentiometer` hardware instance.
  potX = new five.Sensor({
    pin: "A0",
    freq: 10
  });
  potY = new five.Sensor({
    pin: "A1",
    freq: 10
  });

  var BOARD_SIZE = 60;

  var potXLast = 0;
  var potYLast = 0;

  var color = Math.floor((Math.random() * 4096)).toString(16);
  console.log("color: " + color);

  potX.on("data", function() {
    var cleanX = Math.floor(potX.value * BOARD_SIZE / 1023);
    if(potXLast != cleanX) {
      potXLast = cleanX;
      console.log("new X " + potXLast);
      writeChange();
    }
  });

  potY.on("data", function() {
    var cleanY = Math.floor(potY.value * BOARD_SIZE / 1023);
    if(potYLast != cleanY) {
      potYLast = cleanY;
      console.log("new Y " + potYLast);
      writeChange();
    }
  });

  function writeChange() {
    console.log("write: " + potXLast + " x " + potYLast);
    rootRef.child(potXLast + ":" + potYLast).set(color);
  }
});
