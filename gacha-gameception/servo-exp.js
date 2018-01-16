var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var servo = new five.Servo({
    pin: 3, 
    type: "continuous",
    deadband: [90, 90]
  });

  board.repl.inject({
    servo: servo
  });
  

  // Clockwise, top speed.
  servo.stop();
});
