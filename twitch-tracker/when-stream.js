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

// The fancier code that I wrote in Poland on Sept 9, and then promptly forgot about.
// TODO: integrate into functions/index.js

const config = require('./config.json');
const rp = require('request-promise');
const _ = require('lodash');

function fetchAndCheck(cursor) {
	// console.log("doing a request with cursor" + cursor);

	let reqConfig = {
    uri: 'https://api.twitch.tv/kraken/communities/top',
    qs: {
        limit: '100'
    },
    headers: {
			  'Client-ID': config.client_id,
		    'Accept': 'application/vnd.twitchtv.v5+json'
    },
    json: true
  };
	
	// Only add a cursor if one has been passed in
	if(cursor) {
		reqConfig.qs.cursor = cursor;
	}

	return rp(reqConfig).then(function (resp) {
		let programmingMaybe = _.find(resp.communities, {'name': 'programming'});
		if(programmingMaybe === undefined) {
			return fetchAndCheck(resp._cursor);
		} else {
			return programmingMaybe;
		}
  })
  .catch(function (err) {
	  console.log("Something bad happened");
		console.log(err);
	});
}

fetchAndCheck().then(function(programmingJson) {
  console.log(programmingJson);
});

