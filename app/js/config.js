/**
 * App-wide configuration
 *
 * Copyright 2014 Joe Nudell. All rights reserved.
 */

define({

    API_ROOT: '/api/wood/',

    SHOW_TREE_ROOT: '/tree/',

    // helpers
    woodUrl: function(id) {
        return this.SHOW_TREE_ROOT + (id || '');
    }

});