var five = require("johnny-five"),
  board, button;
var pixel = require("node-pixel");

board = new five.Board();

board.on("ready", function() {

  button = new five.Button(8);
  var led = new five.Led(7);
  var strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 16}, ], // this is preferred form for definition
    gamma: 1.5, // set to a gamma that works nicely for WS2812
  });

  board.repl.inject({
    button: button,
    led: led
  });

  button.on("down", function() {
    console.log("down");
    led.on();
    strip.color("#ff0000"); // turns entire strip red using a hex colour
    strip.show();
  });

  button.on("up", function() {
    console.log("up");
		led.off();
    strip.color("#00ff00"); // turns entire strip red using a hex colour
    strip.show();
  });
});
