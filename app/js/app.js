/**
 * Main app entry point
 *
 * Copyright 2014 Joe Nudell
 */

define(function(require) {

    var HijackLinks = require('plugins/backbone-hijack-links');
    var Presenter = require('Presenter');
    var Router = require('router/router');

    var App = {

        _$window: $(window),

        _presenter: new Presenter(),

        _router: null,

        _resizeHeightHandler: 'resize.pageHeightMgr',

        start: function() {
            this._resizePages();
            this._watchHeight();
            this._presenter.init();
            this._startRouter();
        },

        stop: function() {
            this._$window.off(this._resizeHeightHandler);
        },

        showTree: function(id) {
            this._presenter.showTree(id);
        },

        _startRouter: function() {
            this._router = new Router(this);
            Backbone.history.start({ pushState: true, root: '/' });
            HijackLinks('/');
        },

        _watchHeight: function() {
            this._$window.on(this._resizeHeightHandler, this._resizePages);
        },

        _resizePages: function() {
            // get current viewport height
            var height = Math.max(
                document.documentElement.clientHeight,
                window.innerHeight || 0
            );

            height += 'px';

            // update all page sections with new height
            var pages = document.getElementsByClassName('page');
            Array.prototype.forEach.call(pages, function(el) {
                el.style.minHeight = height;
            });
        }

    };

    return App;
});