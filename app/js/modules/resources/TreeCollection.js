/**
 * Trees collection
 *
 * Copyright 2014 Joe Nudell
 */

define(function(require) {
    var cfg = require('config');
    var Backbone = require('backbone');

    var TreesCollection = Backbone.Collection.extend({

        url: cfg.API_ROOT,

        parse: function(data) {
            return data.woods;
        }

    });

    return TreesCollection;

});