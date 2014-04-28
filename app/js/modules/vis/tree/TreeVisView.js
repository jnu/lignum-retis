/**
 * React component for tree visualization
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define(function(requre) {
    var cfg = require('config');
    var React = require('react');
    var Backbone = require('backbone');
    var TreeVis = require('vis/tree/TreeVis');

    var TreeVisView = React.createClass({

        _treeVis: null,

        getDefaultProps: function() {
            this._treeVis = new TreeVis(this.props.nodes);

            return {
                nodes: []
            };
        },

        componentWillReceiveProps: function(nextProps) {
            if (nextProps.nodes){
                this._treeVis.setData(nextProps.nodes);
            }
        },

        bindEvents: function() {
            var v = this._treeVis;
            v.on(v.EVT_REQUEST_TREE, function(id) {
                var href = cfg.woodUrl(id);
                Backbone.history.navigate(href, true);
            });
        },

        componentDidUpdate: function() {
            this.bindEvents();
            var node = this.getDOMNode();
            var tree = this._treeVis;
            tree.render(node);
        },

        render: function() {
            return (
                <svg className="tree-vis"></svg>
            );
        }

    });

    return TreeVisView;
});