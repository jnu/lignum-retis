/**
 * Base Vis
 *
 * Copyright 2014 Joe Nudell
 */

define(function(require) {
    var d3 = require('d3');
    var Backbone = require('backbone');

    /**
     * Abstract base visualization
     * @abstract
     */
    function BaseVis() {
        var vis = this;

        /**
         * @type {Boolean}
         */
        vis._ready = false;

        /**
         * Data array
         * @type {Object[]}
         */
        vis._data = null;

        /**
         * @type {Number}
         */
        vis._width = 800;

        /**
         * @type {Number}
         */
        vis._height = 600;

        /**
         * @type {Object}
         */
        vis._margin = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };

        /**
         * @type {D3Selection}
         */
        vis._selection = null;
    }

    _.extend(BaseVis.prototype, Backbone.Events, {

        /**
         * Compute info needed for the vis
         * @name BaseVis#compute
         */
        compute: _.noop,

        /**
         * Draw the tree into the given SVG
         * @name BaseVis#draw
         * @param {SVGElement} svg
         */
        draw: _.noop,

        /**
         * Set up the SVG
         * @name BaseVis#setup
         * @param {SVGElement} svg
         */
        setup: _.noop,

        /**
         * Get or set width
         */
        width: _.prop('_width'),

        /**
         * Get or set height
         */
        height: _.prop('_height'),

        /**
         * Clear the SVG
         * @name BaseVis#clear
         * @param {SVGElement} svg
         */
        clear: function(svg) {
            var n;
            while ((n = svg.firstChild)) {
                svg.removeChild(n);
            }
        },

        /**
         * Render the visualization. Performs the necessary computations and
         * sets up the SVG as needed (but not more than needed).
         * @name BaseVis#render
         * @param  {SVGElement} svg     Target SVG
         * @param  {Boolean}    [force] Whether to force rerender
         */
        render: function(svg, force) {
            var vis = this;
            var redo = false;

            svg = d3.select(svg)
                .attr('width', vis._width + vis._margin.left + vis._margin.right)
                .attr('height', vis._height + vis._margin.top + vis._margin.bottom);

            var ctx = vis._selection = svg.append('g')
                .attr(
                    'transform',
                    'translate(' + vis._margin.left + ',' + vis._margin.top + ')'
                );

            if (!force || !vis._ready) {
                vis.clear(svg);
                vis.setup(svg);
                vis._ready = true;
                vis.compute();
            }

            vis.draw(ctx);
        },

        /**
         * Set the data in the vis
         * @name BaseVis#setData
         * @param {Object[]} data
         */
        setData: function(data) {
            this._data = data;
            this._ready = false;
        }

    });


    return BaseVis;
});