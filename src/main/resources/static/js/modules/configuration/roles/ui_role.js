'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    onClick: function (el) {
      this.props.onChange(el.currentTarget.id);
    },
    render: function () {
      let className = 'clickable ' + (this.props.selection ? ' selected' : '');
      return React.createElement(
        'tr',
        { id: this.props.data.id, onClick: this.onClick, className: className },
        React.createElement(
          'td',
          null,
          this.props.data.id
        ),
        React.createElement(
          'td',
          null,
          this.props.data.name
        ),
        React.createElement(
          'td',
          null,
          this.props.data.description
        )
      );
    }
  });
});