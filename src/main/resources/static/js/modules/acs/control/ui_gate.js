'use strict';

define(['react', 'react-dom', 'utils/utils', 'dao/core', 'core/auth'], function (React, ReactDOM, Utils, CoreDao, Auth) {
  return React.createClass({
    onClick: function (ev) {
      let self = this;

      if (!Auth.canCommandDevice(self.props.data.id)) {
        return;
      }

      let params = {
        deviceId: self.props.data.id,
        commandId: 'setDeviceState',
        params: {
          state: +this.props.data.device.state
        }
      };

      CoreDao.sendCommand(params);
    },
    render: function () {
      let gateCheckboxClassName = 'btn-turnstiles btn-gate-enabled ' + (this.props.data.device.state ? 'checked' : '') + (!Auth.canCommandDevice(this.props.data.id) ? ' button-disabled' : '');

      return React.createElement(
        'div',
        { className: 'ui-device ui-gate' },
        React.createElement(
          'div',
          { className: 'ui-device-header' },
          React.createElement(
            'div',
            { className: 'ui-device-type' },
            'A',
            this.props.data.device.idx
          ),
          React.createElement(
            'div',
            { className: 'ui-device-description' },
            this.props.data.description
          ),
          React.createElement('div', { className: 'ui-device-checkbox ' + gateCheckboxClassName, onClick: this.onClick })
        )
      );
    }
  });
});