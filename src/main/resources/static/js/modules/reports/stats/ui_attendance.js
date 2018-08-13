'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'core/events', 'dao/organizations', 'dao/departments', 'dao/accounts', 'ui/ui_pager', 'utils/utils', 'dao/reports', './ui_state', 'objects'], function (React, ReactDOM, Elements, Events, OrganizationsDao, DepartmentsDao, AccountsDao, Pager, Utils, ReportsDao, State, Objects) {
  return React.createClass({
    getInitialState: function () {
      let date = new Date();

      return {
        '$callback': null,
        showPager: false,
        pagerLimit: 10,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        organizations: [],
        selectedOrganizationId: 0,
        departments: [],
        selectedDepartmentId: 0,
        accounts: [],
        content: []
      };
    },
    componentDidMount: function () {
      this.loadOrganizations();

      let callback = Events.addCallback(Events.EVENT_REPORT_MAKE, this.onMakeReport);
      this.setState({ '$callback': callback });
    },
    componentWillUnmount: function () {
      Events.removeCallback(Events.EVENT_REPORT_MAKE, this.state['$callback']);
    },
    makeReport: function () {
      Events.dispatchEvent(Events.EVENT_PAGER_CLICK, { id: 1 });
    },
    loadReportData: function (inheritParams, clb) {
      let self = this;

      let params = {
        id: 7,
        year: this.state.year,
        month: this.state.month
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

      ReportsDao.get(Objects.merge(params, inheritParams), function (res) {
        self.setState({
          content: res.rows,
          showPager: !(inheritParams.offset === 0 && inheritParams.limit >= res.pager.totalRows)
        });
        clb ? clb(res) : 0;
      });
    },
    onMakeReport: function (data) {
      let params = {
        id: 7,
        year: this.state.year,
        month: this.state.month,
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
    onChangeMonth: function (date) {
      this.setState({
        year: date.year,
        month: date.month
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
    onChangePagerLimit: function (ev) {
      let el = $(ev.currentTarget);
      this.setState({ pagerLimit: +el.attr('data-size') });
    },
    loadOrganizations: function () {
      let self = this;

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

      DepartmentsDao.getAll({ organizationId: self.state.selectedOrganizationId }, function (res) {
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

      if (self.state.selectedDepartmentId === 0) {
        self.setState({
          accounts: [],
          selectedAccountId: 0
        });
        return;
      }

      AccountsDao.getAll({ departmentId: self.state.selectedDepartmentId }, function (res) {
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

      let monthPickerData = {
        year: this.state.year,
        month: this.state.month
      };

      let content = null;
      if (self.state.content && self.state.content.length > 0) {
        let data = self.state.content.map(function (el, idx) {
          return React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              null,
              el.accountName
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[0] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[1] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[2] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[3] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[4] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[5] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[6] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[7] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[8] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[9] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[10] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[11] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[12] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[13] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[14] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[15] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[16] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[17] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[18] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[19] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[20] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[21] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[22] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[23] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[24] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[25] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[26] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[27] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[28] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[29] })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(State, { data: el.days[30] })
            )
          );
        });

        content = React.createElement(
          'table',
          { className: 'reports-table2' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                '\u041F\u0435\u0441\u043E\u043D\u0430\u043B'
              ),
              React.createElement(
                'th',
                null,
                '1'
              ),
              React.createElement(
                'th',
                null,
                '2'
              ),
              React.createElement(
                'th',
                null,
                '3'
              ),
              React.createElement(
                'th',
                null,
                '4'
              ),
              React.createElement(
                'th',
                null,
                '5'
              ),
              React.createElement(
                'th',
                null,
                '6'
              ),
              React.createElement(
                'th',
                null,
                '7'
              ),
              React.createElement(
                'th',
                null,
                '8'
              ),
              React.createElement(
                'th',
                null,
                '9'
              ),
              React.createElement(
                'th',
                null,
                '10'
              ),
              React.createElement(
                'th',
                null,
                '11'
              ),
              React.createElement(
                'th',
                null,
                '12'
              ),
              React.createElement(
                'th',
                null,
                '13'
              ),
              React.createElement(
                'th',
                null,
                '14'
              ),
              React.createElement(
                'th',
                null,
                '15'
              ),
              React.createElement(
                'th',
                null,
                '16'
              ),
              React.createElement(
                'th',
                null,
                '17'
              ),
              React.createElement(
                'th',
                null,
                '18'
              ),
              React.createElement(
                'th',
                null,
                '19'
              ),
              React.createElement(
                'th',
                null,
                '20'
              ),
              React.createElement(
                'th',
                null,
                '21'
              ),
              React.createElement(
                'th',
                null,
                '22'
              ),
              React.createElement(
                'th',
                null,
                '23'
              ),
              React.createElement(
                'th',
                null,
                '24'
              ),
              React.createElement(
                'th',
                null,
                '25'
              ),
              React.createElement(
                'th',
                null,
                '26'
              ),
              React.createElement(
                'th',
                null,
                '27'
              ),
              React.createElement(
                'th',
                null,
                '28'
              ),
              React.createElement(
                'th',
                null,
                '29'
              ),
              React.createElement(
                'th',
                null,
                '30'
              ),
              React.createElement(
                'th',
                null,
                '31'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            data
          )
        );
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
          React.createElement(
            'div',
            { className: 'ui-element-item' },
            React.createElement(
              'div',
              { className: 'header2' },
              '\u041C\u0435\u0441\u044F\u0446'
            ),
            React.createElement(Elements.MonthPicker, { data: monthPickerData, onChange: this.onChangeMonth })
          ),
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
          React.createElement(
            'div',
            { className: 'ui-element-item', style: style },
            React.createElement(Elements.ControlButton, { data: okButtonConfig })
          )
        ),
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
        ),
        React.createElement('hr', null),
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
                { style: { width: '40px' } },
                React.createElement(State, { data: 0 })
              ),
              React.createElement(
                'td',
                null,
                '- \u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u0435 \u043D\u0430 \u0440\u0430\u0431\u043E\u0447\u0435\u043C \u043C\u0435\u0441\u0442\u0435'
              ),
              React.createElement(
                'td',
                { style: { width: '40px' } },
                React.createElement(State, { data: 1 })
              ),
              React.createElement(
                'td',
                null,
                '- \u041F\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u0435 \u043D\u0430 \u0440\u0430\u0431\u043E\u0447\u0435\u043C \u043C\u0435\u0441\u0442\u0435'
              )
            ),
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                { style: { width: '40px' } },
                React.createElement(State, { data: 2 })
              ),
              React.createElement(
                'td',
                null,
                '- \u041E\u043F\u043E\u0437\u0434\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'td',
                { style: { width: '40px' } },
                React.createElement(State, { data: 3 })
              ),
              React.createElement(
                'td',
                null,
                '- \u0420\u0430\u043D\u043D\u0438\u0439 \u0443\u0445\u043E\u0434'
              )
            ),
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                { style: { width: '40px' } },
                React.createElement(State, { data: 4 })
              ),
              React.createElement(
                'td',
                null,
                '- \u041E\u043F\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0438 \u0440\u0430\u043D\u043D\u0438\u0439 \u0443\u0445\u043E\u0434'
              ),
              React.createElement('td', null),
              React.createElement('td', null)
            )
          )
        )
      );
    }
  });
});