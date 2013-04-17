// CrimesHourly.js - Graph of crimes by hour
var debug;
define([
    'jquery',
    'underscore',
    'd3',
    'backbone'
], function($, _, d3) {

    var CrimesHourlyView = Backbone.View.extend({
        el: '#crimes-hourly',
        render: function() {
            // TODO: Make this dynamic based on container size.
            var width = 300,
                height = 231;

            debug = this.$el;
            console.log(this.$el);
            this.$el.html("NTHNTHNTHNTH");
//            $('#crimes-hourly').html("NNNNNNNNNNN");
            return "NTHNTHNTHNTH";
        }
    });

    return CrimesHourlyView;
});
