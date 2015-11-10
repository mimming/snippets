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


-- Query 1: The data for a principal component analysis chart of sum of variations from reference

SELECT Sample, SUM(single), SUM(double),
FROM (
  SELECT call.call_set_name AS Sample,
    SOME(call.genotype > 0) AND NOT EVERY(call.genotype > 0) WITHIN call AS single,

    EVERY(call.genotype > 0) WITHIN call AS double,
  FROM[genomics-public-data:1000_genomes.variants]
  OMIT RECORD IF reference_name IN ("X","Y","MT"))
GROUP BY Sample ORDER BY Sample
