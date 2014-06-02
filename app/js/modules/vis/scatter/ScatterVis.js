/**
 * Scatter vis
 *
 * Copyright 2014 Joe Nudell
 */

define(function(require) {
    var d3 = require('d3');
    var BaseVis = require('vis/base/BaseVis');

    var BaseVisProto = BaseVis.prototype;

    /**
     * A Scatterplot visualization
     * @param {Object[]} [data]
     */
    function ScatterVis(data) {
        var vis = this;

        BaseVis.call(vis);

        var x = vis._xScale = d3.scale.linear();

        var y = vis._yScale = d3.scale.linear();

        vis._rScale = d3.scale.pow();

        vis._xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        vis._yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        var margin = vis._margin;
        margin.left = 40;
        margin.bottom = 30;
        margin.right = 20;
        margin.top = 20;

        this._width = 400;
        this._height = 400;

        vis._radius = 5;

        vis.setData(data || []);
    }

    _.extend(ScatterVis.prototype, BaseVisProto, {

        // -- Public API --------------------------------------------

        compute: function() {
            this._processData();
            this._configureAxes();

        },

        draw: function(ctx) {
            this._drawAxes(ctx);
            this._drawDots(ctx);
        },

        // -- Private methods ---------------------------------------

        /**
         * Process the data for the vis
         * @private
         */
        _processData: function() {
            this._data.forEach(function(d) {
                d.dryWeight = +d.dryWeight;
                d.elastic = +d.elastic;
            });
        },

        /**
         * Figure out domain and range for axes
         * @private
         */
        _configureAxes: function() {
            var data = this._data;
            var x = this._xScale;
            var y = this._yScale;
            var r = this._rScale;

            var xDomain = d3.extent(data, _.get('dryWeight'));
            var yDomain = d3.extent(data, _.get('elastic'));
            var rDomain = d3.extent(data, this._speedOfSound);

            if (!data.length) {
                xDomain = [0, 1];
                yDomain = [0, 1];
                rDomain = [0, 1];
            }

            // set domains
            x.domain(xDomain).nice();
            y.domain(yDomain).nice();
            r.domain(rDomain).nice();

            // set ranges
            x.range([0, this._width]);
            y.range([this._height, 0]);
            r.range([1, 10]);
        },

        /**
         * Draw the axes
         * @private
         * @param  {SVGElement} ctx  render context
         */
        _drawAxes: function(ctx) {
            var xAxis = ctx.selectAll('.x.axis').data([0]);

            xAxis.enter().append('g')
                .attr('class', 'x axis');

            xAxis.attr('transform', 'translate(0,' + this._height + ')')
                .call(this._xAxis);

            var yAxis = ctx.selectAll('.y.axis').data([0]);

            yAxis.enter().append('g')
                .attr('class', 'y axis');

            yAxis.call(this._yAxis);
        },

        /**
         * Draw the circles
         * @private
         * @param  {SVGElement} ctx  render context
         */
        _drawDots: function(ctx) {
            var dots = ctx.selectAll('.dot').data(this._data);
            var x = this._xScale;
            var y = this._yScale;
            var r = this._rScale;
            var sos = this._speedOfSound;

            dots.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', function(d) {
                    return r(sos(d));
                })
                .attr('cx', function(d) {
                    return x(d.dryWeight);
                })
                .attr('cy', function(d) {
                    return y(d.elastic);
                })
                .style('fill', '#333');
        },

        _speedOfSound: function(d) {
            if (d.elastic && d.dryWeight) {
                return Math.sqrt(d.elastic / d.dryWeight);
            }
        }

    });

    return ScatterVis;
});