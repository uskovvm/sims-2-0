'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    render: function () {
      return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col s12 m6 l6' },
          React.createElement('input', { type: 'checkbox', className: 'filled-in', id: 'broken', checked: this.props.selectedDevice.device.broken, onChange: this.props.onChangeBroken }),
          React.createElement(
            'label',
            { className: 'header3', htmlFor: 'broken' },
            '\u041D\u0435\u0438\u0441\u043F\u0440\u0430\u0432\u043D\u043E'
          ),
          React.createElement('br', null),
          React.createElement('input', { type: 'checkbox', className: 'filled-in', id: 'invert', checked: this.props.selectedDevice.device.invert, onChange: this.props.onChangeInvert }),
          React.createElement(
            'label',
            { className: 'header3', htmlFor: 'invert' },
            '\u0418\u043D\u0432\u0435\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C'
          ),
          React.createElement('br', null),
          React.createElement('input', { type: 'checkbox', className: 'filled-in', id: 'cardAutoreg', checked: this.props.selectedDevice.device.cardAutoreg, onChange: this.props.onChangeCardAutoreg }),
          React.createElement(
            'label',
            { className: 'header3', htmlFor: 'cardAutoreg' },
            '\u0410\u0432\u0442\u043E\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043A\u0430\u0440\u0442'
          )
        ),
        React.createElement(
          'div',
          { className: 'col s12 m6 l6' },
          React.createElement(
            'div',
            { className: 'header3' },
            '\u041A\u0430\u043D\u0430\u043B \u0442\u0430\u0439\u043C\u0435\u0440\u0430 \u0440\u0435\u043B\u0435:'
          ),
          React.createElement('input', { className: 'with-element-width', type: 'text', value: this.props.selectedDevice.device.wdtChannel, onChange: this.props.onChangeWdtChannel }),
          React.createElement('br', null)
        )
      );
    }
  });
});