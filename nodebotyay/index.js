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
