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

const functions = require('firebase-functions');
const firebase = require('firebase');
const rp = require('request-promise');
const _ = require('lodash');

const firebaseConfig = {
    apiKey: "AIzaSyBmk5NHsNEri6J1vISirSwsNQvIV3zaC5k",
    authDomain: "twitch-tracker.firebaseapp.com",
    databaseURL: "https://twitch-tracker.firebaseio.com",
    projectId: "twitch-tracker",
    storageBucket: "twitch-tracker.appspot.com",
    messagingSenderId: "1026503451140"
};
firebase.initializeApp(firebaseConfig);

let statsRef = firebase.database().ref('/stats');

exports.trackTwitch = functions.https.onRequest((req, resp) => {
    let timestamp = new Date();

// TODO: deal with end of community list
// Page through the API to find the programming community
    return fetchAndCheck().then(function (programmingJson) {
        let viewers = programmingJson['viewers'];
        let channels = programmingJson['channels'];

        resp.send(`${timestamp.toISOString()},${channels},${viewers}`);

        // Write to Firebase Realtime Database
        statsRef.push({
            timestamp: timestamp.toISOString(),
            channels: channels,
            viewers: viewers
        });
    }).catch(function (err) {
        resp.send(`bad stuff ${err}`);
    });
});

function fetchAndCheck(cursor, pageDepth) {
    // Deal with paging down too far
    const maxPageDepth = 5;
    if (pageDepth === undefined) {
        // No value passed in?  Assume that I just started at page 0
        pageDepth = 0;
    }
    if ( pageDepth > maxPageDepth ) {
        throw `No programming community after ${pageDepth}.  Limit is ${maxPageDepth}`
    }

    // console.log("doing a request with cursor" + cursor);

    let reqConfig = {
        uri: 'https://api.twitch.tv/kraken/communities/top',
        qs: {
            limit: '100'
        },
        headers: {
            'Client-ID': 'qhqv7jyn0xk5tl4ogpmvxcf6n0l938',
            'Accept': 'application/vnd.twitchtv.v5+json'
        },
        json: true
    };

    // Only add a cursor if one has been passed in
    if (cursor) {
        reqConfig.qs.cursor = cursor;
    }

    return rp(reqConfig).then(function (resp) {
        let programmingMaybe = _.find(resp.communities, {'name': 'programming'});
        if (programmingMaybe === undefined) {
            return fetchAndCheck(resp._cursor, pageDepth + 1);
        } else {
            return programmingMaybe;
        }
    });
}
