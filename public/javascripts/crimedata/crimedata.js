// CrimeData.js - Main client-side application file.

require.config({
    paths: {
        // Libraries
        'jquery': 'lib/jquery-1.9.1.min',
        'backbone': 'lib/backbone-min',
        'underscore': 'lib/underscore-min',
        'bootstrap-dropdown': 'lib/bootstrap-dropdown',
        'bootstrap-datepicker': 'lib/bootstrap-datepicker',
        'd3': 'lib/d3.v3.min',
        'circularheatchart': 'lib/circularHeatChart',
        'domready': 'lib/domReady',
        'moment': 'lib/moment.min',
        'spin': 'lib/spin.min',
        'text': 'lib/text',

        // Custom modules
        'CrimeMap': 'app/CrimeMap',
        'CrimeWheel': 'app/CrimeWheel',
        'CrimeDate': 'app/CrimeDate',
        'CrimeList': 'app/CrimeList',
        'CrimesHourly': 'app/CrimesHourly',
        'DateDropdowns': 'app/DateDropdowns'
    },
    shim: {
        'bootstrap-dropdown': 'jquery',
        'bootstrap-datepicker': 'jquery',
        d3: {
            exports: 'd3'
        },
        'circularheatchart': 'd3'
    }
});

require([
    'jquery',
    'underscore',
    'd3',
    'moment',
    'spin',
    'CrimeMap',
    'CrimeWheel',
    'CrimeList',
    'CrimesHourly',
    'CrimeDate',
    'text!templates/crime-pre.html',
    'domready',
    'backbone'
], function($, _, d3, moment, Spinner, CrimeMap, CrimeWheel, CrimeList, CrimesHourly, CrimeDate, crime_pre_template, domReady) {

    // Create a simple model and collection for the crimes themselves
    var Crime = Backbone.Model.extend({});
    var CrimesCollection = Backbone.Collection.extend({
        model: Crime
    });

    // Instantiate said Collection
    var crimesCollection = new CrimesCollection();

    // We are assigning these color codes client-side. Went back and forth on this.
    // On one hand, it's a data issue so probably shoud be done server-side, but on the
    // other there'd be a lot of redundancy so that would result in more data being sent
    // over the wire, a lot of it duplicated. So I'm leaving this client-side for now.

    // We should run performance metrics and see what the outcome is of doing it on the
    // other side.

    var crime_types = {
        person: ['SIMPLE ASSAULT', 'ROBBERY', 'AGGRAVATED ASSAULT', 'MURDER', 'PROSTITUTION'],
        property: ['VANDALISM', 'VEHICLE THEFT', 'BURGLARY', 'THEFT', 'DISTURBING THE PEACE', 'ARSON'],
        substance: ['ALCOHOL', 'NARCOTICS']
    };

    // Helper function which, given a date, will fetch the crimes. TODO: This should all
    // be encapsulated under the CrimesCollection, the CrimesCollection split out to its
    // own module file, and this event handler dealt with there.

    var fetchCrimes = function(date) {
        crimesCollection.url = '/api/v1/crimes/' + date;
        crimesCollection.fetch({
            success: function(crimes) {
                var typesum = {person: 0, property: 0, substance: 0};
                _.each(crimes.toJSON(), function(crime, index, crimes) {
                    if (_.contains(crime_types.person, crimes[index].properties.crime_type)) {
                        crime.properties['marker-color'] = '#CC333F';
                        typesum.person++;
                    } else if (_.contains(crime_types.property, crimes[index].properties.crime_type)) {
                        crime.properties['marker-color'] = '#EDC951';
                        typesum.property++;
                    } else if (_.contains(crime_types.substance, crimes[index].properties.crime_type)) {
                        crime.properties['marker-color'] = '#00A0B0';
                        typesum.substance++;
                    }
                    crime.properties.time = moment(crime.properties.date_time).format("dddd, MMMM Do YYYY, h:mm:ss a");
                });

                $('#num-person').html(typesum.person);
                $('#num-property').html(typesum.property);
                $('#num-substance').html(typesum.substance);
                $('#num-crimes').html(crimes.length);

                var crimeMap = new CrimeMap({collection: crimes});
                crimeMap.render();

                var crimeWheel = new CrimeWheel({collection: crimes});
                crimeWheel.render();

                var crimeList = new CrimeList({collection: crimes});
                crimeList.render();

                var crimesHourly = new CrimesHourly({collection: crimes});
                crimesHourly.render();
            }
        });
    };

    domReady(function() {
        $("#trends-btn").bind('click', function() {
            alert("Apologies, this feature is not yet implemented.");
        });

        $(".filter-btn").bind('click', function() {
            alert("Apologies, filters are not yet implemented.");
        });

        var crimeDate = new CrimeDate();
        crimeDate.render();
        fetchCrimes(crimeDate.getDate());

        // TODO: Refactor these as Backbone events
        $("#crime-date").bind('keyup', function() {
            fetchCrimes(crimeDate.getDate());
        });
    });
});
