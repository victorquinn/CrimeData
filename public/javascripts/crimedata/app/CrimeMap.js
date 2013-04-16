// CrimeMap.js - A crime map.

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _) {
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
            var markerLayer = mapbox.markers.layer().features(this.model.toJSON());

            map.addLayer(markerLayer)
                .setExtent(markerLayer.extent());
        }
    });

    return CrimeMapView;
});
