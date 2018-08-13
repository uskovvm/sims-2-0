/**
 * Представление для турникета
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

        this.setState({ account: newProps.event.data.account || Objects.clone(Objects.Account), refreshTimer: refreshTimer });
      }
    },
    onClick: function (ev) {
      let self = this;

      if (!this.state.checked || !Auth.canCommandDevice(self.props.data.id)) {
        return;
      }

      let params = {
        deviceId: self.props.data.id
      };

      let st = +$(ev.currentTarget).attr('data-type');
      switch (st) {
        case 1:
        case 3:
          params.commandId = !this.props.data.device.directionOpenMask[0] ? 'openOnce' : 'close';
          params.params = {
            direction: 1
          };

          break;

        case 2:
        case 4:
          params.commandId = !this.props.data.device.directionOpenMask[1] ? 'openOnce' : 'close';
          params.params = {
            direction: 2
          };

          break;
      }

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
      let btnInClassName = 'btn-turnstiles1 btn-turnstiles-in' + (this.props.data.device.directionOpenMask[0] ? '' : ' closed') + (this.state.checked ? '' : ' disabled'),
          btnOutClassName = 'btn-turnstiles1 btn-turnstiles-out' + (this.props.data.device.directionOpenMask[1] ? '' : ' closed') + (this.state.checked ? '' : ' disabled'),
          btnInPermanentClassName = 'btn-turnstiles1 btn-turnstiles-in-permanent' + (this.props.data.device.directionOpenMask[0] ? '' : ' closed') + (this.state.checked ? '' : ' disabled'),
          btnOutPermanentClassName = 'btn-turnstiles1 btn-turnstiles-out-permanent' + (this.props.data.device.directionOpenMask[1] ? '' : ' closed') + (this.state.checked ? '' : ' disabled');

      let turnstileCheckboxClassName = 'btn-turnstiles btn-device-enabled ' + (this.state.checked ? 'checked' : '');

      if (!Auth.canCommandDevice(this.props.data.id)) {
        btnInClassName += ' button-disabled';
        btnOutClassName += ' button-disabled';
        btnInPermanentClassName += ' button-disabled';
        btnOutPermanentClassName += ' button-disabled';
        turnstileCheckboxClassName += ' button-disabled';
      }

      let zoneA = Utils.findById(this.props.zones, this.props.data.access.zoneAId) || { name: '' },
          zoneB = Utils.findById(this.props.zones, this.props.data.access.zoneBId) || { name: '' };

      if (this.props.mode === VIEW_MODE_TABLE) {
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
              React.createElement('div', { className: turnstileCheckboxClassName, onClick: this.onChange })
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
            React.createElement('div', { className: btnInClassName, 'data-type': '1', onClick: this.onClick }),
            React.createElement('div', { className: btnOutClassName, 'data-type': '2', onClick: this.onClick }),
            React.createElement('div', { className: btnInPermanentClassName, 'data-type': '3', onClick: this.onClick }),
            React.createElement('div', { className: btnOutPermanentClassName, 'data-type': '4', onClick: this.onClick })
          )
        );
      }

      let avatarWrapperClassName = 'ui-device-avatar-wrapper' + (this.props.mode === VIEW_MODE_SHORT ? ' no-display' : '');

      let accountData = null;
      if (this.state.account && this.state.account.id) {
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
        { className: 'ui-device', ref: 'component' },
        React.createElement(
          'div',
          { className: 'ui-device-header' },
          React.createElement(
            'div',
            { className: 'ui-device-type' },
            'T',
            this.props.data.device.idx
          ),
          React.createElement(
            'div',
            { className: 'ui-device-description' },
            this.props.data.description
          ),
          React.createElement('div', { className: 'ui-device-checkbox ' + turnstileCheckboxClassName, onClick: this.onChange })
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
            { className: btnInClassName, 'data-type': '1', onClick: this.onClick },
            React.createElement(
              'div',
              { className: 'popup' },
              '\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E \u043D\u0430 \u0432\u0445\u043E\u0434'
            )
          ),
          React.createElement(
            'div',
            { className: btnOutClassName, 'data-type': '2', onClick: this.onClick },
            React.createElement(
              'div',
              { className: 'popup' },
              '\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E \u043D\u0430 \u0432\u044B\u0445\u043E\u0434'
            )
          ),
          React.createElement(
            'div',
            { className: btnInPermanentClassName, 'data-type': '3', onClick: this.onClick },
            React.createElement(
              'div',
              { className: 'popup' },
              '\u041E\u0442\u043A\u0440\u044B\u0442\u044C/\u0437\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u043E \u043D\u0430 \u0432\u0445\u043E\u0434'
            )
          ),
          React.createElement(
            'div',
            { className: btnOutPermanentClassName, 'data-type': '4', onClick: this.onClick },
            React.createElement(
              'div',
              { className: 'popup' },
              '\u041E\u0442\u043A\u0440\u044B\u0442\u044C/\u0437\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u043E \u043D\u0430 \u0432\u044B\u0445\u043E\u0434'
            )
          )
        )
      );
    }
  });
});