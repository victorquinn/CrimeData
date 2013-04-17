// CrimesWheel.js - Wheel visualization of crimes

define([
    'jquery',
    'underscore',
    'd3',
    'backbone',
    'circularheatchart'
], function($, _, d3, Backbone) {

    var CrimesWheelView = Backbone.View.extend({
        el: '#crime-wheel',
        render: function() {
            var view = this;

            this.$el.empty();

            var hours = [];
            _(24).times(function(n) { hours[n] = {hour: n, frequency: 0}; });

            this.collection.each(function(crime) {
                hours[moment(crime.get('properties').date_time).hour()].frequency += 1;
            });

            // TODO: Fix this so it works!

            /*
            var chart = circularHeatChart()
                .segmentHeight(5)
                .innerRadius(20)
                .numSegments(12)
                .domain([50, 200])
                .range(['white', 'red'])
                .segmentLabels(_.range(24))
                .radialLabels(years);

            d3.select('#chart')
                .selectAll('svg')
                .data([hours])
                .enter()
                .append('svg')
                .call(chart);
            */

            this.$el.html("<img src='images/wheel.png' />");

            return this;
        }
    });

    return CrimesWheelView;
});
