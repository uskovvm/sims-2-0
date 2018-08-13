'use strict';

define(['react', 'react-dom', 'ui/ui_elements', './ui_protocol_selector'], function (React, ReactDOM, Elements, ProtocolSelector) {
  return React.createClass({
    getProtocols: function () {
      let self = this;

      let deviceTypeId = self.props.data.selectedDevice.connection.typeId;

      let protocolIds = {};
      self.props.data.connectionConfigs.forEach(el => {
        if (el.deviceTypeId === deviceTypeId) {
          protocolIds[el.protocolId] = true;
        }
      });

      return self.props.data.protocols.filter(el => {
        return !!protocolIds[el.id];
      });
    },
    getConnections: function () {
      let self = this;

      let deviceTypeId = self.props.data.selectedDevice.connection.typeId,
          protocolId = self.props.data.selectedDevice.connection.protocolId;

      let connectionTypes = {};
      self.props.data.connectionConfigs.forEach(el => {
        if (el.deviceTypeId === deviceTypeId && el.protocolId === protocolId) {
          connectionTypes[el.connectionTypeId] = true;
        }
      });

      return self.props.data.connections.filter(el => {
        return !!connectionTypes[el.typeId];
      });
    },
    render: function () {
      let deviceTypeSelector = 'with-element-width' + (this.props.data.error ? ' alert-border' : ''),
          string = this.props.data.error ? React.createElement(
        'div',
        { className: 'alert' },
        this.props.data.error.description
      ) : null;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'header2b' },
          '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F'
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col s12 m4 l4' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0422\u0438\u043F \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F:'
            ),
            React.createElement(Elements.Select, {
              className: deviceTypeSelector,
              values: this.props.data.deviceTypes,
              selectedValue: this.props.data.selectedDevice.connection.typeId,
              onChange: this.props.onChangeDeviceType }),
            string
          ),
          React.createElement(
            'div',
            { className: 'col s12 m4 l4' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u041F\u0440\u043E\u0442\u043E\u043A\u043E\u043B \u0440\u0430\u0431\u043E\u0442\u044B:'
            ),
            React.createElement(ProtocolSelector, {
              protocols: this.getProtocols(),
              selectedDevice: this.props.data.selectedDevice,
              onChange: this.props.onChangeProtocol })
          ),
          React.createElement(
            'div',
            { className: 'col s12 m4 l4' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435:'
            ),
            React.createElement(Elements.Select, {
              className: 'with-element-width',
              values: this.getConnections(),
              selectedValue: this.props.data.selectedDevice.connection.connectionId,
              onChange: this.props.onChangeConnection })
          )
        )
      );
    }
  });
});