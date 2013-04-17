// CrimeList.js - A simple list of crimes.

define([
    'jquery',
    'underscore',
    'text!templates/crime-pre.html',
    'backbone'
], function($, _, crimepre_template) {

    // TODO: This is currently an ugly ugly list. Fix to be nicer...

    var CrimeListView = Backbone.View.extend({
        el: '#crime-list',
        template: _.template(crimepre_template),
        render: function() {
            console.log({crimes: this.collection.toJSON()});
            this.$el.html(this.template({crimes: this.collection.toJSON()}));
        }
    });

    return CrimeListView;
});
