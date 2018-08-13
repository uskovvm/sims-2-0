'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    onClick: function (ev) {
      let id = 0;

      if (!!ev.currentTarget.id) {
        if (ev.currentTarget.id.indexOf('tmp') !== -1) {
          id = ev.currentTarget.id;
        } else {
          id = Number(ev.currentTarget.id);
        }
      }

      this.props.onSelect(id);
    },
    render: function () {
      let self = this;

      let devices = this.props.data.devices.map(function (el, idx) {
        let name = el.name + ' ' + el.description;
        let className = 'ui-slud-settings-device ' + (self.props.data.selectedDevice && self.props.data.selectedDevice.id === el.id ? 'selected' : '');
        return React.createElement(
          'div',
          { key: idx, id: el.id, className: className, onClick: self.onClick },
          name
        );
      });

      return React.createElement(
        'div',
        { className: 'panel devices-panel' },
        React.createElement(
          'div',
          { className: 'ui-skud-settings-devices-title' },
          '\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043D\u043E\u0435 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u0435:'
        ),
        devices
      );
    }
  });
});