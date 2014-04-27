/**
 * Tree vis
 *
 * Copyright 2014 Joe Nudell
 */

define(function(require) {
    var d3 = require('d3');

    // fast log2 function
    function log2(n) {
        for (var i = 0; n >>= 1; i++);
        return i;
    }

    /**
     * Tree visualization class
     * @param {Object[]}  [nodes]  Node array
     */
    function TreeVis(nodes) {
        /**
         * @type {Object[]}
         */
        this._data = [];

        /**
         * @type {Number}
         */
        this._maxDepth = 0;

        /**
         * @type {Object[]}
         */
        this._branches = [];

        /**
         * @type {Number}
         */
        this._width = 800;

        /**
         * @type {Number}
         */
        this._height = 600;

        /**
         * @type {Number}
         */
        this._angle = 0;

        /**
         * @type {Number}
         */
        this._length = 130;

        /**
         * @type {Number}
         */
        this._angleDelta = 0.5;

        /**
         * @type {Number}
         */
        this._lengthDelta = 0.8;

        /**
         * @type {Number}
         */
        this._randomness = 0.7;

        /**
         * @type {D3Selection}
         */
        this._selection = null;

        /**
         * @type {Boolean}
         */
        this._ready = false;

        // prep
        this._bindMethods();

        // init
        this.setData(nodes || []);
    }

    TreeVis.prototype = {

        // -- public methods ----------------------------------------

        /**
         * Generate the branches for the current data
         */
        generate: function() {
            if (!this._ready) {
                this._branches = [];
                var seed = this._seed();
                this._branch(seed);
                this._prune();
                this._ready = true;
            }
        },

        /**
         * Render the tree into the given SVG
         * @param {SVGElement} svg
         */
        render: function(svg) {
            var tree = this;

            tree.generate();

            svg = tree._selection = d3.select(svg);
            var lines = svg.selectAll('line').data(tree._branches);

            lines.enter().append('line')
                .attr('x1', _.get('x'))
                .attr('y1', _.get('y'))
                .attr('x2', _.get('x2'))
                .attr('y2', _.get('y2'))
                .style('stroke-width', _.get('w'));
        },

        /**
         * Set the data for the vis
         * @param {Object[]} nodes
         */
        setData: function(nodes) {
            this._data = nodes;
            this._maxDepth = log2(nodes.length) + 1;
            this._ready = false;
        },

        // -- private methods ---------------------------------------

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
                w: this._maxDepth + 1,
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
         * Introduce some entropy into the branch angle
         * @param  {Boolean}  right  Whether branch bends right or left
         * @return {Number}          Angle
         */
        _wiggle: function(right) {
            var r = this._randomness;
            var w = this._angleDelta + r * Math.random() - r * 0.5;
            return right ? w : -w;
        },

        /**
         * Create a new branch from the given previous branch
         * @param  {Object}   b      Previous branch
         * @param  {Boolean}  right  Direction of branch
         * @return {Object}          New branch
         */
        _makeBranch: function(b, right) {
            var depth = b.d + 1;
            var angle = this._computeAngle(b.a, depth, this._wiggle(right));

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
        _computeAngle: function(initialAngle, depth, wiggle) {
            var compact = depth / this._maxDepth;
            return compact * (initialAngle + wiggle);
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

        /**
         * Prune the tree branches to the correct length
         */
        _prune: function() {
            var dataCount = this._data.length;
            var lastRow = this._maxDepth;
            var lastRowSize = Math.pow(2, lastRow);
            var keep = lastRowSize - dataCount;
            var allIds = new Array(lastRowSize);
            var i = lastRowSize;

            while (i--) {
                allIds[i] = i;
            }

            // get a list of indexes of last row branches to keep
            var keepIds = _.sample(allIds, keep).sort(function(a, b) {
                return a - b;
            });

            // generate a list of real branches
            var branches = this._branches;
            var realBranches = [];
            var x = 0;

            branches.forEach(function(b, i) {
                if (b.d === lastRow) {
                    if (keepIds[0] === x++) {
                        realBranches.push(b);
                        keepIds.shift();
                    }
                } else {
                    realBranches.push(b);
                }
            });

            this._branches = realBranches;
        }

    };

    return TreeVis;
});