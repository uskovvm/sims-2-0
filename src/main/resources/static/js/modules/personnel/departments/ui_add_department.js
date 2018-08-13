'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'objects', 'ui/ui_schedule', 'ui/ui_week_schedule_manager', 'core/events', 'dao/departments', 'core/logger', 'dao/calendar', 'dao/zones'], function (React, ReactDOM, Elements, Objects, Schedule, WeekSchedule, Events, DepartmentsDao, Log, CalendarDao, ZonesDao) {
  return React.createClass({
    getInitialState: function () {
      let department = Objects.clone(Objects.Department);
      delete department.id;

      return {
        department: department,
        schedule: Objects.clone(Objects.Schedule),
        acl: Objects.clone(Objects.ACL),
        clb1: null,
        clb2: null
      };
    },
    componentDidMount: function () {
      this.setState({
        clb1: Events.addCallback(Events.EVENT_KEY_ENTER, this.onOk),
        clb2: Events.addCallback(Events.EVENT_KEY_ESC, this.onCancel)
      });
    },
    componentWillUnmount: function () {
      Events.removeCallback(Events.EVENT_KEY_ENTER, this.state.clb1);
      Events.removeCallback(Events.EVENT_KEY_ESC, this.state.clb2);
    },
    saveSchedule: function (data, clb) {
      CalendarDao.setDay(data, clb);
    },
    saveZoneACL: function (departmentId, params, clb) {
      ZonesDao.setACL({
        departmentId: departmentId,
        accessTypeId: params.accessTypeId,
        aclTypeId: params.aclTypeId,
        zones: params.zones
      }, clb, clb);
    },
    onChangeName: function (ev) {
      let department = this.state.department;
      department.name = ev.currentTarget.value;
      this.setState({ department: department });
    },
    onChangeDescription: function (ev) {
      let department = this.state.department;
      department.description = ev.currentTarget.value;
      this.setState({ department: department });
    },
    onChangeOrganization: function (id) {
      let department = this.state.department;
      department.organizationId = +id;
      this.setState({ department: department });
    },
    onChangeScheduleType: function (ev) {
      let department = this.state.department;
      department.dayScheduleTypeId = +ev.currentTarget.id.substr('scheduleType'.length);
      this.setState({ department: department });
    },
    onChangeBlocked: function (ev) {
      let department = this.state.department;
      department.blocked = ev.currentTarget.checked;
      this.setState({ department: department });
    },
    onChangeSchedule: function (schedule) {
      this.setState({ schedule: schedule });
    },
    onChangeACL: function (acl) {
      this.setState({ acl: acl });
    },
    onOk: function () {
      let self = this;

      let department = self.state.department;

      DepartmentsDao.set(department, function (res) {
        Log.info('Отдел успешно добавлен');
        department.id = res.response.id;
        if (department.dayScheduleTypeId === 2) {
          self.saveSchedule({ departmentId: department.id, schedule: self.state.schedule }, function () {
            self.saveZoneACL(department.id, self.state.acl, function () {
              self.props.data.onOk(department);
            });
          });
        } else {
          self.saveZoneACL(department.id, self.state.acl, function () {
            self.props.data.onOk(department);
          });
        }

        self.props.data.onCancel();
      }, function () {
        Log.error('Ошибка добавления отдела');
        self.props.data.onCancel();
      });
    },
    onCancel: function () {
      this.props.data.onCancel();
    },
    render: function () {
      let data = [{
        id: 'info',
        name: 'Информация',
        active: true
      }, {
        id: 'time',
        name: 'Распорядок дня'
      }, {
        id: 'week',
        name: 'Доступ в зоны'
      }];

      let self = this;

      let schedule = null;
      if (this.state.department.dayScheduleTypeId === 2) {
        schedule = React.createElement(Schedule, { schedule: this.state.schedule, onChange: this.onChangeSchedule });
      }

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'header1' },
          '\u041E\u0442\u0434\u0435\u043B\u044B - [\u043D\u043E\u0432\u044B\u0439]'
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
                'div',
                { style: { display: 'inline-block', float: 'right' } },
                React.createElement('input', { id: 'modalAddDepartmentBlocked', className: 'filled-in', type: 'checkbox', checked: this.state.department.blocked, onChange: this.onChangeBlocked }),
                React.createElement(
                  'label',
                  { htmlFor: 'modalAddDepartmentBlocked' },
                  '\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D'
                )
              ),
              React.createElement(
                'table',
                { className: 'departments-table2' },
                React.createElement(
                  'tbody',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u0442\u0434\u0435\u043B\u0430'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { name: 'name', type: 'text', value: this.state.department.name, onChange: this.onChangeName })
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
                      React.createElement('input', { name: 'description', type: 'text', value: this.state.department.description, onChange: this.onChangeDescription })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement(Elements.Select, { values: this.props.data.organizations, title: '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D\u0430', selectedValue: this.state.department.organizationId, onChange: self.onChangeOrganization })
                    )
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { id: 'time' },
              React.createElement('input', { id: 'scheduleType1', className: 'with-gap', type: 'radio', checked: this.state.department.dayScheduleTypeId === 1, onChange: this.onChangeScheduleType }),
              React.createElement(
                'label',
                { htmlFor: 'scheduleType1' },
                '\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0440\u0430\u0441\u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0434\u043B\u044F \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438'
              ),
              React.createElement('br', null),
              React.createElement('input', { id: 'scheduleType2', className: 'with-gap', type: 'radio', checked: this.state.department.dayScheduleTypeId === 2, onChange: this.onChangeScheduleType }),
              React.createElement(
                'label',
                { htmlFor: 'scheduleType2' },
                '\u0421\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0440\u0430\u0441\u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0434\u043D\u044F'
              ),
              schedule
            ),
            React.createElement(
              'div',
              { id: 'week' },
              React.createElement(WeekSchedule, { data: { mode: 1 }, acl: this.state.acl, zones: this.props.data.zones, onChange: this.onChangeACL })
            )
          )
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'center-align', style: { 'margin-top': '20px' } },
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