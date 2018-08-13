'use strict';

define(['react', 'react-dom', 'utils/time'], function (React, ReactDOM, Time) {
  return React.createClass({
    getInitialState: function () {
      return {
        tmpSchedule: {
          startTime: Time.formatTime(this.props.schedule.startTime),
          finishTime: Time.formatTime(this.props.schedule.finishTime),
          lunchStartTime: Time.formatTime(this.props.schedule.lunchStartTime),
          lunchFinishTime: Time.formatTime(this.props.schedule.lunchFinishTime),
          halfHolidayFinishTime: Time.formatTime(this.props.schedule.halfHolidayFinishTime)
        }
      };
    },
    componentWillReceiveProps: function (newProps) {
      this.setState({
        tmpSchedule: {
          startTime: Time.formatTime(newProps.schedule.startTime),
          finishTime: Time.formatTime(newProps.schedule.finishTime),
          lunchStartTime: Time.formatTime(newProps.schedule.lunchStartTime),
          lunchFinishTime: Time.formatTime(newProps.schedule.lunchFinishTime),
          halfHolidayFinishTime: Time.formatTime(newProps.schedule.halfHolidayFinishTime)
        }
      });
    },
    onChangeStartTime: function (ev) {
      let tmpSchedule = this.state.tmpSchedule,
          schedule = this.props.schedule;
      tmpSchedule.startTime = ev.currentTarget.value;

      let res = tmpSchedule.startTime.match(Time.TIME_REGEXP);
      if (res) {
        schedule.startTime = Time.parseTime(res[0]);
        this.props.onChange(schedule);
      }

      this.setState({ tmpSchedule: tmpSchedule });
    },
    onChangeFinishTime: function (ev) {
      let tmpSchedule = this.state.tmpSchedule,
          schedule = this.props.schedule;
      tmpSchedule.finishTime = ev.currentTarget.value;

      let res = tmpSchedule.finishTime.match(Time.TIME_REGEXP);
      if (res) {
        schedule.finishTime = Time.parseTime(res[0]);
        this.props.onChange(schedule);
      }

      this.setState({ tmpSchedule: tmpSchedule });
    },
    onChangeLunchStartTime: function (ev) {
      let tmpSchedule = this.state.tmpSchedule,
          schedule = this.props.schedule;
      tmpSchedule.lunchStartTime = ev.currentTarget.value;

      let res = tmpSchedule.lunchStartTime.match(Time.TIME_REGEXP);
      if (res) {
        schedule.lunchStartTime = Time.parseTime(res[0]);
        this.props.onChange(schedule);
      }

      this.setState({ tmpSchedule: tmpSchedule });
    },
    onChangeLunchFinishTime: function (ev) {
      let tmpSchedule = this.state.tmpSchedule,
          schedule = this.props.schedule;
      tmpSchedule.lunchFinishTime = ev.currentTarget.value;

      let res = tmpSchedule.lunchFinishTime.match(Time.TIME_REGEXP);
      if (res) {
        schedule.lunchFinishTime = Time.parseTime(res[0]);
        this.props.onChange(schedule);
      }

      this.setState({ tmpSchedule: tmpSchedule });
    },
    onChangeHalfHolidayFinishTime: function (ev) {
      let tmpSchedule = this.state.tmpSchedule,
          schedule = this.props.schedule;
      tmpSchedule.halfHolidayFinishTime = ev.currentTarget.value;

      let res = tmpSchedule.halfHolidayFinishTime.match(Time.TIME_REGEXP);
      if (res) {
        schedule.halfHolidayFinishTime = Time.parseTime(res[0]);
        this.props.onChange(schedule);
      }

      this.setState({ tmpSchedule: tmpSchedule });
    },
    onChangeEarlyArrivalTime: function (ev) {
      let schedule = this.props.schedule;
      schedule.earlyArrivalTime = ev.currentTarget.value;
      this.props.onChange(schedule);
    },
    onChangeLatenessTime: function (ev) {
      let schedule = this.props.schedule;
      schedule.latenessTime = ev.currentTarget.value;
      this.props.onChange(schedule);
    },
    onChangeEarlyDepartureTime: function (ev) {
      let schedule = this.props.schedule;
      schedule.earlyDepartureTime = ev.currentTarget.value;
      this.props.onChange(schedule);
    },
    onChangeLateDepartureTime: function (ev) {
      let schedule = this.props.schedule;
      schedule.lateDepartureTime = ev.currentTarget.value;
      this.props.onChange(schedule);
    },
    onChangeAbsenceTime: function (ev) {
      let schedule = this.props.schedule;
      schedule.absenceTime = ev.currentTarget.value;
      this.props.onChange(schedule);
    },
    render: function () {
      return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col m6 l6 s6' },
          React.createElement(
            'table',
            null,
            React.createElement(
              'tbody',
              null,
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u041D\u0430\u0447\u0430\u043B\u043E \u0440\u0430\u0431\u043E\u0442\u044B'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'time', pattern: Time.TIME_REGEXP, value: this.state.tmpSchedule.startTime, onChange: this.onChangeStartTime })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u041E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 \u0440\u0430\u0431\u043E\u0442\u044B'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'time', pattern: Time.TIME_REGEXP, value: this.state.tmpSchedule.finishTime, onChange: this.onChangeFinishTime })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u041D\u0430\u0447\u0430\u043B\u043E \u043F\u0435\u0440\u0435\u0440\u044B\u0432\u0430'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'time', pattern: Time.TIME_REGEXP, value: this.state.tmpSchedule.lunchStartTime, onChange: this.onChangeLunchStartTime })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u041E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u0440\u044B\u0432\u0430'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'time', pattern: Time.TIME_REGEXP, value: this.state.tmpSchedule.lunchFinishTime, onChange: this.onChangeLunchFinishTime })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u041E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 \u0441\u043E\u043A\u0440\u0430\u0449\u0451\u043D\u043D\u043E\u0433\u043E \u0434\u043D\u044F'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'time', pattern: Time.TIME_REGEXP, value: this.state.tmpSchedule.halfHolidayFinishTime, onChange: this.onChangeHalfHolidayFinishTime })
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col m6 l6 s6' },
          React.createElement(
            'table',
            null,
            React.createElement(
              'tbody',
              null,
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u0420\u0430\u043D\u043D\u0438\u0439 \u043F\u0440\u0438\u0445\u043E\u0434'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'number', min: '0', value: this.props.schedule.earlyArrivalTime, onChange: this.onChangeEarlyArrivalTime })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u041E\u043F\u043E\u0437\u0434\u0430\u043D\u0438\u0435'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'number', min: '0', value: this.props.schedule.latenessTime, onChange: this.onChangeLatenessTime })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u0420\u0430\u043D\u043D\u0438\u0439 \u0443\u0445\u043E\u0434'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'number', min: '0', value: this.props.schedule.earlyDepartureTime, onChange: this.onChangeEarlyDepartureTime })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u041F\u043E\u0437\u0434\u043D\u0438\u0439 \u0443\u0445\u043E\u0434'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'number', min: '0', value: this.props.schedule.lateDepartureTime, onChange: this.onChangeLateDepartureTime })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u0435'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'number', min: '0', value: this.props.schedule.absenceTime, onChange: this.onChangeAbsenceTime })
                )
              )
            )
          )
        )
      );
    }
  });
});