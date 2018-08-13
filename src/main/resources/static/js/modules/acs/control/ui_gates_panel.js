/**
 * Панель для отображения калиток
 */

'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'core/events', './ui_gate'], function (React, ReactDOM, Elements, Events, UIGate) {
  return React.createClass({
    render: function () {
      let self = this;

      let data = {
        id: 'gatesPanel',
        open: true,
        iconClassName: 'icon-panel-gates',
        //title: 'Секции "Антипаника"',
        menuData: {
          items: [{
            render: function () {
              return React.createElement(
                'div',
                { className: 'checked' },
                '\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u043E'
              );
            },
            onClick: function () {
              Events.dispatchEvent(Elements.EVENT_PANEL_EXPAND, { id: 'gatesPanel' });
            }
          }]
        }
      };

      let gates = self.props.data.devices.filter(function (el, idx) {
        return +el.connection.typeId === 6;
      }).map(function (el, idx) {
        return React.createElement(UIGate, {
          key: idx,
          data: el,
          zones: self.props.zones,
          onChange: self.props.data.onChange,
          event: self.props.event });
      });

      return React.createElement(
        Elements.Panel,
        { className: this.props.className + ' panel-gates', data: data },
        gates
      );
    }
  });
});