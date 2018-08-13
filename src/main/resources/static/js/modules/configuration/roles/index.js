'use strict';

define(['jquery', 'react', 'react-dom', 'utils/utils', 'dao/core', 'dao/devices', 'objects', 'core/auth', './ui_devices', './ui_roles', './ui_permissions', './ui_control_panel', 'dao/modules', 'dao/auth', './ui_modules', 'core/logger'], function ($, React, ReactDOM, Utils, CoreDao, DevicesDao, Objects, Auth, Devices, Roles, Permissions, ControlPanel, ModulesDao, AuthDao, Modules, Log) {
  return React.createClass({
    getInitialState: function () {
      return {
        roles: [],
        permissions: [],
        devices: [],
        currentPermissionsObjects: {},
        currentRole: null,
        autosave: null
      };
    },
    componentDidMount: function () {
      let self = this;

      CoreDao.getPermissions({}, function (permissions) {
        self.setState({ permissions: permissions });

        CoreDao.getRoles({}, function (roles) {
          self.setState({
            roles: roles,
            currentRole: roles ? Objects.clone(roles[0]) : null
          }, self.loadPermissionsObjects);
        });
      });

      DevicesDao.getAll({}, function (data) {
        self.setState({ devices: data.rows });
      });

      ModulesDao.get({}, function (data) {
        self.setState({ modules: data });
      });
    },
    onChangeRole: function (id) {
      this.setState({
        currentRole: Utils.findById(this.state.roles, +id),
        currentPermissionsObjects: {}
      }, this.loadPermissionsObjects);
    },
    onChangePermission: function (key, value) {
      let currentRole = this.state.currentRole,
          permissions = this.state.currentPermissionsObjects;
      if (value) {
        currentRole.permissions.push(+key);
      } else {
        let idx = currentRole.permissions.indexOf(+key);
        if (idx !== -1) {
          currentRole.permissions.splice(idx, 1);
          delete permissions[+key];
        }
      }
      this.setState({
        currentRole: currentRole,
        currentPermissionsObjects: permissions
      }, this.updateTimeout);
    },
    onChangeDevicePermission: function (type, key, value) {
      let permissions = this.state.currentPermissionsObjects,
          v = null;

      switch (type) {
        case 'v':
          v = permissions[Auth.Permission.PERM_DEVICE_VIEW] || [];
          if (value) {
            v.push(+key);
          } else {
            let idx = v.indexOf(+key);
            if (idx !== -1) {
              v.splice(idx, 1);
            }
          }
          permissions[Auth.Permission.PERM_DEVICE_VIEW] = v;
          break;
        case 'm':
          v = permissions[Auth.Permission.PERM_DEVICE_MANAGEMENT] || [];
          if (value) {
            v.push(+key);
          } else {
            let idx = v.indexOf(+key);
            if (idx !== -1) {
              v.splice(idx, 1);
            }
          }
          permissions[Auth.Permission.PERM_DEVICE_MANAGEMENT] = v;
          break;
        case 'c':
          v = permissions[Auth.Permission.PERM_DEVICE_COMMAND] || [];
          if (value) {
            v.push(+key);
          } else {
            let idx = v.indexOf(+key);
            if (idx !== -1) {
              v.splice(idx, 1);
            }
          }
          permissions[Auth.Permission.PERM_DEVICE_COMMAND] = v;
          break;
      }

      this.setState({ currentPermissionsObjects: permissions }, this.updateTimeout);
    },
    onChangeModulePermission: function (type, key, value) {
      let permissions = this.state.currentPermissionsObjects,
          v = null;

      switch (type) {
        case 'v':
          v = permissions[Auth.Permission.PERM_MODULE_VIEW] || [];
          if (value) {
            v.push(+key);
          } else {
            let idx = v.indexOf(+key);
            if (idx !== -1) {
              v.splice(idx, 1);
            }
          }
          permissions[Auth.Permission.PERM_MODULE_VIEW] = v;
          break;
        case 'm':
          v = permissions[Auth.Permission.PERM_MODULE_MANAGEMENT] || [];
          if (value) {
            v.push(+key);
          } else {
            let idx = v.indexOf(+key);
            if (idx !== -1) {
              v.splice(idx, 1);
            }
          }
          permissions[Auth.Permission.PERM_MODULE_MANAGEMENT] = v;
          break;
      }

      this.setState({ currentPermissionsObjects: permissions }, this.updateTimeout);
    },
    loadPermissionsObjects: function () {
      let self = this;

      function loadPermissionObject(permissionId) {
        AuthDao.getPermissionObjects({
          roleId: self.state.currentRole.id,
          id: permissionId
        }, function (data) {
          let arr = self.state.currentPermissionsObjects;
          arr[permissionId] = data;
          self.setState({ currentPermissionsObjects: arr });
        });
      }

      for (let i = 0; i < self.state.currentRole.permissions.length; i++) {
        switch (self.state.currentRole.permissions[i]) {
          case Auth.Permission.PERM_MODULE_VIEW:
          case Auth.Permission.PERM_MODULE_MANAGEMENT:
          case Auth.Permission.PERM_DEVICE_VIEW:
          case Auth.Permission.PERM_DEVICE_MANAGEMENT:
          case Auth.Permission.PERM_DEVICE_COMMAND:
            loadPermissionObject(+self.state.currentRole.permissions[i]);
        }
      }
    },
    updateTimeout: function () {
      if (this.state.autosave !== null) {
        clearTimeout(this.state.autosave);
      }

      this.setState({ autosave: setTimeout(this.onSave, 3000) });
    },
    deleteTimeout: function () {
      clearTimeout(this.state.autosave);
      this.setState({ autosave: null });
    },
    onSave: function () {
      let self = this;

      CoreDao.setRolePermissions([{
        roleId: +self.state.currentRole.id,
        permissions: self.state.currentRole.permissions
      }], function () {
        $.each(self.state.currentPermissionsObjects, function (name, value) {
          if (!value) {
            return;
          }

          AuthDao.setPermissionObjects({
            roleId: +self.state.currentRole.id,
            id: +name,
            objects: value
          });
        });

        Log.info('Данные успешно сохранены');
      }, function () {
        Log.error('Ошибка сохранения данных');
      });

      self.deleteTimeout();
    },
    render: function () {
      return React.createElement(
        'div',
        { className: 'content-with-control-panel' },
        React.createElement(ControlPanel, { onSave: this.onSave }),
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(Roles, { data: this.state, onChange: this.onChangeRole }),
            React.createElement(Permissions, { data: this.state, onChange: this.onChangePermission }),
            React.createElement(Devices, { data: this.state, onChange: this.onChangeDevicePermission }),
            React.createElement(Modules, { data: this.state, onChange: this.onChangeModulePermission })
          )
        )
      );
    }
  });
});