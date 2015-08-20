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


-- Query 1: News articles per month in Romania

SELECT TIMESTAMP(STRING(MonthYear) + '01') month, 
       SUM(ActionGeo_CountryCode='RO') Romania
FROM [gdelt-bq:full.events]
WHERE MonthYear > 0
GROUP BY 1 ORDER BY 1;

-- Query 2: News articles per month in Romania, normalized

SELECT TIMESTAMP(STRING(MonthYear) + '01') month, 
       SUM(ActionGeo_CountryCode='RO') / COUNT(*) Romania
FROM [gdelt-bq:full.events]
WHERE MonthYear > 0
GROUP BY 1 ORDER BY 1;

