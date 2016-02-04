/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * 
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
This is the code I presented at the Silicon Valley GDG meetup on 3 Feb 2016
Realted slides: http://mimming.com/presos/bigtable/2016-02-03-gdgsv-bigtable-whats-its-awesome-at.pdf

Usage:
1. Download and decompress some Wikipedia pageview stats
   https://dumps.wikimedia.org/other/pagecounts-raw/
2. Clone the Bigtable simple-cli sample, and follow its install instructions:
   https://github.com/GoogleCloudPlatform/cloud-bigtable-examples/tree/master/java/simple-cli
3. Paste ths file into the appropriate package
4. Tweak the <mainClass /> element in the pom.xml to refer to this class
5. Use the same runner

(Yeah, I know these instructions are pretty ugly right now. I'll release
something better in the future)
 */
package com.example.bigtable.simplecli;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.util.Bytes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

public class Loader {
  public static void main(String argv[]) throws IOException {
    String inputFile = "/tmp/pagecounts-20160101-000000";

    // Connect
    Connection bigTableConnection = ConnectionFactory.createConnection();

    // Load the file, and do stuff each row
    Stream<String> stream = Files.lines(Paths.get(inputFile));
    stream.forEach(row -> {

      String[] splitRow = row.split(" ");
      assert splitRow.length == 4 : "unexpected row " + row;

      String hour = "20160101-000000"; //from file name
      String language = splitRow[0];
      String title = splitRow[1];
      String requests = splitRow[2];
      String size = splitRow[3];

      assert language.length() == 2 : "unexpected language size" + language;

      // create a row key
      // [languageCode]-[title md5]-[hour]
      String rowKey = language + "-" + DigestUtils.md5Hex(title) + "-" + hour;
      System.out.println(rowKey);

      // Put it into Bigtable - [table name]
      try {
        Table table = bigTableConnection.getTable(TableName.valueOf("wikipedia-stats"));

        // Create a new Put request.
        Put put = new Put(Bytes.toBytes(rowKey));

        // Add columns: [column family], [column], [data]
        put.addColumn(Bytes.toBytes("traffic"), Bytes.toBytes("requests"), Bytes.toBytes(requests));
        put.addColumn(Bytes.toBytes("traffic"), Bytes.toBytes("size"), Bytes.toBytes(size));

        // Execute the put on the table.
        table.put(put);
      } catch (IOException e) {
        throw new RuntimeException(e);
      }
    });

    // Clean up
    bigTableConnection.close();
  }
}
