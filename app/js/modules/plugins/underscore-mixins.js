/**
 * Underscore mixins
 *
 * Copyright 2014 Joe Nudell
 */

define(function(require) {
    var _ = require('underscore');

    _.mixin({

        /**
         * Create an object property accessor
         * @param  {String}  prop  Property to access
         * @return {Function}      Accessor
         */
        get: function get(prop) {
            return function(d) {
                return d && d[prop];
            };
        },

        /**
         * Factory for prototype property getter / setter
         * @param  {String}   p  Property name to access
         * @return {Function}    Combo d3-style getter and setter
         */
        prop: function prop(p) {
            return function setProp(x) {
                if (x === undefined) return this[p];
                this[p] = x;
                this._ready = false;
                return this;
            };
        },

        noop: function noop() {
            /* so very empty */
        }

    });

});