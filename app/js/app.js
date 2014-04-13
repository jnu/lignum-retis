/**
 * Main app entry point
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define([
    'react',
    'MainView',
],
function(
    React,
    MainView
) {

    var App = {

        start: function() {
            var app = this;

            React.renderComponent(
                <MainView />,
                document.getElementById('container')
            );
        }

    };

    return App;
});