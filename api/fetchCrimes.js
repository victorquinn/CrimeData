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

    var redis_key = start.format() + end.format();

    // TODO: This should be tucked away under a model object -- the different caching
    // layers should not opaque to the consumer

//    redis.del(redis_key); // Temporary, uncomment to bust cache
    redis.get(redis_key, function(error, body) {
        if (error !== null) {
            console.log("error: " + error);
        }
        else {
            // If body is null, there was a cache miss, so let's hit the live API

            // This should really next store an entry in our local MongoDB
            // so we have it (1) if the remote datasource is down or unreachable
            // (2) for richer queries against the data than just date (3) for mapreduce
            // queries for aggregate data

            // The model is actually already created and in /models/Crimes.js but was
            // cut for time purposes.

            if (body === null) {
                request("http://sanfrancisco.crimespotting.org/crime-data?&count=10000&dtstart=" + start.format("YYYY-MM-DDThh:mm:ss[Z]") + "&dtend=" + end.format("YYYY-MM-DDThh:mm:ss[Z]") + "&format=json", function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var data = JSON.parse(body);

                        // As mentioned above, we should store this in our MongoDB first, then
                        // set it in our redis cache and return it.

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
