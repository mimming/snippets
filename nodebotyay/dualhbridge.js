var five = require("johnny-five"),
  board, button;

board = new five.Board();

board.on("ready", function() {

  button = new five.Button(8);
  var led = new five.Led(7);

   var motors = new five.Motors([
     { pins: { dir: 12, pwm: 11 }, invertPWM: true },
     { pins: { dir: 4, pwm: 5}, invertPWM: true }
   ]);
  

  board.repl.inject({
    button: button,
    led: led,
    motors: motors
  });

  button.on("down", function() {
    console.log("down");
    led.on();
    console.log("Half speed ahead!");
    motors.forward(130);
  });

  button.on("up", function() {
    console.log("up");
		led.off();
    console.log("Half speed back!");
    motors.reverse(130);
  });
  
});
