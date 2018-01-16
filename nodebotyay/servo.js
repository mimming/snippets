var five = require("johnny-five"),
  board, button;

board = new five.Board();

board.on("ready", function() {

  button = new five.Button(8);
  var led = new five.Led(7);
  var servo = new five.Servo(10);
  

  board.repl.inject({
    button: button,
    led: led,
    servo: servo    
  });

  button.on("down", function() {
    console.log("down");
    led.on();
    servo.min();
  });

  button.on("up", function() {
    console.log("up");
		led.off();
    servo.max();
  });
});
