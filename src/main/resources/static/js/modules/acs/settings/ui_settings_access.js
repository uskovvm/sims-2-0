'use strict';

define(['react', 'react-dom', 'ui/ui_elements'], function (React, ReactDOM, Elements) {
  return React.createClass({
    render: function () {
      let zones = this.props.zones.slice();
      zones.unshift({
        id: 0,
        name: 'Не выбрано'
      });

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'header2b' },
          '\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0437\u043E\u043D\u044B'
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col l6 m6 s12' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0412\u043D\u0435\u0448\u043D\u044F\u044F \u0437\u043E\u043D\u0430'
            ),
            React.createElement(Elements.Select, { position: 'bottom', className: 'with-element-width', values: zones, selectedValue: this.props.selectedDevice.access.zoneAId, onChange: this.props.onChangeZoneA }),
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0422\u0438\u043F \u0434\u043E\u0441\u0442\u0443\u043F\u0430'
            ),
            React.createElement(Elements.AccessChooser, { position: 'bottom', className: 'with-element-width', value: this.props.selectedDevice.access ? this.props.selectedDevice.access.accessModeAB : 0, onChange: this.props.onChangeAccessModeAB })
          ),
          React.createElement(
            'div',
            { className: 'col l6 m6 s12' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u044F\u044F \u0437\u043E\u043D\u0430'
            ),
            React.createElement(Elements.Select, { position: 'bottom', className: 'with-element-width', values: zones, selectedValue: this.props.selectedDevice.access.zoneBId, onChange: this.props.onChangeZoneB }),
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0422\u0438\u043F \u0434\u043E\u0441\u0442\u0443\u043F\u0430'
            ),
            React.createElement(Elements.AccessChooser, { position: 'bottom', className: 'with-element-width', value: this.props.selectedDevice.access.accessModeBA, onChange: this.props.onChangeAccessModeBA })
          )
        )
      );
    }
  });
});