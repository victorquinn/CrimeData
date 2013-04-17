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
            return this.$el.val();
        },
        render: function() {
            var date = moment().subtract('year', 1).format('YYYY/MM/DD');
            this.$el.val(date);
            return this;
        }
    });

    return CrimeDateView;
});
