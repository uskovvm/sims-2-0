'use strict';

define(['jquery', 'react', 'react-dom', 'objects', 'ui/ui_elements'], function ($, React, ReactDOM, Objects, Elements) {
  return React.createClass({
    getInitialState: function () {
      return {
        schedule: this.props.data ? Objects.clone(this.props.data) : []
      };
    },
    componentWillReceiveProp: function (newProps) {
      this.setState({
        schedule: newProps.data ? newProps.data : []
      });
    },
    onChangeDay: function (ev) {
      let arr = {
        mon: 0,
        tue: 1,
        wed: 2,
        thu: 3,
        fri: 4,
        sat: 5,
        sun: 6
      };

      let el = $(ev.currentTarget);
      let idxX = arr[el.attr('id').substr(0, 3)],
          idxY = +el.attr('id').substr(3);

      let schedule = this.state.schedule;
      schedule[idxY].days[idxX] = ev.currentTarget.checked ? 1 : 0;
      this.setState({ schedule: schedule }, this.onChange);
    },
    onChangeStartTime: function (data) {
      let idx = +data.id.substr('start'.length);
      let schedule = this.state.schedule;
      schedule[idx].startTime = +data.value;
      this.setState({ schedule: schedule }, this.onChange);
    },
    onChangeEndTime: function (data) {
      let idx = +data.id.substr('end'.length);
      let schedule = this.state.schedule;
      schedule[idx].endTime = +data.value;
      this.setState({ schedule: schedule }, this.onChange);
    },
    onDeleteRow: function (ev) {
      let idx = +$(ev.currentTarget).attr('data-id');
      let schedule = this.state.schedule;
      schedule.splice(idx, 1);
      this.setState({ schedule: schedule }, this.onChange);
    },
    onAddRow: function () {
      let schedule = this.state.schedule;
      let item = Objects.clone(Objects.WeekSchedule);
      item.endTime = 23 * 60 + 59;
      schedule.push(item);
      this.setState({ schedule: schedule }, this.onChange);
    },
    onChange: function () {
      this.props.onChange(this.state.schedule);
    },
    render: function () {
      let self = this;

      let days = self.state.schedule.map(function (el, idx) {
        let startTimeConfig = {
          id: 'start' + idx,
          value: el.startTime,
          onChange: self.onChangeStartTime
        };

        let endTimeConfig = {
          id: 'end' + idx,
          value: el.endTime,
          onChange: self.onChangeEndTime
        };

        return React.createElement(
          'tr',
          { key: idx },
          React.createElement(
            'td',
            null,
            idx + 1
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', { className: 'filled-in', id: 'mon' + idx, type: 'checkbox', checked: el.days[0], onChange: self.onChangeDay }),
            React.createElement('label', { htmlFor: 'mon' + idx })
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', { className: 'filled-in', id: 'tue' + idx, type: 'checkbox', checked: el.days[1], onChange: self.onChangeDay }),
            React.createElement('label', { htmlFor: 'tue' + idx })
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', { className: 'filled-in', id: 'wed' + idx, type: 'checkbox', checked: el.days[2], onChange: self.onChangeDay }),
            React.createElement('label', { htmlFor: 'wed' + idx })
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', { className: 'filled-in', id: 'thu' + idx, type: 'checkbox', checked: el.days[3], onChange: self.onChangeDay }),
            React.createElement('label', { htmlFor: 'thu' + idx })
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', { className: 'filled-in', id: 'fri' + idx, type: 'checkbox', checked: el.days[4], onChange: self.onChangeDay }),
            React.createElement('label', { htmlFor: 'fri' + idx })
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', { className: 'filled-in', id: 'sat' + idx, type: 'checkbox', checked: el.days[5], onChange: self.onChangeDay }),
            React.createElement('label', { htmlFor: 'sat' + idx })
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', { className: 'filled-in', id: 'sun' + idx, type: 'checkbox', checked: el.days[6], onChange: self.onChangeDay }),
            React.createElement('label', { htmlFor: 'sun' + idx })
          ),
          React.createElement(
            'td',
            null,
            React.createElement(Elements.Time, { data: startTimeConfig })
          ),
          React.createElement(
            'td',
            null,
            React.createElement(Elements.Time, { data: endTimeConfig })
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', { className: 'btn', type: 'button', value: 'X', 'data-id': idx, onClick: self.onDeleteRow })
          )
        );
      });

      return React.createElement(
        'div',
        null,
        React.createElement(
          'table',
          null,
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement('th', null),
              React.createElement(
                'th',
                null,
                '\u041F\u041D'
              ),
              React.createElement(
                'th',
                null,
                '\u0412\u0422'
              ),
              React.createElement(
                'th',
                null,
                '\u0421\u0420'
              ),
              React.createElement(
                'th',
                null,
                '\u0427\u0422'
              ),
              React.createElement(
                'th',
                null,
                '\u041F\u0422'
              ),
              React.createElement(
                'th',
                null,
                '\u0421\u0411'
              ),
              React.createElement(
                'th',
                null,
                '\u0412\u0421'
              ),
              React.createElement(
                'th',
                null,
                '\u0421'
              ),
              React.createElement(
                'th',
                null,
                '\u041F\u041E'
              ),
              React.createElement('th', null)
            )
          ),
          React.createElement(
            'tbody',
            null,
            days
          )
        ),
        React.createElement('input', { className: 'btn', type: 'button', value: '+\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C', onClick: self.onAddRow })
      );
    }
  });
});