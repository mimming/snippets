# When Twitch Code Tracker

Figure out when is a good time to livecode on Twitch.

Pull the [communities](https://dev.twitch.tv/docs/v5/reference/communities) list on the Twitch API, and peek at `programming`.  Record the data into a place that's easy to work with.   Make pretty graphs, and learn about when livecoding is popular on twitch.

Once I record enough data, I'll write it up on my [tech blog](https://little418.com).

## Data flow

    +----------------+            +---------------------+        +---------------------+
    |                |            | Google              |        |                     |
    | Twitch API     +----------->+ Cloud Function      +------->+ Google Sheet        |
    |                |            |                     |        |                     |
    +----------------+            +---------------------+        +---------+-----------+
                                                                           |
            - Channels                                                     |
            - Viewers                                                      v
                                                                 +---------+-----------+
                                                                 | Pretty chart        |
                                                                 |                     |
                                                                 +---------------------+

  
Diagram made on [asciiflow](http://asciiflow.com/).

## Todo
- Push data into a Google Sheet
- Cron like thing - https://github.com/firebase/functions-cron
- Clean up the mess

## done
* Recap what we did before - it is maddness
* move what we got to source control
* Model the lazy way - a shell one liner - feed into plain text
  * Why this isn't awesome
* Port it over to JavaScript
* Push it up to Google Cloud Functions


## License

APL 2.0

