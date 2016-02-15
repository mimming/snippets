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

-- Queries as presented at the DevNexus by Jen Tong on 16 Feb 2016
-- Related slides: http://mimming.com/presos/exploring-open-data/2016-02-15-exploring-open-data-devnexus.pdf

------
-- Count Stuff
------

-- Words in Shakespeare
SELECT count(word)
FROM publicdata:samples.shakespeare

-- Wikipedia hits over 1 hour
SELECT sum(requests) as total
FROM [fh-bigquery:wikipedia.pagecounts_20150511_05]

-- Wikipedia hits over 1 month
SELECT sum(requests) as total
FROM [fh-bigquery:wikipedia.pagecounts_201505]

-- Several years of Wikipedia data
SELECT
  SUM(requests) AS total
FROM
  TABLE_QUERY(
    [fh-bigquery:wikipedia], 
    'REGEXP_MATCH(
      table_id, 
      r"pagecounts_2015[0-9][0-9]$")')

-- RegExp over years of Wikipedia data
SELECT
  SUM(requests) AS total
FROM
  TABLE_QUERY( [fh-bigquery:wikipedia], 'REGEXP_MATCH(
      table_id, 
      r"pagecounts_2015[0-9][0-9]$")')
WHERE
  (REGEXP_MATCH(title, '.*[dD]inosaurs.*'))

------
-- Open Data - GSOD
------

-- Weather in Atlanta for 2015
SELECT DATE(year+mo+da) day, min, max
FROM [fh-bigquery:weather_gsod.gsod2013] 
WHERE stn IN (
  SELECT usaf FROM [fh-bigquery:weather_gsod.stations] 
  WHERE name = 'ATLANTA MUNICICPAL')
AND max < 200
ORDER BY day;

-- Hottest day each year since 1929
SELECT year, max(max) as max
FROM
  TABLE_QUERY(
    [fh-bigquery:weather_gsod], 
    'table_id CONTAINS "gsod"')
where max < 200    
group by year order by year asc

------
-- Open Data - GDELT - Stories per month - MA, normalized
------
SELECT DATE(STRING(MonthYear) + '01') month, 
       SUM(ActionGeo_ADM1Code='USGA') / COUNT(*) newsyness
FROM [gdelt-bq:full.events]
WHERE MonthYear > 0
GROUP BY 1 ORDER BY 1

------
-- Something useful - Movie recommendation
------

-- get a title
select title, id, count(id) as edits
from [publicdata:samples.wikipedia]
where 
  title contains 'Hackers'
  and title contains '(film)'
  and wp_namespace = 0
group by title, id
order by edits
limit 10

-- recommendations if you like Hackers
select title, id, count(id) as edits 
from [publicdata:samples.wikipedia]
where contributor_id in (
    select contributor_id 
    from [publicdata:samples.wikipedia]
    where 
		  id = 264176  
      and contributor_id is not null
      and is_bot is null
      and wp_namespace = 0
      and title CONTAINS '(film)'			
    group by contributor_id)
  and wp_namespace = 0
  and id != 264176 
  and title CONTAINS '(film)'
group each by title, id
order by edits desc
limit 100

-- Discover the most popular 50 films
select title, id, count(id) as edits 
from [publicdata:samples.wikipedia]
where 
  wp_namespace = 0
  and title CONTAINS '(film)'
group each by title, id
order by edits desc
limit 100

-- IDs of most popular 50 films
select id from (
  select id, count(id) as edits
  from [publicdata:samples.wikipedia]
  where 
    wp_namespace = 0
    and title CONTAINS '(film)'
  group each by id
  order by edits desc
  limit 20)

-- Recommended movies, minus most popular
select title, id, count(id) as edits 
from [publicdata:samples.wikipedia]
where contributor_id in (
    select contributor_id 
    from [publicdata:samples.wikipedia]
    where 
		  id = 264176  
      and contributor_id is not null
      and is_bot is null
      and wp_namespace = 0
      and title CONTAINS '(film)'			
    group by contributor_id)
  and wp_namespace = 0
  and id != 264176 
  and title CONTAINS '(film)'
  and id not in (
    select id from (
      select id, count(id) as edits
      from [publicdata:samples.wikipedia]
      where 
        wp_namespace = 0
        and title CONTAINS '(film)'
      group each by id
      order by edits desc
      limit 20
    )
  )
group each by title, id
order by edits desc
limit 100
