/**
 * Backbone component for hijacking clicks going to a certain directory,
 * and redirecting them to the local router. (For creating a partial one-page app.)
 *
 * Copyright 2014 Joe Nudell. Freely distributable under MIT License.
 */

define(['jquery', 'backbone'], function($, Backbone) {
    return function(clientRoot) {
        if (Backbone.history && Backbone.history._hasPushState) {
            $(document).delegate("a", "click", function(evt) {
                // Get the anchor href and protcol
                var href = this.getAttribute('href');

                // check that href starts with clientRoot
                if (href.slice(0, clientRoot.length) !== clientRoot) return;
                else href = href.slice(clientRoot.length);

                evt.preventDefault();
                Backbone.history.navigate(href, true);
            });
        }
    };
});