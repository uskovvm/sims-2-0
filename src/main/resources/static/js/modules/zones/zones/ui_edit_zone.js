'use strict';

define(['react', 'react-dom', 'objects', 'ui/ui_elements', 'dao/calendar', 'ui/ui_week_schedule', 'core/events', 'dao/zones', 'core/logger'], function (React, ReactDOM, Objects, Elements, CalendarDao, WeekSchedule, Events, ZonesDao, Log) {
  return React.createClass({
    getInitialState: function () {
      return {
        zone: Objects.clone(this.props.data.zone),
        schedule: Objects.clone(Objects.Schedule),
        clb1: null,
        clb2: null
      };
    },
    componentDidMount: function () {
      this.setState({
        clb1: Events.addCallback(Events.EVENT_KEY_ENTER, this.onOk),
        clb2: Events.addCallback(Events.EVENT_KEY_ESC, this.onCancel)
      }, this.loadSchedule);
    },
    componentWillUnmount: function () {
      Events.removeCallback(Events.EVENT_KEY_ENTER, this.state.clb1);
      Events.removeCallback(Events.EVENT_KEY_ESC, this.state.clb2);
    },
    loadSchedule: function () {
      let self = this;

      if (self.state.zone.id !== null) {
        CalendarDao.getWeek({ zoneId: self.state.zone.id }, function (data) {
          self.setState({ schedule: data });
        });
      }
    },
    onOk: function () {
      let self = this;
      let zone = self.state.zone;

      ZonesDao.set(zone, function (responseData) {
        CalendarDao.setWeek({ zoneId: zone.id, schedule: self.state.schedule });
        self.props.data.onOk(zone);
        Log.info('Зона успешно изменена');
      }, function () {
        Log.error('Ошибка изменения зоны');
        self.onCancel();
      });
    },
    onCancel: function () {
      this.props.data.onCancel();
    },
    onChangeName: function (ev) {
      let zone = this.state.zone;
      zone.name = ev.currentTarget.value;
      this.setState({ zone: zone });
    },
    onChangeDescription: function (ev) {
      let zone = this.state.zone;
      zone.description = ev.currentTarget.value;
      this.setState({ zone: zone });
    },
    onChangeSinglePass: function (ev) {
      let zone = this.state.zone;
      zone.singlePass = ev.currentTarget.checked;
      this.setState({ zone: zone });
    },
    onChangeSinglePassTimeout: function (ev) {
      let zone = this.state.zone;
      zone.singlePassTimeout = ev.currentTarget.value;
      this.setState({ zone: zone });
    },
    onChangeSchedule: function (schedule) {
      this.setState({ schedule: schedule });
    },
    render: function () {
      let data = [{
        id: 'info',
        name: 'Подробная информация',
        active: true
      }, {
        id: 'access',
        name: 'Управление доступом'
      }];

      let singlePassDiv = null;

      if (this.state.zone.singlePass) {
        singlePassDiv = React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            null,
            '\u0412\u0440\u0435\u043C\u044F \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F, \u043C\u0438\u043D.',
            React.createElement(
              'span',
              { className: 'tooltipped tooltipped-auto', style: { 'text-decoration': 'underline' } },
              '?',
              React.createElement(
                'div',
                { className: 'popup' },
                '"0" \u043E\u0437\u043D\u0430\u0447\u0430\u0435\u0442 "\u0431\u0435\u0437 \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F"'
              )
            )
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', { type: 'number', value: this.state.zone.singlePassTimeout, onChange: this.onChangeSinglePassTimeout })
          )
        );
      }

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'header1' },
          '\u0417\u043E\u043D\u044B \u0434\u043E\u0441\u0442\u0443\u043F\u0430 - [\u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 ',
          this.props.data.zone.name,
          ']'
        ),
        React.createElement(
          'div',
          { className: 'with-margin-bottom10' },
          React.createElement(
            Elements.Tabs,
            { data: data },
            React.createElement(
              'div',
              { id: 'info' },
              React.createElement(
                'table',
                { className: 'zones-table2' },
                React.createElement(
                  'tbody',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u0418\u0414'
                    ),
                    React.createElement(
                      'td',
                      null,
                      this.state.zone.id
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { name: 'name', type: 'text', value: this.state.zone.name, onChange: this.onChangeName })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { name: 'description', type: 'text', value: this.state.zone.description, onChange: this.onChangeDescription })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u044B\u0439 \u043F\u0440\u043E\u0445\u043E\u0434'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { type: 'checkbox', className: 'filled-in', id: 'singlePass', checked: this.state.zone.singlePass, onChange: this.onChangeSinglePass }),
                      React.createElement('label', { className: 'header3', htmlFor: 'singlePass', style: { top: '6px' } })
                    )
                  ),
                  singlePassDiv
                )
              )
            ),
            React.createElement(
              'div',
              { id: 'access' },
              React.createElement(WeekSchedule, { data: this.state.schedule, onChange: this.onChangeSchedule })
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'center-align' },
          React.createElement(
            'div',
            { className: 'waves-effect waves-light btn with-element-width', onClick: this.onOk },
            '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C'
          ),
          React.createElement(
            'div',
            { className: 'waves-effect waves-light btn with-element-width', onClick: this.onCancel },
            '\u041E\u0442\u043C\u0435\u043D\u0430'
          )
        )
      );
    }
  });
});