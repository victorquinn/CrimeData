
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
    _ = require('underscore'),
    Crime = require('../models/crime.js');
console.log(Crime);

module.exports = function(app) {
  app.get('/import-crimes/*', function(req, res) {
      var year = req.params[0],
          start = moment(year + '-01-01'),
          end = moment(year + '-01-02'),
          totalRecords = 0;

      // First check to ensure this year hasn't already been imported. If so,
      // return the appropriate message and don't re-import.

      // Next, iterate over this year, day by day, and suck in all crimes
      // for that day.
      _(1).times(function(n) {
          request("http://sanfrancisco.crimespotting.org/crime-data?count=10000&dtstart=" + start.format() + "&dtend=" + end.format() + "&format=json", function(error, response, body) {
              if (!error && response.statusCode == 200) {
                  var data = JSON.parse(body);
                  _.each(data.features, function(c) {
                      var db = mongoose.createConnection();

                      Crime.create({
                          id: c.id,
                          type: c.properties.crime_type,
                          time: c.properties.date_time,
                          description: c.properties.description,
                          case_number: c.properties.case_number,
                          address: c.properties.address,
                          zip_code: c.properties.zip_code,
                          beat: c.properties.beat,
                          accuracy: c.properties.accuracy,
                          latitude: c.geometry.coordinates[0],
                          longitude: c.geometry.coordinates[1]
                      });
                  });
                  
                  totalRecords += data.features.length;
              }
              else {
                  res.write(error.message);
              }
          });

          start.add('days', 1);
          end.add('days', 1);
      });
      console.log(totalRecords);
/*
      while (end.year() < (year + 1)) {
          start.add('days', 1);
          end.add('days', 1);
//          console.log("http://sanfrancisco.crimespotting.org/crime-data?&dtstart=" + start.format() + "&dtend=" + end.format() + "&format=json");
          request("http://sanfrancisco.crimespotting.org/crime-data?&dtstart=" + start.format() + "&dtend=" + end.format() + "&format=json", function(error, response, body) {
              if (!error && response.statusCode == 200) {
                  var data = JSON.parse(body);
                  console.log(data.features.length);
                  totalRecords += data.features.length;
              }
              else {
                  res.write(error.message);
              }
          });
      }
*/
      console.log(req.params);

      request("http://sanfrancisco.crimespotting.org/crime-data?&dtstart=" + start.format() + "&dtend=" + end.format() + "&format=json", function(error, response, body) {
          if (!error && response.statusCode == 200) {
              var data = JSON.parse(body);
//              console.log(data.features);
              res.write(body);
          }
          else {
              res.write(error.message);
          }
      });
  });
};


/*

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
