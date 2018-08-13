'use strict';

define(['jquery', 'react', 'react-dom', 'dao/core', 'core/logger', 'dao/organizations', 'dao/departments', 'dao/accounts'], function ($, React, ReactDOM, CoreDao, Log, OrganizationsDao, DepartmentsDao, AccountsDao) {
  return React.createClass({
    getInitialState: function () {
      return {
        version: {
          db: '0.0.0'
        },
        integrationBitrix: false,
        integration1C: false
      };
    },
    componentDidMount: function () {
      let self = this;

      CoreDao.getVersions({}, function (data) {
        self.setState({ version: data });
      });

      CoreDao.checkIntegrationBitrix({}, function (data) {
        self.setState({ integrationBitrix: data.enabled });
      });

      CoreDao.checkIntegration1C({}, function (data) {
        self.setState({ integration1C: data.enabled });
      });
    },
    onClick: function (ev) {
      CoreDao.sendDBCommand({ id: +$(ev.currentTarget).attr('data-id') });
    },
    onSyncBX: function (ev) {
      Log.info('1С-Битрикс: Получение данных');

      CoreDao.syncBitrix({}, function (res) {
        Log.info('1С-Битрикс: Данные получены');

        let dep = res.departments.result;
        let acc = res.accounts.result;

        if (dep && dep.length > 0) {
          dep.map(function (i) {

            let data = {
              id: i.ID,
              name: i.NAME,
              description: null,
              organizationId: 1,
              dayScheduleTypeId: 1,
              blocked: false
            };

            DepartmentsDao.set(data);
          });
        }

        if (acc && acc.length > 0) {
          acc.map(function (i) {

            let data = {
              id: i.ID,
              id1C: i.ID,
              firsName: i.NAME,
              lastName: i.LAST_NAME,
              middleName: i.SECOND_NAME,
              cardNumber: i.UF_INTERESTS,
              organizationId: 1,
              organizationId1C: 1,
              deleted: false,
              fired: false,
              blocked: false,
              dayScheduleTypeId: 1
            };

            i.UF_DEPARTMENT.map(function (ii) {
              data.departmentId = ii;
              data.departmentId1C = ii;
            });

            AccountsDao.set(data);
            if (i.PERSONAL_PHOTO) {
              let avatar = 'data:image/png;base64,' + '/uploads/' + data.id + '.png';
              AccountsDao.setAvatar({ id: data.id, avatar: avatar });
            }
          });
        }
      }, function (error) {
        Log.error('1С-Битрикс: Ошибка соединения с сервером');
      });
    },
    onSync: function (ev) {
      Log.info('Получение данных из 1С');
      CoreDao.getFrom1C({}, function (res) {
        Log.info('Данные из 1С успешно получены');
        if (res.organizations && res.organizations.length > 0) {
          // promises
          let orgPromises = new Array(res.organizations.length),
              depPromises = new Array(res.departments.length),
              accPromises = new Array(res.accounts.length);

          // 1C to CIMS
          let org = {},
              dep = {};

          // make promises
          for (let i = 0; i < res.organizations.length; i++) {
            orgPromises[i] = new Promise(function (resolve, reject) {
              OrganizationsDao.set(res.organizations[i], resolve, reject);
            });
          }

          // make calls chain
          for (let i = 0; i < res.organizations.length - 1; i++) {
            (function (_i) {
              orgPromises[_i].then(function (_res) {
                org[res.organizations[_i].id1C] = _res.response.id;
                return orgPromises[_i + 1];
              });
            })(i);
          }

          orgPromises[res.organizations.length - 1].then(function (_res) {
            Log.info('Организации синхронизированы');

            org[res.organizations[res.organizations.length - 1].id1C] = _res.response.id;

            for (let i = 0; i < res.departments.length; i++) {
              depPromises[i] = new Promise(function (resolve, reject) {
                let data = res.departments[i];
                data.organizationId = org[data.organizationId1C];
                DepartmentsDao.set(data, resolve, reject);
              });
            }

            for (let i = 0; i < res.departments.length - 1; i++) {
              (function (_i) {
                depPromises[_i].then(function (_res) {
                  dep[res.departments[_i].id1C] = _res.response.id;
                  return depPromises[_i + 1];
                });
              })(i);
            }

            depPromises[res.departments.length - 1].then(function (_res) {
              dep[res.departments[res.departments.length - 1].id1C] = _res.response.id;

              for (let i = 0; i < res.accounts.length; i++) {
                accPromises[i] = new Promise(function (resolve, reject) {
                  let data = res.accounts[i];
                  data.departmentId = dep[data.departmentId1C];
                  data.organizationId = org[data.organizationId1C];
                  AccountsDao.set(data, resolve, reject);
                });
              }

              for (let i = 0; i < res.accounts.length - 1; i++) {
                accPromises[i].then(function (_res) {
                  return accPromises[i + 1];
                });
              }

              accPromises[res.accounts.length - 1].then(function (res) {
                Log.info('Синхронизация завершена');
              });
            });
          }).catch(function () {
            Log.info('Ошибка синхронизации');
          });
        }
      }, function (res) {
        Log.error('Ошибка соединения с 1С');
      });
    },
    render: function () {
      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(
            'div',
            { className: 'panel' },
            React.createElement('input', { type: 'button', className: 'waves-effect waves-light btn with-element-big-width', 'data-id': '1', onClick: this.onClick, value: '\u0412\u043E\u0437\u0432\u0440\u0430\u0442 \u043A \u0437\u0430\u0432\u043E\u0434\u0441\u043A\u0438\u043C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C' }),
            React.createElement('br', null),
            React.createElement('input', { type: 'button', className: 'waves-effect waves-light btn with-element-big-width', 'data-id': '2', onClick: this.onClick, value: '\u0420\u0435\u0437\u0435\u0440\u0432\u043D\u043E\u0435 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435', disabled: true }),
            React.createElement('br', null),
            React.createElement('input', { type: 'button', className: 'waves-effect waves-light btn with-element-big-width', 'data-id': '3', onClick: this.onClick, value: '\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0438\u0437 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u043E\u0439 \u043A\u043E\u043F\u0438\u0438', disabled: true }),
            React.createElement('br', null),
            React.createElement('input', { type: 'button', className: 'waves-effect waves-light btn with-element-big-width', 'data-id': '4', onClick: this.onClick, value: '\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u043E\u0435 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435', disabled: true }),
            React.createElement('br', null),
            this.state.integration1C ? React.createElement('input', { type: 'button', className: 'waves-effect waves-light btn with-element-big-width', 'data-id': '5', onClick: this.onSync, value: '\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F c 1C' }) : null,
            this.state.integrationBitrix ? React.createElement('input', { type: 'button', className: 'waves-effect waves-light btn with-element-big-width', 'data-id': '6', onClick: this.onSyncBX, value: '\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F c \u0411\u0438\u0442\u0440\u0438\u043A\u0441' }) : null
          ),
          React.createElement(
            'div',
            { className: 'panel with-margin-top20' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0412\u0435\u0440\u0441\u0438\u044F \u0411\u0414: ',
              this.state.version.db
            )
          )
        )
      );
    }
  });
});