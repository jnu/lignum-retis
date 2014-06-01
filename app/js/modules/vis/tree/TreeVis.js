/**
 * Tree vis
 *
 * Copyright 2014 Joe Nudell
 */

define(function(require) {
    var d3 = require('d3');
    var Backbone = require('backbone');

    // fast log2 function
    function log2(n) {
        for (var i = 0; n >>= 1; i++);
        return i;
    }

    // SVG path to draw a cute li'l tree leaf
    var PATH_LEAF = "" +
    "m5.50942,40.30404c1.14479,-3.74831 2.71167,-6.92277 4.19798,-8.50487" +
    "c1.59233,-1.69497 0.88586,-2.43016 -0.75676,-0.78754" +
    "c-0.69108,0.69106 -0.88852,0.18926 -0.88852,-2.25806" +
    "c0,-5.83918 3.02691,-9.45228 10.30981,-12.30641" +
    "c6.16241,-2.41505 10.70569,-5.1309 12.58942,-7.5257" +
    "l1.53503,-1.95145" +
    "l0,3.39535c0,4.19841 -1.30256,10.54117 -2.74437,13.36364" +
    "c-1.5295,2.99415 -6.77205,8.52091 -9.34466,9.85125" +
    "c-2.57261,1.33033 -7.22719,1.54277 -9.85796,0.70269" +
    "c-1.31102,-0.41859 -1.7271,-0.09875 -2.4064,1.84988" +
    "c-0.45172,1.29583 -0.82132,3.13928 -0.82132,4.09661" +
    "c0,1.08684 -0.43588,1.74057 -1.16053,1.74057" +
    "c-0.86067,0 -1.02907,-0.43046 -0.65174,-1.66597" +
    "z";

    var EVT_REQUEST_TREE = 'CANIHAZTREE';

    /**
     * Tree visualization class
     * @param {Object[]}  [nodes]  Node array
     */
    function TreeVis(nodes) {
        var vis = this;

        /**
         * @type {Object[]}
         */
        vis._data = [];

        /**
         * @type {Number}
         */
        vis._maxDepth = 0;

        /**
         * @type {Object[]}
         */
        vis._branches = [];

        /**
         * @type {Object[]}
         */
        vis._leaves = [];

        /**
         * @type {Number}
         */
        vis._width = 800;

        /**
         * @type {Number}
         */
        vis._height = 600;

        /**
         * @type {Number}
         */
        vis._angle = 0;

        /**
         * @type {Number}
         */
        vis._length = 130;

        /**
         * @type {Number}
         */
        vis._divergence = 0.5;

        /**
         * @type {Number}
         */
        vis._lengthDelta = 0.8;

        /**
         * @type {Number}
         */
        vis._randomness = 0.7;

        /**
         * @type {D3Selection}
         */
        vis._selection = null;

        /**
         * @type {Boolean}
         */
        vis._ready = false;

        // prep
        vis._bindMethods();

        // init
        vis.setData(nodes || []);
    }

    _.extend(TreeVis.prototype, Backbone.Events, {

        // -- constants ---------------------------------------------

        /**
         * Path for a tree leaf
         * @type {String}
         */
        PATH_LEAF: PATH_LEAF,

        LEAF_ID: 'leaf',

        EVT_REQUEST_TREE: EVT_REQUEST_TREE,

        // -- public methods ----------------------------------------

        /**
         * Generate the branches for the current data.
         */
        generate: function() {
            // clear generated objects
            this._branches = [];
            this._leaves = [];

            // create a seed branch (trunk)
            var seed = this._seed();

            // generate branches
            this._branch(seed);

            // generate leaves
            this._leaf();
        },

        /**
         * Render the tree into the given SVG
         * @param {SVGElement} svg
         */
        render: function(svg, force) {
            var tree = this;

            var node = svg;
            svg = tree._selection = d3.select(svg);

            if (!force || !tree._ready) {
                tree._clearSvg(svg);
                tree._setupSvg(svg);
                tree.generate();
                tree._ready = true;
            }

            tree._renderBranches(svg);
            tree._renderLeaves(svg);
        },

        /**
         * Set the data for the vis
         * @param {Object[]} nodes
         */
        setData: function(nodes) {
            this._data = nodes;
            this._maxDepth = log2(nodes.length) - 1;
            this._ready = false;
        },

        // -- private methods ---------------------------------------

        /**
         * Prep the SVG for rendering. Add symbols and such.
         * @param  {SVGElement} svg
         */
        _setupSvg: function(svg) {
            var leafId = this.LEAF_ID;
            var sym = svg.selectAll('symbol#' + leafId).data([0]);
            sym.enter().append('symbol')
                .attr('id', leafId);
            var leaf = sym.selectAll('path').data([0]);
            leaf.enter().append('path')
                .attr('d', this.PATH_LEAF);
        },

        /**
         * Clear the SVG
         * @param {SVGElement} svg
         */
        _clearSvg: function(svg) {
            var n;
            while ((n = svg.firstChild)) {
                svg.removeChild(n);
            }
        },

        /**
         * Bind methods that might be called out of context
         */
        _bindMethods: function() {
            _.bindAll(this, '_branch');
        },

        /**
         * Get the seed object for the tree
         * @return {Object} first branch
         */
        _seed: function() {
            var seed = {
                i: 0,
                d: 0,
                a: this._angle,
                l: this._length,
                w: this._maxDepth + 6,
                x: this._width >> 1,
                y: this._height,
                x2: null,
                y2: null,
                parent: null
            };

            var end = this._endPoint(seed);

            seed.x2 = end.x;
            seed.y2 = end.y;

            return seed;
        },

        /**
         * Calculate where the branch will end
         * @param  {Object}  b  Branch to get end of
         * @return {Object}     X, y coords of branch endpoint
         */
        _endPoint: function(b) {
            var x = b.x + b.l * Math.sin(b.a);
            var y = b.y - b.l * Math.cos(b.a);
            return {
                x: x,
                y: y
            };
        },

        /**
         * Change the angle at the branch. Optionally with randomness.
         * @param  {Boolean}  right  Whether branch bends right or left
         * @return {Number}          Angle
         */
        _angleDelta: function(right, random) {
            var entropy = 0;
            var r = this._randomness;
            if (random) {
                entropy = r * (Math.random() - 0.5);
            }
            var a = this._divergence + entropy;
            return right ? a : -a;
        },

        /**
         * Create a new branch from the given previous branch
         * @param  {Object}   b      Previous branch
         * @param  {Boolean}  right  Direction of branch
         * @return {Object}          New branch
         */
        _makeBranch: function(b, right) {
            var depth = b.d + 1;
            var angle = this._computeAngle(b.a, right, depth);

            var newBranch = {
                i: this._branches.length,
                x: b.x2,
                y: b.y2,
                x2: null,
                y2: null,
                a: angle,
                l: b.l * this._lengthDelta,
                w: b.w - 1,
                d: b.d + 1,
                parent: b.i
            };

            var newEnd = this._endPoint(newBranch);

            newBranch.x2 = newEnd.x;
            newBranch.y2 = newEnd.y;

            return newBranch;
        },

        /**
         * Compute an angle for a branch given an initial angle, a depth, and
         * a bit of randomness. Less deep branches should hug the closer to the
         * center
         * @param  {Number} initialAngle The angle of the previous branch
         * @param  {Number} depth        Depth of the branch
         * @param  {Number} wiggle       A little random number, computed with
         *                               TreeVis#_wiggle
         * @return {Number}              New angle
         */
        _computeAngle: function(initialAngle, right, depth) {
            var compact = Math.max(4, depth) / this._maxDepth;
            var delta = this._angleDelta(right);
            return initialAngle + delta;
        },

        /**
         * Kick off the recursive branch layout routine
         *
         * Lays out branches into the TreeVis._branches object
         *
         * @param  {Object}  b  Seed branch
         */
        _branch: function(b) {
            var tree = this;
            var angleWiggle;
            var newBranch;

            tree._branches.push(b);

            if (b.d === tree._maxDepth) {
                return;
            }

            // left branch
            newBranch = tree._makeBranch(b, false);
            tree._branch(newBranch);

            // right branch
            newBranch = tree._makeBranch(b, true);
            tree._branch(newBranch);
        },

        _leaf: function() {
            this._leaves = this._data.map(function(d) { return d; });
        },

        /**
         * Render the contents of the instance's `branches` array
         * @param  {D3Selection} svg D3-selected SVG
         */
        _renderBranches: function(svg) {
            var lines = svg.selectAll('line').data(this._branches);

            lines.enter().append('line')
                .attr('x1', _.get('x'))
                .attr('y1', _.get('y'))
                .attr('x2', _.get('x2'))
                .attr('y2', _.get('y2'))
                .style('stroke-width', _.get('w'));
        },

        /**
         * Render the contents of the instance's `leaves` array
         * @param  {D3Selection} svg D3-selected SVG
         */
        _renderLeaves: function(svg) {
            var tree = this;
            var leaves = svg.selectAll('use').data(tree._leaves);
            var lid = '#' + tree.LEAF_ID;

            leaves.enter().append('use')
                .attr('xlink:href', lid)
                .attr('x', function(d, i) { return Math.random() * 800; })
                .attr('y', function(){ return Math.random() * 600; })
                .on('click', function(d) {
                    // trigger semantic event
                    tree.trigger(EVT_REQUEST_TREE, d.id);
                });
        }

    });

    return TreeVis;
});