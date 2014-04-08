/**
 * Main view
 *
 * Copyright 2014 Joe Nudell
 */

define([
    'zepto'
],
function($) {

    var MainView = function() {};

    MainView.prototype = {
        render: function() {
            this.fetch($('#data'));
        },

        fetch: function($el) {
            $.get('/api', function(obj) {
                var keys = Object.keys(obj.woods[0]);

                var h = "<table>";
                h += "<thead>";
                h += "<tr>";
                h += keys.map(function(key) {
                    return "<th>" + key + "</th>";
                });
                h += "</tr>";
                h += "</thead>";
                h += "<tbody>";

                obj.woods.forEach(function(wood) {
                    h += "<tr>";
                    h += keys.map(function(key) {
                        return "<td>" + wood[key] + "</td>";
                    });
                    h += "</tr>";
                });

                h += "</body>";
                h += "</table>";

                $el.html(h);
            });
        }
    }

    return MainView;
});