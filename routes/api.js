
// GET crimes.
//
// Currently this just hits the San Francisco Crime Data API in real time, 
// turns around, and passes the request off to the requester. Could be optimized
// quite a bit, starting with some local caching (either temporary via Redis or
// longer term by maintaining some kind of Persistent cache in Mongo)

var config = require('../config'),
    request = require('request'),
    moment = require('moment'),
    moment_range = require('moment-range'),
    _ = require('underscore');

if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(":")[1]); 
} else {
    var redis = require("redis").createClient(); 
}

module.exports = function(app) {
    // Accepts 2 arguments: Year (2012) and Month (01, 02, 03, ..., 12)
    app.get('/api/v1/crimes/*/*', function(req, res) {
        var year = req.params[0],
            month = req.params[1] || 01,
            start = moment(year + '-' + month, 'YYYY-MM'),
            end = moment(year + '-' + month, 'YYYY-MM').add('months', 1),
            redis_key = start + end;

        // TODO: Tuck this away in a model object with a simple accessor Crimes.get('2012', '01') or something.

        redis.get(redis_key, function(error, body) {
            if (error !== null) {
                console.log("error: " + error);
            }
            else {
                if (body === null) {
                    request("http://sanfrancisco.crimespotting.org/crime-data?&count=10000&dtstart=" + start.format("YYYY-MM-DDThh:mm:ss[Z]") + "&dtend=" + end.format("YYYY-MM-DDThh:mm:ss[Z]") + "&format=json", function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            // Drop elements we don't care about to reduce size of dataset.
                            // These are null or otherwise not useful
                            // from the SF Crimespotting dataset. We could get a bit more elegant and exclude
                            // items whose values are null, but this is good enough for now.
                            var out = [];
                            _.each(data.features, function(crime) {
                                out.push({
                                    id: crime.id,
                                    type: crime.properties.crime_type,
                                    description: crime.properties.description,
                                    case_number: crime.properties.case_number,
                                    date_time: crime.properties.date_time,
                                    latitude: crime.geometry.coordinates[0],
                                    longitude: crime.geometry.coordinates[1],
                                });
                            });
                            redis.set(redis_key, JSON.stringify(out), function(err, status) {
                                res.send(out);
                            });
                        } else {
                            res.send(error.message);
                        }
                    });
                } else {
                    res.send(body);
                }
            }
        });
    });
};


/*
// A sample entry

{"id":"44977",
"type":"Feature",
"geometry":
   {"type":"Point",
    "coordinates":
      [-122.404232,37.784496]
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
}
*/
