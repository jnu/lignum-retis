/**
 * Link List View
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define(function(require) {
    var cfg = require('config');
    var React = require('react');
    var LinkView = require('LinkView');

    var LinkListView = React.createClass({

        propTypes: {
            links: React.PropTypes.array
        },

        render: function() {
            var cmp = this;

            var links = this.props.links.map(function(link) {
                return (
                    <LinkView key={ link.id } url={ cfg.woodUrl(link.id) }>
                        { link.name }
                    </LinkView>
                );
            });

            return (
                <div className="link-list">
                    { links }
                </div>
            );
        }

    });

    return LinkListView;
});