/**
 * RequireJS bootstrapper
 *
 * Copyright 2014 Joe Nudell. All rights reserved.
 */

require.config({

    baseUrl: '/assets/js/modules',

    paths: {
        zepto          : '../lib/zepto',
        react          : '../lib/react',
        underscore     : '../lib/underscore',
        d3             : '../lib/d3',
        crossfilter    : '../lib/crossfilter'
    },

    shim: {

        d3: {
            exports: 'd3'
        },

        react: {
            exports: 'React'
        },

        zepto: {
            exports: 'Zepto'
        },

        underscore: {
            exports: '_'
        },

        crossfilter : {
            exports: 'crossfilter'
        }
    }

});


// start app
require([
    'zepto',
    '../app'
],
function(
    Zepto,
    app
) {

    $(function() {
        app.start();
    });

});