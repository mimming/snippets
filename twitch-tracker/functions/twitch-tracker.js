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

let request = require('request');

let timestamp = new Date();

// TODO: don't assume it's on page 2.  That's madness.  But the cursor seems to be evergreen
let options = {
  url: 'https://api.twitch.tv/kraken/communities/top?limit=100&cursor=MTAw',
  headers: {
    'Accept': 'application/vnd.twitchtv.v5+json',
    'Client-ID': 'qhqv7jyn0xk5tl4ogpmvxcf6n0l938',
  }
};

request(options, function (error, response, body) {
  if(!error) {
	  let communitiesList = JSON.parse(body)['communities'];
		for(i in communitiesList) {
		  let community = communitiesList[i];
			if(community['name'] === 'programming') {
				let viewers = community['viewers'];
				let channels = community['channels'];

				console.log(`${timestamp.toISOString()},${channels},${viewers}`);

				break;
			}
		}
		// TODO: deal with never finding it (page through results)
	} else {
	  console.log("something went really wrong");
		console.log(error);
	}
});
