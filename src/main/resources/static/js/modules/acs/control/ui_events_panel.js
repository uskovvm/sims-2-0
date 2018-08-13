/**
 * Конcоль с информацией о проходах
 */

'use strict';

define(['react', 'react-dom', 'utils/utils', 'ui/ui_elements', './ui_event'], function (React, ReactDOM, Utils, Elements, UIEvent) {
  return React.createClass({
    render: function () {
      let self = this;

      let filters = this.props.data.filters;

      let events = this.props.data.events.filter(function (el, idx) {
        return true;
        //return filters.indexOf(+el.event.deviceId) !== -1;
      }).map(function (el, idx) {
        let department = Utils.findById(self.props.data.departments, el.data.account.departmentId);
        return React.createElement(UIEvent, { key: idx, data: el, departmentName: department ? department.name : '', devices: self.props.data.devices });
      });

      if (!events.length) {
        events = React.createElement(
          'div',
          { className: 'inout-console-item calign' },
          '\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445'
        );
      }

      let data = {
        open: true,
        iconClassName: 'icon-panel-events' /*,
                                           title: 'События СКУД'*/
      };

      return React.createElement(
        Elements.Panel,
        { className: this.props.className, data: data },
        events
      );
    }
  });
});