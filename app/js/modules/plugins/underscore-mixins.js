/**
 * Underscore mixins
 *
 * Copyright 2014 Joe Nudell
 */

define([
    'underscore'
],
function(
    _
) {
    _.mixin({

        /**
         * Create an object property accessor
         * @param  {String}  prop  Property to access
         * @return {Function}      Accessor
         */
        get: function(prop) {
            return function(d) {
                return d && d[prop];
            };
        }

    });
});