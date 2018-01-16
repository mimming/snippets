// Copyright 2017 Google Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

const pixel = require("node-pixel");
const five = require("johnny-five");
const assert = require('assert');
const Enum = require('enum');

const board = new five.Board();

let strip = null;
let servo = null;
let toggle = null;

board.on("ready", function () {
  // TODO: extract this into some kind of enum

  // This is a list because I don't know what the future Techthulu (portal API)
  const portalFactionEnum = new Enum({'neutral': 0, 'enlightened': 1, 'resistance': 2});

  // Default to neutral
  let portalOwner = portalFactionEnum.neutral;

  let config = {};

  servo = new five.Servo({
    pin: 3,
    type: "continuous"
  });

  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [{pin: 4, length: 190},],
    gamma: 2.8,
  });

  toggle = new five.Switch(6);

  toggle.on("close", function () {
    evalStatus(portalFactionEnum.enlightened);
  });

  toggle.on("open", function () {
    evalStatus(portalFactionEnum.resistance);
  });


  function dispenseCapsule() {
    servo.cw();
    setTimeout(function () {
      servo.stop()
    }, 1200);
  }

  function applyNewOwner(newPortalOwner) {
    assert.ok(portalFactionEnum.isDefined(newPortalOwner),
        `switched to illegal state ${newPortalOwner}`);

    // toggle for animation
    portalOwner = portalFactionEnum.get(newPortalOwner);
    repaintWholeStrip();

    // only dispense if it's not neutral
    if (portalOwner !== portalFactionEnum.neutral) {
      dispenseCapsule();
    }
  }


  // Run whenever there is a portal state change
  // still depends on that portalOwner global
  function repaintWholeStrip() {
    assert.ok(portalFactionEnum.isDefined(portalOwner),
        `switched to illegal state ${portalOwner}`);

    const white = [255, 255, 255];

    // White for neutral?
    let baseColor = [255, 255, 255];

    if (portalOwner === portalFactionEnum.enlightened) {
      // Green for enl
      baseColor = [0, 255, 0];
    } else if (portalOwner === portalFactionEnum.resistance) {
      // Blue for res
      baseColor = [0, 0, 255];
    }

    // make it twinkle
    for (let i = 0; i < strip.length; i++) {
      // Do a white pixel randomly every 20 or so
      let isWhite = Math.floor((Math.random() * 20)) === 0;
      if (isWhite) {
        strip.pixel(i).color(white);
      } else {
        // Do a color randomly far from the base color
        let difference = Math.floor((Math.random() * 80) + 1);
        let color = [0, 0, 0];

        for (let j = 0; j < 3; j++) {
          if (baseColor[j] === 255) {
            color[j] = baseColor[j] - difference;
          } else {
            color[j] = baseColor[j] + difference;
          }

          // Prevent going beyond limits
          if (color[j] > 255) {
            color[j] = 255;
          }
          if (color[j] < 0) {
            color[j] = 0;
          }
        }
        strip.pixel(i).color(color);
      }
    }
    strip.show();
  }

  // TODO: figure out how to add red pixels for attack effects
  // Runs animation program -- reading global portalOwner variable
  function animateStrip() {

    // Don't repaint whole strip each time
    strip.shift(1, pixel.FORWARD, true);
    strip.show();

    // TODO: move this down to some control area (like init function)
    setTimeout(function () {
      animateStrip()
    }, 100);
  }

  // Checks if the faction change really has happened
  // If it has, pass it off to applyNewOwner() function
  function evalStatus(portalStatus) {

    // pull out the faction
    const newPortalOwner = portalStatus;
    assert.ok(portalFactionEnum.isDefined(newPortalOwner),
        `switched to illegal state ${newPortalOwner}`);

    // If there's been a faction change
    if (newPortalOwner !== portalOwner) {
      console.log("faction change to " + newPortalOwner);
      applyNewOwner(newPortalOwner);
    }
  }

  // Startup stuff!
  strip.on("ready", function () {
    // Do an initial paint
    repaintWholeStrip();

    // Start the animation forever-function
    animateStrip();
  });
});

