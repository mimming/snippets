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
