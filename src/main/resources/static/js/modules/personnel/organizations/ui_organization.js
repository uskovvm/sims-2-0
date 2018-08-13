'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    render: function () {
      let className = 'clickable ' + (this.props.selected ? 'selected' : '');

      let departments = this.props.data.departments.map(function (el, idx) {
        return React.createElement(
          'span',
          { key: idx, className: 'header2' },
          (idx !== 0 ? ', ' : '') + el.name
        );
      });

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
          this.props.data.fullName
        ),
        React.createElement(
          'td',
          null,
          this.props.data.description
        ),
        React.createElement(
          'td',
          null,
          departments
        )
      );
    }
  });
});