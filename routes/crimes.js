
/*
 * GET crimes.
 *
 * Currently this just hits the API in real time, turns around, and passes the
 * request off to the requester. Could be optimized quite a bit, starting with
 * some local caching (either temporary via Redis or longer term by maintaining
 * some kind of Persistent cache in Mongo)
 */

var request = require('request');

module.exports = function(app) {
  app.get('/crimes', function(req, res) {
      request("http://sanfrancisco.crimespotting.org/crime-data?count=10000&dtstart=2012-01-01T00%3A00%3A00-07%3A00&dtend=2012-01-02T00%3A00%3A00-07%3A00&format=json", function(error, response, body) {
          if (!error && response.statusCode == 200) {
              res.write(body);
          }
      });
  });
};
