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

    mapbox.auto('map-widget', 'victorquinn.map-1jo85ie8');
});
