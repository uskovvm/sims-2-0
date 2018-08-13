'use strict';

define(['jquery', 'react', 'react-dom', 'ui/ui_elements', 'utils/time', 'dao/reports', 'ui/ui_pager', 'core/events', 'dao/organizations', 'dao/departments', 'dao/accounts', 'utils/utils', 'objects'], function ($, React, ReactDOM, Elements, Time, ReportsDao, Pager, Events, OrganizationsDao, DepartmentsDao, AccountsDao, Utils, Objects) {
  return React.createClass({
    getInitialState: function () {
      return {
        startDate: Time.rollDays(new Date(), -30),
        endDate: new Date(),
        eventTypes: [1, 2],
        showPager: false,
        pagerLimit: 10,
        '$callback': null,
        organizations: [],
        selectedOrganizationId: 0,
        departments: [],
        selectedDepartmentId: 0,
        accounts: [],
        selectedAccountId: 0,
        content: []
      };
    },
    componentDidMount: function () {
      let self = this;

      let callback = Events.addCallback(Events.EVENT_REPORT_MAKE, self.onMakeReport);
      this.setState({ '$callback': callback });

      OrganizationsDao.getAll({}, function (res) {
        let organizations = res.rows;
        organizations.push({
          id: 0,
          name: 'Все'
        });

        self.setState({
          organizations: organizations,
          selectedOrganizationId: 0,
          departments: [],
          selectedDepartmentId: 0,
          accounts: [],
          selectedAccountId: 0
        }, self.loadDepartments);
      });
    },
    loadDepartments: function () {
      let self = this;

      if (self.state.selectedOrganizationId === 0) {
        self.setState({
          departments: [],
          selectedDepartmentId: 0,
          accounts: [],
          selectedAccountId: 0
        });
        return;
      }

      DepartmentsDao.getAll({
        organizationId: self.state.selectedOrganizationId
      }, function (res) {
        let departments = res.rows;
        departments.push({
          id: 0,
          name: 'Все'
        });

        self.setState({
          departments: departments,
          selectedDepartmentId: 0,
          accounts: [],
          selectedAccountId: 0
        }, self.loadAccounts);
      });
    },
    loadAccounts: function () {
      let self = this;

      let params = {};

      if (self.state.selectedDepartmentId === 0) {
        params.organizationId = self.state.selectedOrganizationId;
      } else {
        params.departmentId = self.state.selectedDepartmentId;
      }

      AccountsDao.getAll(params, function (res) {
        let accounts = res.rows.map(function (el, idx) {
          return {
            id: el.id,
            name: el.lastName + ' ' + el.firstName + ' ' + el.middleName
          };
        });

        accounts.push({
          id: 0,
          name: 'Все'
        });

        self.setState({
          accounts: accounts,
          selectedAccountId: 0
        });
      });
    },
    componentWillUnmount: function () {
      Events.removeCallback(Events.EVENT_REPORT_MAKE, this.state['$callback']);
    },
    onChangeStartDate: function (date) {
      if (date) {
        this.setState({ startDate: new Date(date) });
      }
    },
    onChangeEndDate: function (date) {
      if (date) {
        this.setState({ endDate: new Date(date) });
      }
    },
    onChangeEventTypes: function (val) {
      let eventTypes = this.state.eventTypes;
      let idx = eventTypes.indexOf(+val.id);

      if (val.value) {
        if (idx === -1) {
          eventTypes.push(val.id);
        }
      } else {
        if (idx !== -1) {
          eventTypes.splice(idx, 1);
        }
      }

      this.setState({ eventTypes: eventTypes });
    },
    onChangePagerLimit: function (ev) {
      let el = $(ev.currentTarget);
      this.setState({ pagerLimit: +el.attr('data-size') });
    },
    makeReport: function () {
      Events.dispatchEvent(Events.EVENT_PAGER_CLICK, { id: 1 });
    },
    loadReportData: function (inheritParams, clb) {
      let self = this;

      let params = {
        id: 1,
        startDate: self.state.startDate.getTime(),
        endDate: self.state.endDate.getTime(),
        eventTypes: self.state.eventTypes.join(',')
      };

      if (self.state.selectedOrganizationId !== 0) {
        params.organizationId = self.state.selectedOrganizationId;
      }

      if (self.state.selectedDepartmentId !== 0) {
        params.departmentId = self.state.selectedDepartmentId;
      }

      if (self.state.selectedAccountId !== 0) {
        params.accountId = self.state.selectedAccountId;
      }

      ReportsDao.get(Objects.merge(params, inheritParams), function (res) {
        self.setState({
          content: res.rows,
          selected: res.rows.length ? res.rows[0] : null,
          showPager: !(inheritParams.offset === 0 && inheritParams.limit >= res.pager.totalRows)
        });
        clb ? clb(res) : 0;
      });
    },
    onChangeOrganization: function (id) {
      this.setState({ selectedOrganizationId: +id }, this.loadDepartments);
    },
    onChangeDepartment: function (id) {
      this.setState({ selectedDepartmentId: +id }, this.loadAccounts);
    },
    onChangeAccount: function (id) {
      this.setState({ selectedAccountId: +id });
    },
    onSelect: function (ev) {
      let id = +$(ev.currentTarget).attr('data-value');
      let el = this.state.content.find(item => {
        return item.id === id;
      });

      this.setState({ selected: el });
    },
    onMakeReport: function (data) {
      let params = {
        id: 1,
        startDate: this.state.startDate.getTime(),
        endDate: this.state.endDate.getTime(),
        eventTypes: this.state.eventTypes.join(','),
        format: data.format
      };

      if (this.state.selectedOrganizationId !== 0) {
        params.organizationId = this.state.selectedOrganizationId;
      }

      if (this.state.selectedDepartmentId !== 0) {
        params.departmentId = this.state.selectedDepartmentId;
      }

      if (this.state.selectedAccountId !== 0) {
        params.accountId = this.state.selectedAccountId;
      }

      window.open('/reports/api/report?' + Utils.jsonToUrl(params));
    },
    render: function () {
      let self = this;

      let style = {
        position: 'absolute',
        bottom: '-10px',
        right: '0'
      };

      let okButtonConfig = {
        className: 'button-report-html',
        dataTooltip: 'Сформировать отчёт',
        onClick: self.makeReport
      };

      let pagerConfig = {
        firstClick: false,
        id: 1
      };

      let content = null,
          info = null;
      if (self.state.content && self.state.content.length > 0) {
        let data = self.state.content.map((el, idx) => {
          let className = el.id === self.state.selected.id ? 'selected' : '';

          return React.createElement(
            'tr',
            { className: className, 'data-value': el.id, onClick: self.onSelect },
            React.createElement(
              'td',
              null,
              Time.format('DDMMYYYYHHMMSS', el.date)
            ),
            React.createElement(
              'td',
              null,
              el.deviceName
            ),
            React.createElement(
              'td',
              null,
              el.cardNumber
            ),
            React.createElement(
              'td',
              null,
              el.employeeFullName
            ),
            React.createElement(
              'td',
              null,
              el.direction,
              ' ',
              el.path
            )
          );
        });

        content = React.createElement(
          'table',
          { className: 'reports-table' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                '\u0412\u0440\u0435\u043C\u044F'
              ),
              React.createElement(
                'th',
                null,
                '\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E'
              ),
              React.createElement(
                'th',
                null,
                '\u041D\u043E\u043C\u0435\u0440 \u043A\u0430\u0440\u0442\u044B'
              ),
              React.createElement(
                'th',
                null,
                '\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A'
              ),
              React.createElement(
                'th',
                null,
                '\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            data
          )
        );

        if (self.state.selected) {
          let el = self.state.selected;
          let url = el.shotUrl ? el.shotUrl : './images/oth/no-image.png';
          info = React.createElement(
            'div',
            { className: 'event-info' },
            React.createElement('img', { src: url, width: '300' }),
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                null,
                Time.format('DDMMYYYYHHMMSS', el.date)
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'span',
                  { className: 'header3' },
                  '\u0424\u0418\u041E:'
                ),
                ' ',
                el.employeeFullName
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'span',
                  { className: 'header3' },
                  '\u041D\u043E\u043C\u0435\u0440 \u043A\u0430\u0440\u0442\u044B (\u0442\u0438\u043F \u043A\u0430\u0440\u0442\u044B):'
                ),
                ' ',
                el.cardNumber,
                ' (',
                el.card_status,
                ')'
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'span',
                  { className: 'header3' },
                  '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F, \u043E\u0442\u0434\u0435\u043B:'
                ),
                ' ',
                el.organizationName,
                ', ',
                el.departmentName
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'span',
                  { className: 'header3' },
                  '\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E:'
                ),
                ' ',
                el.deviceName
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'span',
                  { className: 'header3' },
                  '\u0421\u043E\u0431\u044B\u0442\u0438\u0435 (\u0442\u0438\u043F):'
                ),
                ' ',
                el.direction,
                ' ',
                el.path,
                ' (',
                el.operation,
                ')'
              )
            )
          );
        }
      } else {
        content = React.createElement(
          'div',
          { className: 'with-margin-top20' },
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'halign' },
            '\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F'
          )
        );
      }

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'reports-settings' },
          React.createElement(Elements.Datepicker, { date: self.state.startDate, caption: 'Начальная дата', onChange: self.onChangeStartDate }),
          React.createElement(Elements.Datepicker, { date: self.state.endDate, caption: 'Конечная дата', onChange: self.onChangeEndDate }),
          React.createElement(
            'div',
            { className: 'ui-element-item' },
            React.createElement(
              'div',
              { className: 'header2' },
              '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F'
            ),
            React.createElement(Elements.Select, { className: 'with-element-width', values: self.state.organizations, selectedValue: self.state.selectedOrganizationId, onChange: self.onChangeOrganization })
          ),
          React.createElement(
            'div',
            { className: 'ui-element-item' },
            React.createElement(
              'div',
              { className: 'header2' },
              '\u041E\u0442\u0434\u0435\u043B'
            ),
            React.createElement(Elements.Select, { className: 'with-element-width', values: self.state.departments, selectedValue: self.state.selectedDepartmentId, onChange: self.onChangeDepartment })
          ),
          React.createElement(
            'div',
            { className: 'ui-element-item' },
            React.createElement(
              'div',
              { className: 'header2' },
              '\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B'
            ),
            React.createElement(Elements.Select, { className: 'with-element-width', values: self.state.accounts, selectedValue: self.state.selectedAccountId, onChange: self.onChangeAccount })
          ),
          React.createElement(Elements.InOutEventTypeChooser, { eventTypes: self.state.eventTypes, onChange: self.onChangeEventTypes }),
          React.createElement(
            'div',
            { className: 'ui-element-item', style: style },
            React.createElement(Elements.ControlButton, { data: okButtonConfig })
          )
        ),
        info,
        content,
        React.createElement(
          'div',
          { hidden: !self.state.showPager },
          React.createElement(
            'div',
            { className: 'halign' },
            React.createElement(Pager, { config: pagerConfig, onLoad: self.loadReportData, limit: self.state.pagerLimit })
          ),
          React.createElement(
            'div',
            { className: 'ralign' },
            '\u042D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435:',
            React.createElement(
              'span',
              { className: 'pager-item', 'data-size': '10', onClick: self.onChangePagerLimit },
              '10'
            ),
            React.createElement(
              'span',
              { className: 'pager-item', 'data-size': '50', onClick: self.onChangePagerLimit },
              '50'
            ),
            React.createElement(
              'span',
              { className: 'pager-item', 'data-size': '100', onClick: self.onChangePagerLimit },
              '100'
            )
          )
        )
      );
    }
  });
});