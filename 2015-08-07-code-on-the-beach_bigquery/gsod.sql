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


-- Query 1: Weather in Bucharest

SELECT TIMESTAMP(year+mo+da) day, min, max, IF(prcp=99.99,0,prcp) prcp
FROM [fh-bigquery:weather_gsod.gsod2014] a
WHERE stn IN (
  SELECT usaf FROM [fh-bigquery:weather_gsod.stations] 
  WHERE name = 'BUCURESTI INMH-BANE')
ORDER BY day;

