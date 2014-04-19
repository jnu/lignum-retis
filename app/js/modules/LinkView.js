/**
 * Tree link view
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

    var LinkView = React.createClass({

        _formatName: function(name) {
            return name && name.join(', ').replace(/, (.*)$/, ' ($1)')
        },

        render: function() {
            return (
                <div className="link-list-item">
                    <a href={ this.props.url }>
                        <span>{ this._formatName(this.props.children) }</span>
                    </a>
                </div>
            )
        }

    });

    return LinkView;
});