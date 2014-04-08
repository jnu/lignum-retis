/**
 * RequireJS bootstrapper
 *
 * Copyright 2014 Joe Nudell. All rights reserved.
 */

require.config({

    baseUrl: '/js/modules',

    paths: {
        text        : '../lib/require-text',
        zepto       : '../lib/zepto',
        underscore  : '../lib/underscore',
        d3          : '../lib/d3',
        crossfilter : '../lib/crossfilter'
    },

    shim: {
        d3: {
            exports: 'd3'
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