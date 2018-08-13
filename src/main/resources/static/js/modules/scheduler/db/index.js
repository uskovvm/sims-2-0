'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'dao/scheduler', './ui_control_panel'], function (React, ReactDOM, Elements, SchedulerDao, ControlPanel) {
  return React.createClass({
    getInitialState: function () {
      return {
        time: 0,
        autosave: null
      };
    },
    componentDidMount: function () {
      let self = this;

      SchedulerDao.get({}, function (data) {
        self.setState({ time: data.time });
      });
    },
    onSave: function () {
      SchedulerDao.set({ time: this.state.time });

      this.deleteTimeout();
    },
    onChangeTime: function (value) {
      this.setState({
        time: +value.value
      }, this.updateTimeout);
    },
    updateTimeout: function () {
      if (this.state.autosave !== null) {
        clearTimeout(this.state.autosave);
      }

      this.setState({ autosave: setTimeout(this.onSave, 3000) });
    },
    deleteTimeout: function () {
      clearTimeout(this.state.autosave);
      this.setState({ autosave: null });
    },
    render: function () {
      let data = {
        onClick: this.onSave
      };

      let timeConfig = {
        value: this.state.time,
        onChange: this.onChangeTime
      };

      return React.createElement(
        'div',
        { className: 'content-with-control-panel' },
        React.createElement(ControlPanel, { data: data }),
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'panel' },
              React.createElement(
                'div',
                { className: 'header2' },
                '\u0420\u0435\u0437\u0435\u0440\u0432\u043D\u043E\u0435 \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435'
              ),
              '\u0412\u0440\u0435\u043C\u044F \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438: ',
              React.createElement(Elements.Time, { style: { width: '40px' }, data: timeConfig })
            )
          )
        )
      );
    }
  });
});