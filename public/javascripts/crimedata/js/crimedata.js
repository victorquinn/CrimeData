
require.config({
    paths: {
        'jquery': 'lib/jquery-1.9.1.min',
        'backbone': 'lib/backbone-min',
        'underscore': 'lib/underscore-min',
        'd3': 'lib/d3.v3.min',
        'text': 'lib/text'
    }
});

var debug;

require(['jquery', 'underscore', 'backbone', 'd3', 'text!templates/crimes-pre'],
function($, _) {
    $('.mainwidget').append("Crimes are being fetched...");

    var Crime = Backbone.Model.extend({
    });

    var Crimes = Backbone.Collection.extend({
        model: Crime,
        urlRoot: '/api/v1/crimes'
    });

    var crimes = new Crimes({
        url: '/2012/04/01'
    });
    debug = crimes;
    crimes.fetch();

    var out = "";

    _.each(crimes, function(crime) {
        
    });
    console.log(crimes);
});
