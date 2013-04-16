//
// API middleware to return a set of crimes given a year and month.
//

var config = require('../config'),
    request = require('request'),
    moment = require('moment'),
    _ = require('underscore');

// TODO: Tuck this under /config.js

// Configure redis. When run locally, uses local credentials, when run on
// heroku or anywhere else with this environment variable set, will configure
// for that environment.
if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(":")[1]); 
} else {
    var redis = require("redis").createClient(); 
}

// Currently, this only takes year, month. Future enhancement for more granularity
// Would love to have this pull by day, and then a helper function to request crimes
// by month which actually does the request per day.
module.exports = function(year, month, day, next) {
    var start, end;

    if (day === null) {
        if (month === null) {
            // Retrieve a year's worth of data. CAUTION. This should be done by multiple API
            // calls, not one monster one as it is now.
            start = moment(year, 'YYYY');
            end = moment(year, 'YYYY').add('years', 1);
        }
        else {
            start = moment(year + '-' + month, 'YYYY-MM');
            end = moment(year + '-' + month, 'YYYY-MM').add('months', 1);
        }
    } else {
        start = moment(year + '-' + month + '-' + day, 'YYYY-MM-DD');
        end = moment(year + '-' + month + '-' + day, 'YYYY-MM-DD').add('days', 1);
    }

    var redis_key = year + month + day;

//    redis.del(redis_key); // Temporary, uncomment to bust cache
    redis.get(redis_key, function(error, body) {
        if (error !== null) {
            console.log("error: " + error);
        }
        else {
            // If body is null, there was a cache miss, so let's hit the live API
            if (body === null) {
                request("http://sanfrancisco.crimespotting.org/crime-data?&count=10000&dtstart=" + start.format("YYYY-MM-DDThh:mm:ss[Z]") + "&dtend=" + end.format("YYYY-MM-DDThh:mm:ss[Z]") + "&format=json", function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var data = JSON.parse(body);

                        redis.set(redis_key, JSON.stringify(data.features), function(err, status) {
                            // Send the output back to the requester for handling
                            next(data.features);
                        });
                    } else {
                        return error.message;
                    }
                });
            } else {
                // Since body wasn't null, this was a cache hit.
                // Send the output back to the requester for handling
                next(JSON.parse(body));
            }
        }
    });
};


// A sample entry from the source before we filter it:

var sampleCrimeUnfiltered = { "id":"44977",
                              "type":"Feature",
                              "geometry":
                              {
                                  "type":"Point",
                                  "coordinates": [-122.404232,37.784496]
                              },
                              "properties":{
                                  "crime_type":"SIMPLE ASSAULT",
                                  "date_time":"2012-01-06 21:00:00",
                                  "description":"BATTERY",
                                  "case_number":"120023974",
                                  "address":null,
                                  "zip_code":null,
                                  "beat":null,
                                  "accuracy":"9"
                              }
                            };

// A sample entry after we've filtered it:

var sampleCrimeFiltered = { "id": "44977",
                            "type": "SIMPLE ASSAULT",
                            "description": "BATTERY",
                            "case_number": "120023974",
                            "date_time": "2012-05-01 05:00:00",
                            "latitude": -122.403743,
                            "longitude": 37.775232
                          };

// By removing redundant data we are not only paring down our dataset for
// optimal transfer over the line, but also making it cleaner and easier
// to use. No need to send along keys whose values are always null.


// We can go a step further though. With the above example, a month's data
// clocks out at ~1.24MB. Still pretty large. Since a lot of these keys are
// repeated, we can get a significant reduction in size just by shortening
// some of those keys:

var sampleCrimeFilteredSm = { "id": "44977",
                              "t": "SIMPLE ASSAULT",
                              "d": "BATTERY",
                              "cn": "120023974",
                              "dt": "2012-05-01 05:00:00",
                              "lt": -122.403743,
                              "lg": 37.775232
                            };

// This dropped the dataset down to ~1.02MB. Not a ton, but non-trivial.
// However, adding GZip compression to requests dropped it down to only 118KB
// so the previous gain is all but trivial. For now I restored the longer key
// names since the GZip did so much, it could be left as a future enhancement
// to go back to shortening them to remove redundancy though GZip mostly handles
// that for us so it would not be super helpful and would be pretty confusing.
