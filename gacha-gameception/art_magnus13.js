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
const http = require('http');
const assert = require('assert');



let board = new five.Board();
let strip = null;
let servo = null;

//let techulu_hostname = "192.168.66.13";
//let techulu_suffux = "json";

board.on("ready", function () {
    let portalOwner = 'neutral';
    let portalLevel = 0;

		this.repl.inject({
		  po: portalOwner,
			pl: portalLevel
		});
		

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


    function dispenseCapsule() {
        servo.cw();
        setTimeout(function () {
            servo.stop()
        }, 1200);
    }

    /**
     * newOwner = ['enl', 'res', 'neutral']
     * TODO: add timer
     */
    portalChange = function (newOwner) {
        legalStates = ['enl', 'res', 'neutral'];
        if (legalStates.indexOf(newOwner) != -1 && newOwner != portalOwner) {
            // toggle for animation
            portalOwner = newOwner;
            if (newOwner != 'neutral') {
                dispenseCapsule();
            }
        }
    };

    function animate() {
        let baseColor = [255, 255, 255];
        if (portalOwner == 'enl') {
            baseColor = [0, 255, 0];
        } else if (portalOwner == 'res') {
            baseColor = [0, 0, 255];
        }

        // make it twinkle
        for (let i = 0; i < strip.length; i++) {

            let difference = Math.floor((Math.random() * 80) + 1);
            let color = [0, 0, 0];
            for (let j = 0; j < 3; j++) {
                if (baseColor[j] == 255) {
                    color[j] = baseColor[j] - difference;
                } else {
                    color[j] = baseColor[j] + difference;
                }

                if (color[j] > 255) {
                    color[j] = 255;
                }
                if (color[j] < 0) {
                    color[j] = 0;
                }
            }
            strip.pixel(i).color(color);
        }
        strip.show();
        setTimeout(function () {
            animate()
        }, 1000);
    }

    function evalStatus(portalStatus) {
		    portalStatus = portalStatus['externalApiPortal']
        let portalOwnerMap = {
            'Neutral': "neutral",
            'Enlightened': "enl",
            'Resistance': "res",
        };

        let newPortalOwner = portalStatus.controllingFaction;
				console.log(newPortalOwner);
        //assert.ok(newPortalOwner == 0 || newPortalOwner == 1 || newPortalOwner == 2);

        let newPortalOwnerName = portalOwnerMap[newPortalOwner];

        // Update the portal level
        //assert.ok(portalStatus.hasOwnProperty('resonators'));
        //let sumOfLevels = 0;

        //for(let i in portalStatus['resonators']) {
       //    let resonator = portalStatus['resonators'][i];
//
    //        assert.ok(resonator.hasOwnProperty('level'));
  //          assert.ok(Number.isInteger((resonator['level'])));

      //      sumOfLevels += resonator['level'];
        //}
        //let newPortalLevel = Math.floor(sumOfLevels / 8);

        //if(newPortalLevel != portalLevel) {
         //   console.log("portal level changed. Now level " + newPortalLevel);
          //  portalLevel = newPortalLevel;
        //}


        // If there's been a faction change
        if(newPortalOwnerName != portalOwner) {
            console.log("faction change to " + newPortalOwnerName);
            portalChange(newPortalOwnerName);
        }
    }

    function fetchStatus() {
        let statusPath = '/portals/Tecthulhu12.json';
        const req = http.request({
            hostname: '192.168.66.13',
            port: 80,
            path: statusPath,
            method: 'GET'
        }, (res) => {
            let resBody = '';
            res.on('data', (d) => {
                resBody += d;
            });

            res.on('end', () => {
								try {
						      console.log(resBody);
                  evalStatus(JSON.parse(resBody));
							  } catch(e) {
								  console.log(e);
								}
            });
        });

        req.on('error', (e) => {
            console.error(e);
        });
        req.end();


        setTimeout(function () {
            fetchStatus();

        }, 1200);
    }


    strip.on("ready", function () {
        animate();
        fetchStatus();
    });
});


