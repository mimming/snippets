var five = require("johnny-five"),
  board, button;

board = new five.Board();

board.on("ready", function() {

  button = new five.Button(8);
  var led = new five.Led(7);
  var photoresistor = new five.Sensor({
    pin: "A2",
    freq: 250
  });


  board.repl.inject({
    button: button,
    led: led,
    photoresistor: photoresistor
  });

  button.on("down", function() {
    console.log("down");
    led.on();
  });

  button.on("up", function() {
    console.log("up");
		led.off();
  });

  photoresistor.on("data", function() {
    if(this.value > 700) {
      console.log("I'm upside down!");
    }
  });
});
