'use strict';

define(['react', 'react-dom', 'objects', 'ui/ui_elements', 'ui/ui_schedule', 'ui/ui_week_schedule_manager', 'core/events', 'core/logger', 'dao/organizations', 'dao/calendar', 'dao/zones'], function (React, ReactDOM, Objects, Elements, Schedule, WeekSchedule, Events, Log, OrganizationsDao, CalendarDao, ZonesDao) {
  return React.createClass({
    getInitialState: function () {
      let organization = Objects.clone(Objects.Organization);
      delete organization.id;

      return {
        organization: organization,
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
    onChangeName: function (ev) {
      let organization = this.state.organization;
      organization.name = ev.currentTarget.value;
      this.setState({ organization: organization });
    },
    onChangeFullName: function (ev) {
      let organization = this.state.organization;
      organization.fullName = ev.currentTarget.value;
      this.setState({ organization: organization });
    },
    onChangeDescription: function (ev) {
      let organization = this.state.organization;
      organization.description = ev.currentTarget.value;
      this.setState({ organization: organization });
    },
    onChangeSchedule: function (schedule) {
      this.setState({ schedule: schedule });
    },
    onChangeACL: function (acl) {
      this.setState({ acl: acl });
    },
    saveSchedule: function (params, clb) {
      CalendarDao.setDay(params, clb, clb);
    },
    onChangeBlocked: function (ev) {
      let organization = this.state.organization;
      organization.blocked = ev.currentTarget.checked;
      this.setState({ organization: organization });
    },
    saveZoneACL: function (organizationId, params, clb) {
      ZonesDao.setACL({
        organizationId: organizationId,
        accessTypeId: params.accessTypeId,
        aclTypeId: params.aclTypeId,
        zones: params.zones
      }, clb, clb);
    },
    onOk: function () {
      let self = this;

      let data = this.state.organization;

      OrganizationsDao.set(data, function (res) {
        data.id = res.response.id;
        self.saveSchedule({ organizationId: data.id, schedule: self.state.schedule }, function () {
          self.saveZoneACL(data.id, self.state.acl, function () {
            Log.info('Организация успешно добавлена');
            self.props.data.onOk(data);
          });
        });
      }, function () {
        Log.error('Ошибка добавления организации');
        self.onCancel();
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

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'header1' },
          '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438 - [\u043D\u043E\u0432\u0430\u044F]'
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
                React.createElement('input', { id: 'modalAddOrganizationBlocked', className: 'filled-in', type: 'checkbox', checked: this.state.organization.blocked, onChange: this.onChangeBlocked }),
                React.createElement(
                  'label',
                  { htmlFor: 'modalAddOrganizationBlocked' },
                  '\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D'
                )
              ),
              React.createElement(
                'table',
                { className: 'organizations-table2' },
                React.createElement(
                  'tbody',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041A\u0440\u0430\u0442\u043A\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { type: 'text', value: this.state.organization.name, onChange: this.onChangeName })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041F\u043E\u043B\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { type: 'text', value: this.state.organization.fullName, onChange: this.onChangeFullName })
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
                      React.createElement('input', { type: 'text', value: this.state.organization.description, onChange: this.onChangeDescription })
                    )
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { id: 'time' },
              React.createElement(Schedule, { schedule: this.state.schedule, onChange: this.onChangeSchedule })
            ),
            React.createElement(
              'div',
              { id: 'week' },
              React.createElement(WeekSchedule, { acl: this.state.acl, zones: this.props.data.zones, onChange: this.onChangeACL })
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