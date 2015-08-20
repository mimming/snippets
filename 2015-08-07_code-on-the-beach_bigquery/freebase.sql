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


-- Query 1: Age distribution of notable people

SELECT age, COUNT(*) c
FROM [fh-bigquery:freebase20140119.compute_ages]
WHERE age
  BETWEEN 1 AND 80
GROUP BY 1
ORDER BY 1;

-- Query 2: Ten most prominent women, by location
-- Paste results into http://devnook.github.io/GenderMaps/maplabels/

SELECT title, count, iso FROM (
SELECT title, count, c.iso iso, RANK() OVER (PARTITION BY iso ORDER BY count DESC) rank
FROM (
 SELECT a.title title, SUM(requests) count, b.person person
 FROM [fh-bigquery:wikipedia.pagecounts_201505] a
 JOIN (
   SELECT REGEXP_REPLACE(obj, '/wikipedia/id/', '') title, a.sub person
   FROM [fh-bigquery:freebase20140119.triples_nolang] a
   JOIN (
     SELECT sub FROM [fh-bigquery:freebase20140119.people_gender]
     WHERE gender='/m/02zsn') b
   ON a.sub=b.sub
   WHERE obj CONTAINS '/wikipedia/id/' AND pred = '/type/object/key'
   GROUP BY 1,2) b
 ON a.title = b.title 
 GROUP BY 1,3) a
JOIN EACH [fh-bigquery:freebase20140119.people_place_of_birth] b
ON a.person=b.sub
JOIN [fh-bigquery:freebase20140119.place_of_birth_to_country] c
ON b.place_of_birth=c.place)
WHERE rank=1 ORDER BY count DESC
