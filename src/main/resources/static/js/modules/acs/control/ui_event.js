/**
 * Элемент консоли с описанием прохода
 */

'use strict';

define(['react', 'react-dom', 'utils/time', 'utils/utils', 'core/socket'], function (React, ReactDOM, Time, Utils, Socket) {
  function getTypeLiterByTypeId(typeId) {
    switch (typeId) {
      case 1:
        return 'T';
      case 6:
        return 'A';
      case 7:
        return 'D';
    }

    return '';
  }

  return React.createClass({
    eventToField: function (event) {
      let device = Utils.findById(this.props.devices, +event.event.deviceId) || { name: '' };

      if (event.event.type.name === Socket.EVENT_INOUT) {
        if (event.data.direction === 1) {
          return React.createElement(
            'div',
            { className: 'event-type' },
            React.createElement('div', { className: 'in' }),
            React.createElement(
              'div',
              { className: 'device-name' },
              getTypeLiterByTypeId(device.connection.typeId) + (device.device.idx || '')
            )
          );
        } else if (event.data.direction === 2) {
          return React.createElement(
            'div',
            { className: 'event-type' },
            React.createElement('div', { className: 'out' }),
            React.createElement(
              'div',
              { className: 'device-name' },
              getTypeLiterByTypeId(device.connection.typeId) + (device.device.idx || '')
            )
          );
        }
      } else if (event.event.type.name === Socket.EVENT_INOUT_TIMEOUT) {
        if (event.data.direction === 1) {
          return React.createElement(
            'div',
            { className: 'event-type' },
            React.createElement('div', { className: 'in' }),
            React.createElement(
              'div',
              { className: 'device-name' },
              getTypeLiterByTypeId(device.connection.typeId) + (device.device.idx || '')
            )
          );
        } else if (event.data.direction === 2) {
          return React.createElement(
            'div',
            { className: 'event-type' },
            React.createElement('div', { className: 'out' }),
            React.createElement(
              'div',
              { className: 'device-name' },
              getTypeLiterByTypeId(device.connection.typeId) + (device.device.idx || '')
            )
          );
        }
      }

      return '';
    },
    render: function () {
      try {
        let account = this.props.data.data.account,
            name = account.id ? account.lastName + ' ' + account.firstName + ' ' + account.middleName : 'Временный пропуск №' + this.props.data.data.cardNumber,
            event = this.eventToField(this.props.data),
            time = Time.format('HHMMSSDDMMYYYY', this.props.data.event.datetime).split(' ');

        return React.createElement(
          'div',
          { className: 'inout-console-item' },
          React.createElement(
            'div',
            { className: 'inout-console-item-avatar' },
            React.createElement('img', { src: account.avatar })
          ),
          React.createElement(
            'div',
            { className: 'inout-console-item-content' },
            event,
            time[0],
            ' ',
            React.createElement(
              'span',
              { className: 'date' },
              time[1]
            ),
            React.createElement('br', null),
            name,
            React.createElement('br', null),
            React.createElement(
              'div',
              { className: 'owner' },
              this.props.data.data.owner
            ),
            React.createElement(
              'div',
              { className: 'details', hidden: true },
              this.props.departmentName
            ),
            React.createElement(
              'div',
              { className: 'details' },
              account.position
            )
          )
        );
      } catch (e) {}

      return null;
    }
  });
});