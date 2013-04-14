
// GET crimes.
//
// Currently this just hits the San Francisco Crime Data API in real time, 
// turns around, and passes the request off to the requester. Could be optimized
// quite a bit, starting with some local caching (either temporary via Redis or
// longer term by maintaining some kind of Persistent cache in Mongo)

var _ = require('underscore'),
    fetchCrimes = require('../api/fetchCrimes');

module.exports = function(app) {
    // Accepts 3 arguments: Year (2012) and Month (01, 02, 03, ..., 12) and Day (01, 02, ..., 31)
    app.get('/api/v1/crimes/*/*/*', function(req, res) {
        var year = req.params[0],
            month = req.params[1] || '01',
            day = req.params[2] || '01';

        fetchCrimes(year.toString(), month.toString(), day.toString(), function(crimes) {
            res.send(crimes);
        });
    });

    app.get('/api/v1/monthly/*', function(req, res) {
        var year = req.params[0];

        var monthly = [234, 288, 538, 348, 448, 624,
                       229, 519, 251, 773, 294, 111];

        // Return monthly aggregate data, format tbd. Currently sending
        // back a sample sure to be changed static format.
        res.send(monthly);
    });
};
