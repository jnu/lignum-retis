/**
 * RequireJS bootstrapper
 *
 * Copyright 2014 Joe Nudell. All rights reserved.
 */

require.config({

    baseUrl: '/js/modules',

    paths: {
        JSXTransformer : '../lib/JSXTransformer',
        jsx            : '../lib/require-jsx',
        text           : '../lib/require-text',
        zepto          : '../lib/zepto',
        react          : '../lib/react',
        underscore     : '../lib/underscore',
        d3             : '../lib/d3',
        crossfilter    : '../lib/crossfilter'
    },

    shim: {
        JSXTransformer: {
            exports: 'JSXTransformer'
        },

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
    'jsx!../app'
],
function(
    Zepto,
    app
) {

    $(function() {
        app.start();
    });

});