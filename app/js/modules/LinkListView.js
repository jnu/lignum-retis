/**
 * Link List View
 *
 * Copyright 2014 Joe Nudell
 *
 * @jsx React.DOM
 */

define([
    'config',
    'react',
    'LinkView'
],
function(
    cfg,
    React,
    LinkView
) {

    var LinkListView = React.createClass({

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
                <div>
                    { links }
                </div>
            );
        }

    });

    return LinkListView;
});