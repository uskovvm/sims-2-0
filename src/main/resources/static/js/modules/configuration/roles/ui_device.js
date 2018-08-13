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
          this.props.data.serialNumber
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
          React.createElement('input', { id: 'chbxDeviceView' + this.props.data.id, 'data-id': this.props.data.id, 'data-type': 'v', className: 'filled-in', disabled: this.props.disabledView, type: 'checkbox', checked: this.props.canView, onChange: this.props.onChange }),
          React.createElement('label', { htmlFor: 'chbxDeviceView' + this.props.data.id })
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { id: 'chbxDeviceManagment' + this.props.data.id, 'data-id': this.props.data.id, className: 'filled-in', disabled: this.props.disabledManagement, 'data-type': 'm', type: 'checkbox', checked: this.props.canManage, onChange: this.props.onChange }),
          React.createElement('label', { htmlFor: 'chbxDeviceManagment' + this.props.data.id })
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { id: 'chbxDeviceCommand' + this.props.data.id, 'data-id': this.props.data.id, className: 'filled-in', disabled: this.props.disabledCommand, 'data-type': 'c', type: 'checkbox', checked: this.props.canCommand, onChange: this.props.onChange }),
          React.createElement('label', { htmlFor: 'chbxDeviceCommand' + this.props.data.id })
        )
      );
    }
  });
});