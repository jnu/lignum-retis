/**
 * App-wide configuration
 *
 * Copyright 2014 Joe Nudell. All rights reserved.
 */

define({

    API_ROOT: '/api/wood/',

    // helpers
    woodUrl: function(id) {
        return this.API_ROOT + (id || '');
    }

});