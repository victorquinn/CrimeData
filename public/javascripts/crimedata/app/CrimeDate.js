// CrimeDate.js - Bind to the Date control

define([
    'jquery',
    'underscore',
    'moment',
    'backbone'
], function($, _, moment) {

    var CrimeDateView = Backbone.View.extend({
        el: '#crime-date',
        getDate: function() {
            return moment(this.$el.val()).format('YYYY/MM/DD');
        },
        render: function() {
            // Default to 1 year ago just because it has crimes. Ideally we'd default
            // to today, but the live database hasn't been updated in a bit.

            var date = moment().subtract('year', 1).format('YYYY/MM/DD');
            this.$el.val(date);
            return this;
        }
    });

    return CrimeDateView;
});
