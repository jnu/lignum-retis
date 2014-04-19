/**
 * RequireJS bootstrapper
 *
 * Copyright 2014 Joe Nudell. All rights reserved.
 */

require.config({

    baseUrl: '/assets/js/modules',

    paths: {
        config         : '../config',
        app            : '../app',
        d3             : '../lib/d3',
        react          : '../lib/react',
        jquery         : '../lib/jquery',
        underscore     : '../lib/underscore',
        backbone       : '../lib/backbone',
        crossfilter    : '../lib/crossfilter'
    },

    shim: {

        d3: {
            exports: 'd3'
        },

        react: {
            exports: 'React'
        },

        jquery: {
            exports: 'jquery'
        },

        underscore: {
            exports: '_'
        },

        backbone: {
            exports: 'Backbone'
        },

        crossfilter : {
            exports: 'crossfilter'
        }
    }

});


// start app
require([
    'jquery',
    'underscore',
    'plugins/jquery-extra',
    'app'
],
function(
    $,
    _,
    $xtra,
    app
) {

    $(function() {
        app.start();
    });

});