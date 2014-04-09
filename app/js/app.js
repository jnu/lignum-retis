/**
 * Main app entry point
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define([
    'react',
    'Main/MainView'
],
function(React, MainView) {

    var App = {
        start: function() {
            console.log("App started");
            React.renderComponent(
                <MainView />,
                document.getElementById('container')
            );
        }
    };

    return App;
});