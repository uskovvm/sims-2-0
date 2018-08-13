'use strict';

define(['react', 'react-dom', 'ui/ui_elements'], function (React, ReactDOM, Elements) {
  return React.createClass({
    render: function () {
      let selectedElementId = this.props.selectedDevice.connection.connectionId;
      if (selectedElementId === null) {
        selectedElementId = this.props.connections && this.props.connections.length ? this.props.connections[0].id : '';
      }

      let shouldShowIp = true;
      let connections = [];
      this.props.connections.map(function (el, idx) {
        if (el.id === selectedElementId && el.ip) {
          shouldShowIp = false;
        }

        connections.push(el);
      });

      connections.unshift({
        id: 0,
        name: 'Не выбрано'
      });

      return React.createElement(
        'div',
        null,
        React.createElement(Elements.Select, { className: 'with-element-width', selectedValue: selectedElementId, onChange: this.props.onChangeConnectionType, values: connections }),
        React.createElement(
          'div',
          { hidden: shouldShowIp },
          React.createElement('br', null),
          React.createElement(
            'div',
            { className: 'header3' },
            'IP-\u0430\u0434\u0440\u0435\u0441:'
          ),
          React.createElement('input', { className: 'with-element-width', type: 'text', value: this.props.selectedDevice.connection.ip, onChange: this.props.onChangeIp })
        )
      );
    }
  });
});