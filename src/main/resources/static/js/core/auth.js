'use strict';

define(
  ['dao/auth', 'core/history', 'core/logger'], 
  function (AuthDao, History, Log) {
    let Permission = {
      PERM_SYSTEM_LOGIN: 1,                 // Вход в систему
      PERM_MODULE_VIEW: 2,                  // Просмотр модуля
      PERM_MODULE_MANAGEMENT: 3,            // Просмотр модуля
      PERM_DEVICE_VIEW: 1024,               // Просмотр устройства
      PERM_DEVICE_MANAGEMENT: 1025,         // Управление настройками устройства
      PERM_DEVICE_COMMAND: 1026,            // Послание команды устройству
      PERM_ORGANIZATIONS_VIEW: 2048,        // Просмотр организации
      PERM_ORGANIZATIONS_MANAGEMENT: 2049,  // Добавление/изменение/удаление организации
      PERM_DEPARTMENTS_VIEW: 3072,          // Просмотр отделов
      PERM_DEPARTMENTS_MANAGEMENT: 3073,    // Добавление/изменение/удаление отделов
      PERM_PERSONNELS_VIEW: 4096,           // Просмотр персонала
      PERM_PERSONNELS_MANAGEMENT: 4097,     // Добавление/изменение/удаление персонала
      PERM_ZONES_VIEW: 5120,                // Просмотр зон
      PERM_ZONES_MANAGEMENT: 5121,          // Добавление/изменение/удаление зоны
      PERM_USERS_VIEW: 6144,                // Просмотр пользователей
      PERM_USERS_MANAGEMENT: 6145,          // Добавление/изменение/удаление пользователей
      PERM_FULL_ACCESS: 4294967295          // Все привилегии - полный доступ
    };
    
    return new function() {
      let user = null, permissionObjects = {};

      // Загрузка объекта для одной привилегии
      function loadPermissionObject(permissionId) {
        AuthDao.getPermissionObjects(
          {
            userId: user.id,
            id: permissionId 
          },
          function(responseData) {
            permissionObjects[permissionId] = responseData;
            Log.info('Объекты привилегий успешно загружены');
          },
          function() {
            Log.error('Ошибка загрузки объектов действия привилегии');
          }
        );        
      }
      
      // Загрузка расширенных привилегий
      function loadpermissionObjects(permissions) {
        if (permissions) { 
          for (let i = 0; i < permissions.length; i++) {
            switch (permissions[i]) {
            case Permission.PERM_MODULE_VIEW:
            case Permission.PERM_MODULE_MANAGEMENT:
            case Permission.PERM_DEVICE_VIEW:
            case Permission.PERM_DEVICE_MANAGEMENT:
            case Permission.PERM_DEVICE_COMMAND:
              loadPermissionObject(permissions[i]);
            }
          }
        }
      }
      
      this.Permission = Permission;
      
      this.login = function(params, onSuccess, onError) {
        AuthDao.login(
          params, 
          function(res) {
            if (res.status === 'error') {
              onError ? onError('Authentication Failed') : 0;
              return;
            }
            user = res.response;
            loadpermissionObjects(user.permissions);
            History.replaceState(null, '/?');
            Log.info('Аутентификация прошла успешно!');
            onSuccess ? onSuccess() : 0            
          },
          function() {
            Log.error('Ошибка аутентификации');
            onError ? onError('Authentication Failed') : 0;
          }
        );
      };

      this.logout = function() {
        AuthDao.logout(
          {},
          function(res) {
            user = null;
            Log.info('Выход из системы прошёл успешно');
            location.reload();            
          },
          function() {
            Log.error('Ошибка выхода из системы');
          }
        );
      };

      this.isAuthorized = function(clb) {
        if (user === null) {
          AuthDao.getUser(
            {},
            function(data) {
              user = data.response;
              Log.info('Профиль успешно загружен');
              loadpermissionObjects(user.permissions);
              clb(true);
            },
            function() {
              Log.error('Ошибка аутентификации');
              clb(false);
            }
          );
        } else {
          clb(true);
        } 
      };
      
      this.hasPermission = function(permission) {
        return (user.permissions.indexOf(Permission.PERM_FULL_ACCESS) !== -1) || (user.permissions.indexOf(permission) !== -1);  
      };
      
      this.canViewModule = function(moduleName) {
        return this.hasPermission(Permission.PERM_MODULE_VIEW) && permissionObjects[Permission.PERM_MODULE_VIEW] && (permissionObjects[Permission.PERM_MODULE_VIEW].indexOf(moduleName) !== -1);
      };
      
      this.canManageModule = function(moduleName) {
        return this.hasPermission(Permission.PERM_MODULE_MANAGEMENT) && permissionObjects[Permission.PERM_MODULE_MANAGEMENT] && (permissionObjects[Permission.PERM_MODULE_MANAGEMENT].indexOf(moduleName) !== -1);
      };
      
      this.canViewPage = function(pageName) {
        switch (pageName) {
        case 21: // Персонал
          return this.hasPermission(Permission.PERM_PERSONNELS_VIEW);
        case 22: // Отделы
          return this.hasPermission(Permission.PERM_DEPARTMENTS_VIEW);
        case 23: // Организации
          return this.hasPermission(Permission.PERM_ORGANIZATIONS_VIEW);
        case 41: // Зоны
          return this.hasPermission(Permission.PERM_ZONES_VIEW);
        case 2: // Пользователи
          return this.hasPermission(Permission.PERM_USERS_VIEW);
        }
        return true;
      };
      
      this.canViewDevice = function(deviceId) {
        return (user.permissions.indexOf(Permission.PERM_FULL_ACCESS) !== -1) || (this.hasPermission(Permission.PERM_DEVICE_VIEW) && permissionObjects[Permission.PERM_DEVICE_VIEW] && (permissionObjects[Permission.PERM_DEVICE_VIEW].indexOf(deviceId) !== -1));
      };
      
      this.canManageDevice = function(deviceId) {
        return (user.permissions.indexOf(Permission.PERM_FULL_ACCESS) !== -1) || (this.hasPermission(Permission.PERM_DEVICE_MANAGEMENT) && permissionObjects[Permission.PERM_DEVICE_MANAGEMENT] && (permissionObjects[Permission.PERM_DEVICE_MANAGEMENT].indexOf(deviceId) !== -1));
      };

      this.canCommandDevice = function(deviceId) {
        return (user.permissions.indexOf(Permission.PERM_FULL_ACCESS) !== -1) || (this.hasPermission(Permission.PERM_DEVICE_COMMAND) && permissionObjects[Permission.PERM_DEVICE_COMMAND] && (permissionObjects[Permission.PERM_DEVICE_COMMAND].indexOf(deviceId) !== -1));
      };
      
      this.getUser = function() {
        return user;
      };
    }
  }
);
