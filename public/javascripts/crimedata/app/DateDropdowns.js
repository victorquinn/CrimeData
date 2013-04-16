// Date Selector Dropdowns - For selecting Crime Data 

define([
    'jquery',
    'underscore',
    'moment',
    'text!templates/date_dropdown.html',
    'backbone',
    'bootstrap-dropdown'
], function($, _, moment, date_dropdown_template) {
    // Unfortunately mapbox and requirejs don't play nicely.
    // So we have to have a bit of faith that it's loaded already and
    // can't have a hard dependency on it. Some more info
    // here: http://vq.io/17CyKLH

    var DateDropdownView = Backbone.View.extend({
        id: 'date-dropdowns',
        template: _.template(date_dropdown_template),
        render: function() {
            var data = {};

            // TODO: Generate this dynamically
            data.years = {'2013': '2013', '2012': '2012', '2011': '2011', '2010': '2010', '2009': '2009'};

            data.months = {'Jan': "Jan", 'Feb': "Feb", 'Mar': "Mar", 'Apr': "Apr", 'May': "May", 'Jun': "Jun",
                           'Jul': "Jul", 'Aug': "Aug", 'Sep': "Sep", 'Oct': "Oct", 'Nov': "Nov", 'Dec': "Dec"};

            data.days = {};
            _(31).times(function(n) { data.days[n+1] = n+1; });

            $('#date-dropdowns').html(this.template(data));
        }
    });

    return DateDropdownView;
});




