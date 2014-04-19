/**
 * Tree index view
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define([
    'config',
    'react',
    'LinkListView',
    'vis/tree/TreeVisView',
    'resources/TreeCollection'
],
function(
    cfg,
    React,
    LinkListView,
    TreeVisView,
    TreeCollection
) {

    var IndexView = React.createClass({

        _trees: null,

        getInitialState: function() {
            this._trees = new TreeCollection();
            return { trees: [] };
        },

        getTreeFromServer: function(id, cb, _bail) {
            var cmp = this;

            function retry() {
                if (_bail) throw new Error("Error fetching model " + id);
                cmp.getTreeFromServer(id, cb, true);
            }

            // try to fetch models if there are none, then try to run this
            // function again
            if (!cmp._trees.length) {
                // need to fetch base models before single model
                cmp.fetchTreesFromServer(retry);
            }
            // try to fetch individual model
            else {
                var tree = cmp._trees.get(id);
                if (tree) {
                    tree.fetch({
                        success: cb,
                        error: retry
                    });
                }
                // if there is no tree, try once again (but only once)
                else retry();
            }
        },

        syncComponentWithCollection: function() {
            this.setState({
                trees: this._trees.toJSON()
            });
        },

        fetchTreesFromServer: function(cb) {
            var cmp = this;

            cmp._trees.fetch({
                success: function() {
                    cmp.syncComponentWithCollection();
                    if (cb) {
                        cb();
                    }
                }
            });
        },

        componentWillMount: function() {
            this.fetchTreesFromServer();
        },

        render: function() {
            return (
                <div>
                    <section className="header">
                        <h3>Trees</h3>
                    </section>
                    <section className="body">
                        <TreeVisView nodes={ this.state.trees } />
                    </section>
                </div>
            )
        }

    });

    return IndexView;
});