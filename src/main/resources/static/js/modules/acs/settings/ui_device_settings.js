'use strict';

const DEVICE_TURNSTILE = 1,
      DEVICE_DOOR_CONTROLLER = 7,
      DEVICE_CAMERA = 8,
      DEVICE_ETH_CONTROLLER = 9;

define(['react', 'react-dom', './ui_connection_settings', './ui_identification_types_selector', './ui_turnstile_device', './ui_settings_access', 'ui/ui_elements'], function (React, ReactDOM, ConnectionSettings, IdentificationTypesSelector, TurnstileDevice, SettingsAccess, Elements) {
  return React.createClass({
    render: function () {
      let device = this.props.data.selectedDevice;
      if (device) {
        let deviceUI = null,
            deviceSettings = null;

        switch (device.connection.typeId) {
          case DEVICE_TURNSTILE:
            let cameras = this.props.data.devices.filter(el => el.connection.typeId === DEVICE_CAMERA);
            cameras.unshift({ id: 0, name: 'Не выбрано' });

            deviceUI = React.createElement(
              'div',
              null,
              React.createElement(TurnstileDevice, {
                selectedDevice: device,
                onChangeWdtChannel: this.props.onChangeWdtChannel,
                onChangeBroken: this.props.onChangeBroken,
                onChangeCardAutoreg: this.props.onChangeCardAutoreg,
                onChangeInvert: this.props.onChangeInvert }),
              React.createElement('br', null),
              React.createElement(SettingsAccess, {
                zones: this.props.data.zones,
                selectedDevice: device,
                onChangeZoneA: this.props.onChangeZoneA,
                onChangeZoneB: this.props.onChangeZoneB,
                onChangeAccessModeAB: this.props.onChangeAccessModeAB,
                onChangeAccessModeBA: this.props.onChangeAccessModeBA })
            );

            deviceSettings = React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'header2b' },
                '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F'
              ),
              React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.name, onChange: this.props.onChangeName }),
                  React.createElement('br', null),
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.description, onChange: this.props.onChangeDescription }),
                  React.createElement('br', null)
                ),
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    null,
                    React.createElement(
                      'div',
                      { className: 'header3' },
                      '\u0410\u0434\u0440\u0435\u0441 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430:'
                    ),
                    React.createElement('input', { className: 'with-element-width', type: 'text', value: device.connection.addr, onChange: this.props.onChangeAddr })
                  ),
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041F\u043E\u0440\u044F\u0434\u043A\u043E\u0432\u044B\u0439 \u043D\u043E\u043C\u0435\u0440:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.device.idx, onChange: this.props.onChangeIdx }),
                  React.createElement('br', null)
                )
              ),
              React.createElement('br', null),
              React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u0422\u0438\u043F\u044B \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u0438:'
                  ),
                  React.createElement(IdentificationTypesSelector, { identificationTypes: this.props.data.identificationTypes, selectedDevice: device, onChange: this.props.onChangeIdentificationType }),
                  React.createElement('br', null)
                ),
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u0424\u043E\u0442\u043E\u0444\u0438\u043A\u0441\u0430\u0446\u0438\u044F \u0441 \u0432\u0438\u0434\u0435\u043E\u043A\u0430\u043C\u0435\u0440\u044B:'
                  ),
                  React.createElement(Elements.Select, { className: 'with-element-width', selectedValue: device.device.cameraId || 0, values: cameras, onChange: this.props.onChangeCamera })
                )
              )
            );

            break;

          case DEVICE_DOOR_CONTROLLER:
            let time = new Date(device.device.lastSyncTime);
            let month = time.getMonth() + 1;
            month = month > 9 ? month : '0' + month;
            let date = time.getDate();
            date = date > 9 ? date : '0' + date;
            let hours = time.getHours() + time.getTimezoneOffset() / 60;
            hours = hours > 9 ? hours : '0' + hours;
            let minutes = time.getMinutes();
            minutes = minutes > 9 ? minutes : '0' + minutes;
            let seconds = time.getSeconds();
            seconds = seconds > 9 ? seconds : '0' + seconds;
            let timeStr = hours + ':' + minutes + ':' + seconds + ' ' + date + '-' + month + '-' + time.getFullYear();

            deviceSettings = React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'header2b' },
                '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F'
              ),
              React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.name, onChange: this.props.onChangeName }),
                  React.createElement('br', null),
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.description, onChange: this.props.onChangeDescription }),
                  React.createElement('br', null)
                ),
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u0422\u0430\u0439\u043C\u0430\u0443\u0442 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'number', value: device.device.syncTimeout, onChange: this.props.onChangeDCBSyncTimeout }),
                  React.createElement('br', null),
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u0412\u0440\u0435\u043C\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438:'
                  ),
                  React.createElement(
                    'span',
                    null,
                    timeStr
                  )
                )
              ),
              React.createElement('br', null),
              React.createElement(SettingsAccess, {
                zones: this.props.data.zones,
                selectedDevice: device,
                onChangeZoneA: this.props.onChangeZoneA,
                onChangeZoneB: this.props.onChangeZoneB,
                onChangeAccessModeAB: this.props.onChangeAccessModeAB,
                onChangeAccessModeBA: this.props.onChangeAccessModeBA })
            );

            break;

          case DEVICE_CAMERA:
            deviceSettings = React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'header2b' },
                '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F'
              ),
              React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.name, onChange: this.props.onChangeName }),
                  React.createElement('br', null),
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.description, onChange: this.props.onChangeDescription }),
                  React.createElement('br', null)
                ),
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u0417\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u0444\u043E\u0442\u043E\u0444\u0438\u043A\u0441\u0430\u0446\u0438\u0438:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.shotTimeout, onChange: this.props.onChangeCameraTimeout }),
                  React.createElement('br', null)
                )
              ),
              React.createElement('br', null),
              React.createElement(
                'div',
                { className: 'header2b' },
                '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u0430'
              ),
              React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041B\u043E\u0433\u0438\u043D:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.login, onChange: this.props.onChangeLogin }),
                  React.createElement('br', null),
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041F\u0430\u0440\u043E\u043B\u044C:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'password', value: device.password, onChange: this.props.onChangePassword }),
                  React.createElement('br', null)
                ),
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    null,
                    React.createElement(
                      'div',
                      { className: 'header3' },
                      '\u0418\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u043A\u0430\u043C\u0435\u0440\u044B:'
                    ),
                    React.createElement('input', { className: 'with-element-width', type: 'text', value: device.cameraId, onChange: this.props.onChangeCameraId })
                  )
                )
              )
            );

            break;

          case DEVICE_ETH_CONTROLLER:
            let dbConnections = this.props.data.connections.filter(el => {
              return el.typeId === 4;
            });

            deviceSettings = React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'header2b' },
                '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F'
              ),
              React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.name, onChange: this.props.onChangeName }),
                  React.createElement('br', null),
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.description, onChange: this.props.onChangeDescription }),
                  React.createElement('br', null)
                ),
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435 \u0441 \u0411\u0414:'
                  ),
                  React.createElement(Elements.Select, { className: 'with-element-width', selectedValue: device.device.dbConnectionId || 0, values: dbConnections, onChange: this.props.onChangeDBConnection })
                )
              ),
              React.createElement('br', null),
              React.createElement(SettingsAccess, {
                zones: this.props.data.zones,
                selectedDevice: device,
                onChangeZoneA: this.props.onChangeZoneA,
                onChangeZoneB: this.props.onChangeZoneB,
                onChangeAccessModeAB: this.props.onChangeAccessModeAB,
                onChangeAccessModeBA: this.props.onChangeAccessModeBA })
            );

            break;

          default:
            deviceSettings = React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'header2b' },
                '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F'
              ),
              React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l6' },
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.name, onChange: this.props.onChangeName }),
                  React.createElement('br', null),
                  React.createElement(
                    'div',
                    { className: 'header3' },
                    '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:'
                  ),
                  React.createElement('input', { className: 'with-element-width', type: 'text', value: device.description, onChange: this.props.onChangeDescription }),
                  React.createElement('br', null)
                )
              )
            );
        }

        return React.createElement(
          'div',
          { className: 'panel device-settings-panel' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col s12 m6 l6' },
              React.createElement(
                'div',
                { className: 'switch' },
                React.createElement(
                  'label',
                  null,
                  '\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C',
                  React.createElement('input', { type: 'checkbox', checked: device.enabled, onChange: this.props.onChangeEnabled }),
                  React.createElement('span', { className: 'lever' }),
                  '\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C'
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'col s12 m6 l6' },
              React.createElement(
                'div',
                { className: 'right-align header3' },
                '\u0421\u0435\u0440\u0438\u0439\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 (UID): ',
                device.serialNumber
              )
            )
          ),
          React.createElement('br', null),
          React.createElement(ConnectionSettings, {
            data: this.props.data,
            onChangeDeviceType: this.props.onChangeDeviceType,
            onChangeProtocol: this.props.onChangeProtocol,
            onChangeConnection: this.props.onChangeConnection }),
          React.createElement('br', null),
          deviceSettings,
          deviceUI
        );
      }

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'center-align' },
          '\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445'
        )
      );
    }
  });
});