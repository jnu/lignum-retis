/**
 * Trees collection
 *
 * Copyright 2014 Joe Nudell
 */

define([
    'config',
    'backbone'
],
function(
    cfg,
    Backbone
) {

    var TreesCollection = Backbone.Collection.extend({

        url: cfg.API_ROOT,

        parse: function(data) {
            return data.woods;
        }

    });

    return TreesCollection;

});