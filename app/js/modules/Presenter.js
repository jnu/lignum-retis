/**
 * Master app presenter
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define([
    'react',
    'IndexView',
    'InfoView'
],
function(
    React,
    IndexView,
    InfoView
) {
    function Presenter() {
        /* empty constructor */
    };

    Presenter.prototype = {

        _indexView: null,

        _infoView: null,

        init: function() {
            this._indexView = React.renderComponent(
                <IndexView />,
                document.getElementById('index')
            );

            this._infoView = React.renderComponent(
                <InfoView />,
                document.getElementById('info')
            );
        },

        showTree: function(id) {
            var presenter = this;

            presenter._indexView.getTreeFromServer(id, function(tree) {
                presenter._infoView.setCurrentTree(tree);
            });
        }

    };

    return Presenter;
});