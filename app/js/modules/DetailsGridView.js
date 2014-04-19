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

    var DetailsGridView = React.createClass({

        render: function() {
            var rows = _.map(this.props.content, function(val, key) {
                return (
                    <tr>
                        <td className="field-name">{ key }</td>
                        <td className="field-val">{ val }</td>
                    </tr>
                );
            });

            return (
                <table>
                    <tbody>{ rows }</tbody>
                </table>
            );
        }

    });

    return DetailsGridView;
});