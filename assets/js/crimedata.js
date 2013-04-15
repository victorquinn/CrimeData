
require.config({
    paths: {
        'jquery': 'jquery-1.9.1.min',
        'backbone': 'backbone-min',
        'underscore': 'underscore-min',
        'd3': 'd3.v3.min'
    }
});

require(['jquery', 'underscore', 'backbone', 'd3'],
function($, _) {
    $('.mainwidget').append("Widget goes here..");
});
