'use strict';

define(['jquery', 'react', 'react-dom', 'core/auth', './ui_device'], function ($, React, ReactDOM, Auth, Device) {
  return React.createClass({
    onChange: function (ev) {
      let el = $(ev.currentTarget);
      this.props.onChange(el.attr('data-type'), +el.attr('data-id'), el.is(':checked'));
    },
    render: function () {
      let self = this;

      if (!self.props.data.currentRole) {
        return null;
      }

      let disabledView = self.props.data.currentRole.permissions.indexOf(Auth.Permission.PERM_DEVICE_VIEW) === -1,
          disabledManagement = self.props.data.currentRole.permissions.indexOf(Auth.Permission.PERM_DEVICE_MANAGEMENT) === -1,
          disabledCommand = self.props.data.currentRole.permissions.indexOf(Auth.Permission.PERM_DEVICE_COMMAND) === -1;

      if (disabledView && disabledManagement && disabledCommand) {
        return null;
      }

      let res = self.props.data.devices.map(function (el, idx) {
        let permission1 = self.props.data.currentPermissionsObjects[Auth.Permission.PERM_DEVICE_VIEW],
            permission2 = self.props.data.currentPermissionsObjects[Auth.Permission.PERM_DEVICE_MANAGEMENT],
            permission3 = self.props.data.currentPermissionsObjects[Auth.Permission.PERM_DEVICE_COMMAND];

        let canView = permission1 && permission1.indexOf(el.id) !== -1,
            canManage = permission2 && permission2.indexOf(el.id) !== -1,
            canCommand = permission3 && permission3.indexOf(el.id) !== -1;

        return React.createElement(Device, { key: idx, data: el, canView: canView, canManage: canManage, canCommand: canCommand, onChange: self.onChange, disabledView: disabledView, disabledManagement: disabledManagement, disabledCommand: disabledCommand });
      });

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'header2' },
          '\u0421\u043F\u0438\u0441\u043E\u043A \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432'
        ),
        React.createElement(
          'table',
          { className: 'devices-table' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                '\u041D\u043E\u043C\u0435\u0440'
              ),
              React.createElement(
                'th',
                null,
                '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'th',
                null,
                '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'th',
                null,
                '\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440'
              ),
              React.createElement(
                'th',
                null,
                '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430'
              ),
              React.createElement(
                'th',
                null,
                '\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            res
          )
        )
      );
    }
  });
});