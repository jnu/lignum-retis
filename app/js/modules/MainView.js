/**
 * Main view
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define([
    'config',
    'react',
    'LinkListView',
    'resources/TreeCollection'
],
function(
    cfg,
    React,
    LinkListView,
    TreeCollection
) {

    var MainView = React.createClass({

        getInitialState: function() {
            this._trees = new TreeCollection();
            return { trees: [] };
        },

        syncComponentWithCollection: function() {
            this.setState({
                trees: this._trees.toJSON()
            });
        },

        fetchTreesFromServer: function() {
            this._trees.fetch();
        },

        componentWillMount: function() {
            this.fetchTreesFromServer();
        },

        render: function() {
            return (
                <LinkListView links={ this.state.trees } />
            )
        }

    });

    return MainView;
});