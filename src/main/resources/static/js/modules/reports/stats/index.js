'use strict';

define(['react', 'react-dom', '../ui/ui_control_panel', './ui_attendance', './ui_discipline'], function (React, ReactDOM, ControlPanel, Attendance, Discipline) {
  let reports = [{
    id: 32,
    name: 'Распорядок дня'
  }, {
    id: 33,
    name: 'Посещаемость и дисциплина'
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
        case 32:
          res = React.createElement(Discipline, null);
          break;
        case 33:
          res = React.createElement(Attendance, null);
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