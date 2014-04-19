/**
 * Tree info view
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define([
    'react',
    'DetailsGridView'
],
function(
    React,
    DetailsGridView
) {

    var InfoView = React.createClass({

        getInitialState: function() {
            return {
                name: [],
                type: ""
            };
        },

        setCurrentTree: function(m) {
            this.setState(m.toJSON());
        },

        _parseTreeName: function(name) {
            var primary = name.shift();
            var secondary = name.join(', ');

            return {
                primary: primary,
                secondary: secondary
            };
        },

        getTitle: function() {
            return this._parseTreeName(this.state.name);
        },

        getTableContent: function() {
            return _.pick(this.state, [
                'type',
                'dryWeight',
                'height',
                'diameter'
            ]);
        },

        render: function() {
            var title = this.getTitle();

            return (
                <div>
                    <section className="header">
                        <h3>{ title.primary }</h3>
                        <div>Other names: <span className="title.secondary-">{ title.secondary }</span></div>
                    </section>
                    <section className="body">
                        <DetailsGridView content={ this.getTableContent() } />
                    </section>
                </div>
            );
        }

    });

    return InfoView;
});