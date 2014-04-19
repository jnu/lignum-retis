/**
 * Router
 *
 * Copyright 2014 Joe Nudell. All rights reserved.
 */

define(['backbone'],
function(
    Backbone
) {

    var Router = Backbone.Router.extend({

        _app: null,

        initialize: function(app) {
            this._app = app;
        },

        routes: {
            'tree'     : 'showIndex',
            'tree/:id' : 'showInfo'
        },

        _navigate: function(pageId) {
            $('#' + pageId).scrollTo();
        },

        // route handlers
        showIndex: function() {
            this._navigate('index');
        },

        showInfo: function(id) {
            this._app.showTree(id);
            this._navigate('info');
        }

    });

    return Router;
});