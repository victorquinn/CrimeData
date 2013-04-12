
// GET crimes.
//
// Currently this just hits the San Francisco Crime Data API in real time, 
// turns around, and passes the request off to the requester. Could be optimized
// quite a bit, starting with some local caching (either temporary via Redis or
// longer term by maintaining some kind of Persistent cache in Mongo)

var config = require('../config'),
    request = require('request'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    _ = require('underscore');

module.exports = function(app) {
  app.get('/crimes/*', function(req, res) {
      var year = req.params[0],
          start = moment(year + '-01-01'),
          end = moment(year + '-01-02');

      request("http://sanfrancisco.crimespotting.org/crime-data?&count=10000&dtstart=" + start.format() + "&dtend=" + end.format() + "&format=json", function(error, response, body) {
          if (!error && response.statusCode == 200) {
              var data = JSON.parse(body);
              res.send(body);
          }
          else {
              res.send(error.message);
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
