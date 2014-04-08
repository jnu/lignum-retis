/**
 * Main app entry point
 *
 * Copyright 2014 Joe Nudell
 */

define([
    'Main/MainView'
],
function(MainView) {

    var App = {
        start: function() {
            var main = new MainView();
            console.log("App started")
            main.render();
        }
    };

    return App;
});