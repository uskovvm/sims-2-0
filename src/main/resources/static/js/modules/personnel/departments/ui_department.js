'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    render: function () {
      let className = 'clickable ' + (this.props.selected ? 'selected' : '');
      return React.createElement(
        'tr',
        { id: this.props.data.id, className: className, onClick: this.props.onSelect },
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
        ),
        React.createElement(
          'td',
          null,
          this.props.organizationName
        )
      );
    }
  });
});