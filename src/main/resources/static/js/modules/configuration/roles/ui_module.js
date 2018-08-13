'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    render: function () {
      return React.createElement(
        'tr',
        null,
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
          React.createElement('input', { id: 'moduleView' + this.props.data.id, 'data-id': this.props.data.id, 'data-type': 'v', className: 'filled-in', type: 'checkbox', disabled: this.props.disabledView, checked: this.props.canView, onChange: this.props.onChange }),
          React.createElement('label', { htmlFor: 'moduleView' + this.props.data.id })
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { id: 'moduleManage' + this.props.data.id, 'data-id': this.props.data.id, 'data-type': 'm', className: 'filled-in', type: 'checkbox', disabled: this.props.disabledManagement, checked: this.props.canManage, onChange: this.props.onChange }),
          React.createElement('label', { htmlFor: 'moduleManage' + this.props.data.id })
        )
      );
    }
  });
});