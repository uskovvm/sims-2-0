'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    render: function () {
      let className = 'clickable ' + (this.props.select ? 'selected' : '');

      return React.createElement(
        'tr',
        { id: this.props.data.number, onClick: this.props.onSelect, className: className },
        React.createElement(
          'td',
          null,
          this.props.data.number
        ),
        React.createElement(
          'td',
          null,
          new Date(this.props.data.validFrom).toLocaleString()
        ),
        React.createElement(
          'td',
          null,
          new Date(this.props.data.validTo).toLocaleString()
        ),
        React.createElement(
          'td',
          null,
          this.props.data.document
        )
      );
    }
  });
});