/**
 * Tree vis view
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define(function(require) {
    var React = require('react');

    var VisView = React.createClass({

        getInitialState: function() {
            return {
                visClass: null
            };
        },

        setCurrentVis: function(visClass) {
            this.setState({ visClass: visClass });
        },

        render: function() {
            var visClass = this.state.visClass;
            var vis = visClass ? null : null;

            return (
                <div>
                    <section className="header">
                        <h3>Vis</h3>
                    </section>
                    <section className="body">
                        { vis }
                    </section>
                </div>
            );
        }

    });

    return VisView;
});