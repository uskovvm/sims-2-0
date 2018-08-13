'use strict';

define(['react', 'react-dom', '../ui/ui_control_panel', './ui_inouts', './ui_zones'], function (React, ReactDOM, ControlPanel, InOuts, Zones) {
  let reports = [{
    id: 1,
    name: 'Входы/выходы' /*,
                         {
                          id: 2,
                          name: 'Присутствие в зонах доступа'
                         }*/
  }];

  return React.createClass({
    getInitialState: function () {
      return {
        selectedReportId: reports[0].id
      };
    },
    onChangeTab: function (ev) {
      this.setState({ selectedReportId: +ev.currentTarget.id });
    },
    render: function () {
      let self = this;

      let tabs = reports.map(function (el, idx) {
        let className = 'tab' + (el.id === self.state.selectedReportId ? ' selected' : '');
        return React.createElement(
          'div',
          { key: idx, className: className, id: el.id, onClick: self.onChangeTab },
          el.name
        );
      });

      let res = null;

      switch (self.state.selectedReportId) {
        case 1:
          res = React.createElement(InOuts, null);
          break;
        case 2:
          res = React.createElement(Zones, null);
          break;
        default:
          res = null;
      }

      return React.createElement(
        'div',
        { className: 'content-with-control-panel' },
        React.createElement(ControlPanel, null),
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'panel' },
              tabs,
              React.createElement('br', null),
              React.createElement('br', null),
              res
            )
          )
        )
      );
    }
  });
});