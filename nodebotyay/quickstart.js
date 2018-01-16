var five = require("johnny-five"),
  board, button;

board = new five.Board();

board.on("ready", function() {

  button = new five.Button(8);
  var led = new five.Led(7);

  board.repl.inject({
    button: button,
    led: led
  });

  button.on("down", function() {
    console.log("down");
    led.on();
  });

  button.on("up", function() {
    console.log("up");
		led.off();
  });
});
