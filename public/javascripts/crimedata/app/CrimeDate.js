// CrimeDate.js - Bind to the Date control

define([
    'jquery',
    'underscore',
    'moment',
    'backbone'
], function($, _, moment) {

    var CrimeDateView = Backbone.View.extend({
        getDate: function() {
            return $('#crime-date').val();
        },
        render: function() {

            var date = moment().subtract('year', 1).format('YYYY/MM/DD');
            $('#crime-date').val(date);

            return this;
        }
    });

    return CrimeDateView;
});
