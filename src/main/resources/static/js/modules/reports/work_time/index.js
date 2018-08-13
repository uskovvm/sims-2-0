'use strict';

define(['react', 'react-dom', '../ui/ui_control_panel', './ui_inouts', './ui_work_time', './ui_traffic'], function (React, ReactDOM, ControlPanel, InOuts, WorkTime, Traffic) {
  let reports = [{
    id: 21,
    name: 'Табель рабочего времени'
  }, {
    id: 22,
    name: 'Приходы и уходы'
  }, {
    id: 23,
    name: 'Присутствие'
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
          { className: className, id: el.id, onClick: self.onChangeTab },
          el.name
        );
      });

      let res = null;

      switch (self.state.selectedReportId) {
        case 21:
          res = React.createElement(WorkTime, null);
          break;
        case 22:
          res = React.createElement(InOuts, null);
          break;
        case 23:
          res = React.createElement(Traffic, null);
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