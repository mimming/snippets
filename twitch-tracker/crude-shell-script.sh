#!/bin/sh
# Copyright 2017 Google Inc.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

# curl -H 'Accept: application/vnd.twitchtv.v5+json' -H 'Client-ID: qhqv7jyn0xk5tl4ogpmvxcf6n0l938' 'https://api.twitch.tv/kraken/communities/top?limit=100&cursor=MTAw' | python -m json.tool  | grep -C 2 programming

# Get number of programming channels
CHANNELS=`curl -H 'Accept: application/vnd.twitchtv.v5+json' -H 'Client-ID: qhqv7jyn0xk5tl4ogpmvxcf6n0l938' 'https://api.twitch.tv/kraken/communities/top?limit=100&cursor=MTAw' | python -m json.tool  | grep -C 2 programming | grep channels | tr ',' ' ' | awk '{ print $2 }'`

VIEWERS=`curl -H 'Accept: application/vnd.twitchtv.v5+json' -H 'Client-ID: qhqv7jyn0xk5tl4ogpmvxcf6n0l938' 'https://api.twitch.tv/kraken/communities/top?limit=100&cursor=MTAw' | python -m json.tool  | grep -C 2 programming | grep viewers | awk '{ print $2 }'`

TIMESTAMP=`date +%y-%m-%dT%H:%M`

# TODO: change to a writable path
echo "${TIMESTAMP},${CHANNELS},${VIEWERS}" >> /home/mimmingcodes/yay/data.csv
