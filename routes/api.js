
// GET crimes.
//
// Currently this just hits the San Francisco Crime Data API in real time, 
// turns around, and passes the request off to the requester. Could be optimized
// quite a bit, starting with some local caching (either temporary via Redis or
// longer term by maintaining some kind of Persistent cache in Mongo)

var _ = require('underscore'),
    fetchCrimes = require('../api/fetchCrimes');

module.exports = function(app) {
    // Accepts 2 arguments: Year (2012) and Month (01, 02, 03, ..., 12)
    app.get('/api/v1/crimes/*/*', function(req, res) {
        var year = req.params[0],
            month = req.params[1] || 01;

        fetchCrimes(year.toString(), month.toString(), function(crimes) {
            res.send(crimes);
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
