--      Copyright 2015, Google, Inc.
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--      http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.


-- I warmed up with the "hello world" of big data: counting to big numbers

-- Query 1: Words in Shakespeare
SELECT count(word)
FROM publicdata:samples.shakespeare;

-- Query 2: Wikipedia hits over 1 hour (Count to millions)
SELECT sum(requests) as total
FROM [fh-bigquery:wikipedia.pagecounts_20150511_05];

-- Query 3: Wikipedia hits over 1 month (Count to billions)
SELECT sum(requests) as total
FROM [fh-bigquery:wikipedia.pagecounts_201505];


-- Query 4: Wikipedia hits over all my data (Count to almost a trillion)
SELECT sum(requests) as sum
FROM 
  [fh-bigquery:wikipedia.pagecounts_201405], 
  [fh-bigquery:wikipedia.pagecounts_201406], 
  [fh-bigquery:wikipedia.pagecounts_201407], 
  [fh-bigquery:wikipedia.pagecounts_201408], 
  [fh-bigquery:wikipedia.pagecounts_201409], 
  [fh-bigquery:wikipedia.pagecounts_201410], 
  [fh-bigquery:wikipedia.pagecounts_201411], 
  [fh-bigquery:wikipedia.pagecounts_201412],
  [fh-bigquery:wikipedia.pagecounts_201504],
  [fh-bigquery:wikipedia.pagecounts_201505];


