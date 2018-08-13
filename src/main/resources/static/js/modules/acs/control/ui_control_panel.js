/**
 * Панель управления
 */

'use strict';

define(['jquery', 'react', 'react-dom', 'ui/ui_elements', 'dao/core'], function ($, React, ReactDOM, Elements, CoreDao) {
  return React.createClass({
    onClick: function (ev) {
      let self = this;
      let params = {};
      let commandType = +$(ev.currentTarget).attr('data-type');
      switch (commandType) {
        case 1:
          params.commandId = 'keepOpen';
          params.params = {
            direction: 1
          };
          break;
        case 2:
          params.commandId = 'keepOpen';
          params.params = {
            direction: 2
          };
          break;
        case 3:
          params.commandId = 'close';
          params.params = {
            direction: 1
          };
          break;
        case 4:
          params.commandId = 'close';
          params.params = {
            direction: 2
          };
          break;
        case 5:
          params.commandId = 'policeAlarm';
          break;
        case 6:
          params.commandId = 'alarm';
          break;
        case 7:
          params.commandId = 'setDoorControllerState';
          params.params = {
            state: 0
          };
          break;
        case 8:
          params.commandId = 'setDoorControllerState';
          params.params = {
            state: 1
          };
          break;
        case 9:
          params.commandId = 'setDoorControllerState';
          params.params = {
            state: 2
          };
          break;
      }

      CoreDao.sendCommand(params);
    },
    render: function () {
      let self = this;

      let openInData = {
        className: 'btn-turnstiles-control-open-in',
        dataType: 1,
        dataTooltip: 'Открыть всё на вход',
        onClick: this.onClick
      };

      let openOutData = {
        className: 'btn-turnstiles-control-open-out',
        dataType: 2,
        dataTooltip: 'Открыть всё на выход',
        onClick: this.onClick
      };

      let closeInData = {
        className: 'btn-turnstiles-control-close-in',
        dataType: 3,
        dataTooltip: 'Закрыть всё на вход',
        onClick: this.onClick
      };

      let closeOutData = {
        className: 'btn-turnstiles-control-close-out',
        dataType: 4,
        dataTooltip: 'Закрыть всё на выход',
        onClick: this.onClick
      };

      let gateData = {
        className: 'btn-turnstiles-control-open-gate',
        dataType: 5,
        dataTooltip: 'Вызвать ЧОП',
        onClick: this.onClick
      };

      let alarmData = {
        className: 'btn-turnstiles-control-alarm',
        dataType: 6,
        dataTooltip: 'Включить сигнализацию',
        onClick: this.onClick
      };

      let unsecuredData = {
        className: 'btn-door-controller-unsecured-global',
        dataType: 7,
        dataTooltip: 'Проход по карте',
        onClick: this.onClick
      };

      let securedData = {
        className: 'btn-door-controller-secured-global',
        dataType: 8,
        dataTooltip: 'Проход по BLOCK-карте',
        onClick: this.onClick
      };

      let roleSecuredData = {
        className: 'btn-door-controller-role-secured-global',
        dataType: 9,
        dataTooltip: 'Свободный проход',
        onClick: this.onClick
      };

      let menuData = {
        items: [{
          render: function () {
            return React.createElement(
              'div',
              { className: self.props.data.showEventsPanel ? 'checked' : '' },
              '\u0421\u043E\u0431\u044B\u0442\u0438\u044F'
            );
          },
          onClick: function () {
            self.props.onChangeView('events', !self.props.data.showEventsPanel);
          }
        }, {
          render: function () {
            return React.createElement(
              'div',
              { className: self.props.data.showTurnstilesPanel ? 'checked' : '' },
              '\u0422\u0443\u0440\u043D\u0438\u043A\u0435\u0442\u044B'
            );
          },
          onClick: function () {
            self.props.onChangeView('turnstiles', !self.props.data.showTurnstilesPanel);
          }
        }, {
          render: function () {
            return React.createElement(
              'div',
              { className: self.props.data.showGatesPanel ? 'checked' : '' },
              '\u0421\u0435\u043A\u0446\u0438\u0438 "\u0410\u043D\u0442\u0438\u043F\u0430\u043D\u0438\u043A\u0430"'
            );
          },
          onClick: function () {
            self.props.onChangeView('gates', !self.props.data.showGatesPanel);
          }
        }, {
          render: function () {
            return React.createElement(
              'div',
              { className: self.props.data.showDoorControllersPanel ? 'checked' : '' },
              '\u0414\u0432\u0435\u0440\u043D\u044B\u0435 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u043B\u0435\u0440\u044B'
            );
          },
          onClick: function () {
            self.props.onChangeView('doorControllers', !self.props.data.showDoorControllersPanel);
          }
        }, {
          render: function () {
            return React.createElement(
              'div',
              { className: self.props.data.showTooltips ? 'checked' : '' },
              '\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438'
            );
          },
          onClick: function () {
            self.props.onChangeView('showTooltips', !self.props.data.showTooltips);
          }
        }]
      };

      return React.createElement(
        'div',
        { className: 'control-panel acs-control-panel' },
        React.createElement(Elements.ControlButton, { data: openInData }),
        React.createElement(Elements.ControlButton, { data: openOutData }),
        React.createElement(Elements.ControlButton, { data: closeInData }),
        React.createElement(Elements.ControlButton, { data: closeOutData }),
        React.createElement('div', { className: 'button-control-divider' }),
        React.createElement(Elements.ControlButton, { data: unsecuredData }),
        React.createElement(Elements.ControlButton, { data: securedData }),
        React.createElement(Elements.ControlButton, { data: roleSecuredData }),
        React.createElement('div', { className: 'button-control-divider' }),
        React.createElement(Elements.ControlButton, { data: alarmData }),
        React.createElement(Elements.ControlButton, { data: gateData }),
        React.createElement(Elements.Menu, { className: 'button-control-panel btn-turnstiles-menu', data: menuData })
      );
    }
  });
});