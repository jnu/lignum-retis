/**
 * Tree info view
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define([
    'react'
],
function(
    React
) {

    var InfoView = React.createClass({

        getInitialState: function() {
            return {
                name: "",
                type: ""
            };
        },

        setCurrentTree: function(m) {
            this.setState(m.toJSON());
        },

        render: function() {
            return (
                <div>
                    <section className="header">
                        <h3>Info</h3>
                    </section>
                    <section className="body">
                        <h3>{ this.state.name }</h3>
                        <p>{ this.state.type }</p>
                    </section>
                </div>
            );
        }

    });

    return InfoView;
});