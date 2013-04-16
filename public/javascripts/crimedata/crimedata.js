// CrimeData.js - Main client-side application file.

require.config({
    paths: {
        // Libraries
        'jquery': 'lib/jquery-1.9.1.min',
        'backbone': 'lib/backbone-min',
        'underscore': 'lib/underscore-min',
        'd3': 'lib/d3.v3.min',
        'spin': 'lib/spin.min',
        'text': 'lib/text',

        // Custom modules
        'CrimeMap': 'app/CrimeMap'
    }
});

require([
    'jquery',
    'underscore',
    'd3',
    'spin',
    'CrimeMap',
    'text!templates/crime-pre.html',
    'backbone'
], function($, _, d3, Spinner, CrimeMap, crime_pre_template) {

    $('.mainwidget').append("<div id='waiting-spinner'></div>");

    var target = document.getElementById('#waiting-spinner');
    var spinner = new Spinner({ lines: 10, length: 8, width: 4, radius: 8 }).spin(target);

    var Crime = Backbone.Model.extend({});

    var CrimesCollection = Backbone.Collection.extend({
        model: Crime
    });

    var crimes = new CrimesCollection();

    // A random day with some crimes. Make interactive later.
    crimes.url = '/api/v1/crimes/2012/04/01';

    crimes.fetch({
        success: function(response) {
            response.each(function(crime) {
                $('.mainwidget').append(_.template(crime_pre_template, crime.toJSON()));
            });
        }
    });
});
