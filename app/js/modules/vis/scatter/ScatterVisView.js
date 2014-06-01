/**
 * React component for scatterplot visualization
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define(function(requre) {
    var cfg = require('config');
    var React = require('react');
    var ScatterVis = require('vis/scatter/ScatterVis');

    var ScatterVisView = React.createClass({

        _scatterVis: null,

        getDefaultProps: function() {
            this._scatterVis = new ScatterVis(this.props.data);

            return {
                data: []
            };
        },

        componentWillReceiveProps: function(nextProps) {
            if (nextProps.data) {
                this._scatterVis.setData(nextProps.data);
            }
        },

        bindEvents: function() {
            var v = this._scatterVis;
            // no events yet
            // TODO: mouseover popups etc
        },

        componentDidUpdate: function() {
            this.bindEvents();
            var node = this.getDOMNode();
            this._scatterVis.render(node);
        },

        render: function() {
            return (
                <svg className="scatter-vis"></svg>
            );
        }

    });

    return ScatterVisView;
});