// CrimeData.js - Main client-side application file.

require.config({
    paths: {
        // Libraries
        'jquery': 'lib/jquery-1.9.1.min',
        'backbone': 'lib/backbone-min',
        'underscore': 'lib/underscore-min',
        'd3': 'lib/d3.v3.min',
        'moment': 'lib/moment.min',
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
    'moment',
    'spin',
    'CrimeMap',
    'text!templates/crime-pre.html',
    'backbone'
], function($, _, d3, moment, Spinner, CrimeMap, crime_pre_template) {

    var Crime = Backbone.Model.extend({});

    var CrimesCollection = Backbone.Collection.extend({
        model: Crime
    });

    var crimesCollection = new CrimesCollection();

    // A random day with some crimes. Make interactive later.
    crimesCollection.url = '/api/v1/crimes/2012/04/01';

    $('#crime-date').html(moment('2012/04/01').format('MMM D, YYYY'));

    crimesCollection.fetch({
        success: function(crimes) {
            var crimeMap = new CrimeMap({model: crimes});
            crimeMap.render();
        }
    });
});
