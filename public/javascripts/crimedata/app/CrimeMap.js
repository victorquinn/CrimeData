// CrimeMap.js - A crime map.

define([
    'jquery',
    'underscore',
    'text!templates/map_tooltip.html',
    'backbone'
], function($, _, map_tooltip_template) {
    // Unfortunately mapbox and requirejs don't play nicely.
    // So we have to have a bit of faith that it's loaded already and
    // can't have a hard dependency on it. Some more info
    // here: http://vq.io/17CyKLH

    var CrimeMapView = Backbone.View.extend({
        id: 'widget-map',
        render: function() {
            // Create map
            var map = mapbox.map('widget-map');
            map.addLayer(mapbox.layer().id('victorquinn.map-1jo85ie8'));

            // Create and add marker layer
            var markerLayer = mapbox.markers.layer().features(this.collection.toJSON());
            var interaction = mapbox.markers.interaction(markerLayer);

            // Set a custom formatter for tooltips
            // Provide a function that returns html to be used in tooltip
            // We're using an underscore template for the tooltip body
            interaction.formatter(function(feature) {
                var hover = _.template(map_tooltip_template);
                return hover(feature);
            });

            // Zoom the map in automatically based on the data
            map.addLayer(markerLayer)
                .setExtent(markerLayer.extent());

            // Add the zoom controls so the user can zoom in and out
            map.ui.zoomer.add();
        }
    });

    return CrimeMapView;
});
