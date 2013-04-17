// CrimesHourly.js - Graph of crimes by hour
var debug;
define([
    'jquery',
    'underscore',
    'd3',
    'backbone'
], function($, _, d3, Backbone) {

    var CrimesHourlyView = Backbone.View.extend({
        el: '#crimes-hourly',
        render: function() {
            var view = this;

            this.$el.empty();

            // TODO: Make this dynamic based on container size.
            var margin = {top: 10, right: 10, bottom: 20, left: 20},
                width = 300,
                height = 200;

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var svg = d3.select('#crimes-hourly').append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var hours = [];
            _(24).times(function(n) { hours[n] = {hour: n, frequency: 0}; });

            this.collection.each(function(crime) {
                hours[moment(crime.get('properties').date_time).hour()].frequency += 1;
            });

            x.domain(hours.map(function(d) { return d.hour; }));
            y.domain([0, d3.max(hours, function(h) { return h.frequency; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Crimes Committed by Hour");

            svg.selectAll(".bar")
                .data(hours)
              .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.hour); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.frequency); })
                .attr("height", function(d) { return height - y(d.frequency); });

            return this;
        }
    });

    return CrimesHourlyView;
});
