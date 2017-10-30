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

import requests

$  curl -H 'Accept: application/vnd.twitchtv.v5+json' -H 'Client-ID: qhqv7jyn0xk5tl4ogpmvxcf6n0l938' 'https://api.twitch.tv/kraken/communities/top?limit=100&cursor=MTAw' | python -m json.tool  | grep -C 2 programming


# history7 from repl

r = requests.get('https://api.twitch.tv/kraken/communities/top?limit=100', headers={'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': 'qhqv7jyn0xk5tl4ogpmvxcf6n0l938'})
r.text
import json
json.loads(r.text)
foo = json.loads(r.text)
foo
foo.keys()
foo['_cursor']
foo['communities']
foo['communities'].keys()
foo['communities'][0]
foo['communities'][1]
foo['communities'][2]
foo['communities'][3]
foo['communities'][4]
foo['communities'][4]['name']
foo['communities'].map('name')
for(com in foo['communities']):
for com in foo['communities']:
  print(com['name'])
for com in foo['communities']:
  if com['name'] == 'programming':
    print com
    print(com)
for com in foo['communities']:
  if com['name'] == 'programming':
    print(com)
foo['_cursor']
r = requests.get('https://api.twitch.tv/kraken/communities/top?limit=100&cursor=MTAw', headers={'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': 'qhqv7jyn0xk5tl4ogpmvxcf6n0l938'})
foo2 = json.load(r.text)
foo2 = json.loads(r.text)
foo2
foo2.keys()
foo2['communities']
for com in foo2['communities']:
  if com['name'] == 'programming':
    print(com)
history()
readline.get_current_history_length()
import readline
