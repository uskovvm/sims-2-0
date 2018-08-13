'use strict';

define(['jquery', 'react', 'react-dom', 'core/auth', './ui_module'], function ($, React, ReactDOM, Auth, Module) {
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

      let disabledView = self.props.data.currentRole.permissions.indexOf(Auth.Permission.PERM_MODULE_VIEW) === -1,
          disabledManagement = self.props.data.currentRole.permissions.indexOf(Auth.Permission.PERM_MODULE_MANAGEMENT) === -1;

      if (disabledView && disabledManagement) {
        return null;
      }

      let data = self.props.data.modules.map(function (el, idx) {
        let permission = self.props.data.currentPermissionsObjects[Auth.Permission.PERM_MODULE_VIEW],
            canView = permission && permission.indexOf(el.id) !== -1,
            permission2 = self.props.data.currentPermissionsObjects[Auth.Permission.PERM_MODULE_MANAGEMENT],
            canManage = permission2 && permission2.indexOf(el.id) !== -1;

        return React.createElement(Module, { key: idx, data: el, onChange: self.onChange, disabledView: disabledView, disabledManagement: disabledManagement, canView: canView, canManage: canManage });
      });

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'header2' },
          '\u0421\u043F\u0438\u0441\u043E\u043A \u043C\u043E\u0434\u0443\u043B\u0435\u0439'
        ),
        React.createElement(
          'table',
          { className: 'modules-table2' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
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
                '\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            data
          )
        )
      );
    }
  });
});