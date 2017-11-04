--      Copyright 2017, Google, Inc.
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


-- Queries from Jen's 'Exploring Open Data with BigQuery' talk.  More details: https://mimming.com/bqtalk
--
-- These are in BigQuery's standard SQL syntax - https://cloud.google.com/bigquery/docs/reference/standard-sql/migrating-from-legacy-sql


------
-- Count Stuff
------

-- Words in Shakespeare
#standardSQL
SELECT count(word)
FROM `publicdata.samples.shakespeare`

-- Wikipedia hits over 1 hour
#standardSQL
SELECT sum(requests)
FROM `fh-bigquery.wikipedia.pagecounts_20150212_01`

-- Wikipedia hits over 1 month
#standardSQL
SELECT sum(requests)
FROM `fh-bigquery.wikipedia.pagecounts_201505`


-- A year of Wikipedia data
#standardSQL
SELECT sum(requests)
FROM `fh-bigquery.wikipedia.pagecounts_2015*`

-- RegExp over a year of Wikipedia data
#standardSQL
SELECT SUM(requests)
FROM (
  SELECT 
    requests,
    REGEXP_CONTAINS(title, r"[Dd]inosaur") AS rmatch
  FROM
    `fh-bigquery.wikipedia.pagecounts_2015*`)
WHERE rmatch = TRUE

------
-- Something useful - Movie recommendation
------

-- Pick a great movie
#standardSQL
SELECT title, id, COUNT(id) AS edits
FROM `publicdata.samples.wikipedia`
WHERE
  title LIKE '%Hackers%'
  AND title LIKE '%(film)%'
  AND wp_namespace = 0
GROUP BY title, id
ORDER BY edits
LIMIT 10

-- Recommendations if you like Hackers
#standardSQL
SELECT title, id, COUNT(id) AS edits
FROM `publicdata.samples.wikipedia`
WHERE contributor_id IN (
    SELECT contributor_id
    FROM `publicdata.samples.wikipedia`
    WHERE
      id = 264176
      AND contributor_id IS NOT NULL
      AND is_bot IS NULL
      AND wp_namespace = 0
      AND title LIKE '%(film)%'
    GROUP BY contributor_id)
  AND wp_namespace = 0
  AND id != 264176
  AND title LIKE '%(film)%'
GROUP BY title, id
ORDER BY edits DESC
LIMIT 100


-- IDs of most controversial 20 films
#standardSQL
SELECT id FROM (
  SELECT id, COUNT(id) AS edits
  FROM `publicdata.samples.wikipedia`
  WHERE
    wp_namespace = 0
    AND title LIKE '%(film)%'
  GROUP BY id
  ORDER BY edits DESC
  LIMIT 20)

-- Recommended movies, minus most controversial
#standardSQL
SELECT title, id, COUNT(id) AS edits
FROM `publicdata.samples.wikipedia`
WHERE contributor_id IN (
    -- People who edited Hackers
    SELECT contributor_id
    FROM `publicdata.samples.wikipedia`
    WHERE
      id = 264176
      AND contributor_id IS NOT NULL
      AND is_bot IS NULL
      AND wp_namespace = 0
      AND title LIKE '%(film)%'
    GROUP BY contributor_id )
  AND wp_namespace = 0
  AND id != 264176
  AND title LIKE '%(film)%'
  AND id NOT IN ( 
    -- Filter out controversial films
    SELECT id FROM ( 
      SELECT id, COUNT(id) AS edits
      FROM `publicdata.samples.wikipedia`
      WHERE
        wp_namespace = 0
        AND title LIKE '%(film)%'
      GROUP BY id
      ORDER BY edits DESC
      LIMIT 20 ))
GROUP BY title, id
ORDER BY edits DESC
LIMIT 10

