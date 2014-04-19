/**
 * React component for tree visualization
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define([
    'react',
    'vis/tree/TreeVis'
],
function(
    React,
    TreeVis
) {

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

        componentDidUpdate: function() {
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