/**
 * Представление для дверного контроллера
 */

'use strict';

define(['jquery', 'react', 'react-dom', 'objects', 'utils/utils', 'core/socket', 'dao/core', 'core/auth'], function ($, React, ReactDOM, Objects, Utils, Socket, CoreDao, Auth) {
  let VIEW_MODE_LONG = 1,
      VIEW_MODE_SHORT = 2,
      VIEW_MODE_TABLE = 3;

  return React.createClass({
    getInitialState: function () {
      return {
        checked: true,
        account: Objects.clone(Objects.Account),
        refreshTimer: null
      };
    },
    componentWillReceiveProps: function (newProps) {
      let self = this;

      if (newProps.event && newProps.event.event && newProps.event.event.deviceId === self.props.data.id) {
        // Если уже была установлена картинка - сбрасываем таймаут очистки
        if (self.state.refreshTimer) {
          clearTimeout(self.state.refreshTimer);
        }

        if (newProps.event.event.type.name === Socket.EVENT_INOUT_TIMEOUT) {
          self.setState({
            account: Objects.clone(Objects.Account),
            refreshTimer: null
          });
          return;
        }

        // Устанавливаем новый таймаут очистки
        let refreshTimer = setTimeout(function () {
          clearTimeout(self.state.refreshTimer);
          self.setState({
            account: Objects.clone(Objects.Account),
            refreshTimer: null
          });
        }, 5000);

        let account = newProps.event.data.account;
        if (!account) {
          account = Objects.clone(Objects.Account);
        }

        this.setState({ account: account, refreshTimer: refreshTimer });
      }
    },
    onClick: function (ev) {
      let self = this;

      if (!self.state.checked || !Auth.canCommandDevice(self.props.data.id)) {
        return;
      }

      let params = {
        deviceId: self.props.data.id,
        commandId: 'setDoorControllerState',
        params: {
          state: +$(ev.currentTarget).attr('data-type')
        }
      };

      CoreDao.sendCommand(params);
    },
    onChange: function (ev) {
      let self = this;

      if (!Auth.canCommandDevice(self.props.data.id)) {
        return;
      }

      this.setState({ checked: !this.state.checked }, function () {
        self.props.onChange({ id: self.props.data.id, checked: self.state.checked });
      });
    },
    render: function () {
      let doorControllerCheckboxClassName = 'btn-turnstiles btn-device-enabled ' + (this.state.checked ? 'checked' : '');

      let zoneA = Utils.findById(this.props.zones, this.props.data.access.zoneAId) || { name: '' },
          zoneB = Utils.findById(this.props.zones, this.props.data.access.zoneBId) || { name: '' };

      if (this.props.mode === VIEW_MODE_TABLE) {
        let btnUnsecuredClassName = 'btn-turnstiles btn-door-controller-unsecured' + (this.state.checked ? '' : ' disabled') + (this.props.data.device.mode === 11 ? ' checked' : ''),
            btnSecuredClassName = 'btn-turnstiles btn-door-controller-secured' + (this.state.checked ? '' : ' disabled') + (this.props.data.device.mode === 12 ? ' checked' : ''),
            btnRoleSecuredClassName = 'btn-turnstiles btn-door-controller-role-secured' + (this.state.checked ? '' : ' disabled') + (this.props.data.device.mode === 13 ? ' checked' : '');

        if (!Auth.canCommandDevice(this.props.data.id)) {
          btnUnsecuredClassName += ' button-disabled';
          btnSecuredClassName += ' button-disabled';
          btnRoleSecuredClassName += ' button-disabled';
          doorControllerCheckboxClassName += ' button-disabled';
        }

        return React.createElement(
          'tr',
          null,
          React.createElement('td', null),
          React.createElement(
            'td',
            null,
            React.createElement(
              'div',
              { className: 'halign' },
              React.createElement('div', { className: doorControllerCheckboxClassName, onClick: this.onChange })
            )
          ),
          React.createElement(
            'td',
            null,
            this.props.data.name
          ),
          React.createElement(
            'td',
            null,
            zoneA.name
          ),
          React.createElement(
            'td',
            null,
            zoneB.name
          ),
          React.createElement(
            'td',
            null,
            React.createElement('div', { className: btnUnsecuredClassName, 'data-type': 0, onClick: this.onClick }),
            React.createElement('div', { className: btnSecuredClassName, 'data-type': 1, onClick: this.onClick }),
            React.createElement('div', { className: btnRoleSecuredClassName, 'data-type': 2, onClick: this.onClick })
          )
        );
      }

      let btnUnsecuredClassName = 'btn-turnstiles2 btn-door-controller-unsecured' + (this.state.checked ? '' : ' disabled') + (this.props.data.device.mode === 11 ? ' checked' : ''),
          btnSecuredClassName = 'btn-turnstiles2 btn-door-controller-secured' + (this.state.checked ? '' : ' disabled') + (this.props.data.device.mode === 12 ? ' checked' : ''),
          btnRoleSecuredClassName = 'btn-turnstiles2 btn-door-controller-role-secured' + (this.state.checked ? '' : ' disabled') + (this.props.data.device.mode === 13 ? ' checked' : '');

      if (!Auth.canCommandDevice(this.props.data.id)) {
        btnUnsecuredClassName += ' button-disabled';
        btnSecuredClassName += ' button-disabled';
        btnRoleSecuredClassName += ' button-disabled';
        doorControllerCheckboxClassName += ' button-disabled';
      }

      let avatarWrapperClassName = 'ui-device-avatar-wrapper' + (this.props.mode === VIEW_MODE_SHORT ? ' no-display' : '');

      let accountData = null;
      if (this.state.account.id) {
        accountData = React.createElement(
          'div',
          { className: 'ui-device-account' },
          this.state.account.lastName,
          ' ',
          this.state.account.firstName,
          ' ',
          this.state.account.middleName
        );
      }

      return React.createElement(
        'div',
        { className: 'ui-device' },
        React.createElement(
          'div',
          { className: 'ui-device-header' },
          React.createElement(
            'div',
            { className: 'ui-device-type' },
            'D',
            this.props.data.device.idx
          ),
          React.createElement(
            'div',
            { className: 'ui-device-description' },
            this.props.data.description
          ),
          React.createElement('div', { className: 'ui-device-checkbox ' + doorControllerCheckboxClassName, onClick: this.onChange })
        ),
        React.createElement(
          'div',
          { className: avatarWrapperClassName },
          React.createElement('img', { className: 'ui-device-avatar', src: this.state.account.avatar }),
          accountData
        ),
        React.createElement(
          'div',
          { className: 'ui-device-controls' },
          React.createElement(
            'div',
            { className: btnUnsecuredClassName, 'data-type': 11, onClick: this.onClick },
            React.createElement(
              'div',
              { className: 'popup' },
              '\u041F\u0440\u043E\u0445\u043E\u0434 \u043F\u043E \u043A\u0430\u0440\u0442\u0435'
            )
          ),
          React.createElement(
            'div',
            { className: btnSecuredClassName, 'data-type': 12, onClick: this.onClick },
            React.createElement(
              'div',
              { className: 'popup' },
              '\u041F\u0440\u043E\u0445\u043E\u0434 \u043F\u043E BLOCK-\u043A\u0430\u0440\u0442\u0435'
            )
          ),
          React.createElement(
            'div',
            { className: btnRoleSecuredClassName, 'data-type': 13, onClick: this.onClick },
            React.createElement(
              'div',
              { className: 'popup' },
              '\u0421\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0439 \u043F\u0440\u043E\u0445\u043E\u0434'
            )
          )
        )
      );
    }
  });
});