'use strict';

define(['jquery', 'react', 'react-dom', 'core/events', 'ui/ui_pager', 'utils/utils', './ui_control_panel', './ui_info_panel', './ui_accounts', 'dao/accounts', 'dao/departments', 'dao/organizations', 'dao/zones', './ui_add_personnel', './ui_edit_personnel', 'core/logger'], function ($, React, ReactDOM, Events, Pager, Utils, ControlPanel, InfoPanel, Accounts, AccountsDao, DepartmentsDao, OrganizationsDao, ZonesDao, AddPersonnel, EditPersonnel, Log) {
  return React.createClass({
    getInitialState: function () {
      return {
        view: 'browse',
        departments: [],
        organizations: [],
        accounts: [],
        zones: [],
        selectedAccount: null,
        filters: {
          'deleted': 0,
          'fired': 0,
          'name': '',
          'departmentId': 0,
          'organizationId': 0,
          'cardNumber': ''
        },
        sort: {
          'name': 0,
          'departmentId': 0,
          'organizationId': 0,
          'cardNumber': 0
        },
        pagerLimit: 10
      };
    },
    componentDidMount: function () {
      let self = this;

      DepartmentsDao.getAll({}, function (res) {
        self.setState({ departments: res.rows });
      });

      OrganizationsDao.getAll({}, function (res) {
        self.setState({ organizations: res.rows });
      });

      ZonesDao.getAll({}, function (res) {
        self.setState({ zones: res.rows });
      });
    },
    loadAccounts: function (_params, clb) {
      let self = this;

      let params = '';

      if (_params) {
        params += 'offset=' + _params.offset;
        params += '&limit=' + _params.limit;
      }

      if (this.state.filters.deleted !== 0) {
        params += '&deleted=' + this.state.filters.deleted;
      }

      if (this.state.filters.fired !== 0) {
        params += '&fired=' + this.state.filters.fired;
      }

      if (this.state.filters.name && this.state.filters.name !== '') {
        params += '&name=' + this.state.filters.name;
      }

      if (this.state.filters.departmentId) {
        params += '&departmentId=' + this.state.filters.departmentId;
      }

      if (this.state.filters.organizationId) {
        params += '&organizationId=' + this.state.filters.organizationId;
      }

      if (this.state.filters.cardNumber && this.state.filters.cardNumber !== '') {
        params += '&cardNumber=' + this.state.filters.cardNumber;
      }

      if (this.state.sort.name !== 0) {
        params += '&sortColumn=accountLastName&sortOrder=' + (this.state.sort.name === 1 ? 'ASC' : 'DESC');
      }

      if (this.state.sort.departmentId !== 0) {
        params += '&sortColumn=departmentName&sortOrder=' + (this.state.sort.departmentId === 1 ? 'ASC' : 'DESC');
      }

      if (this.state.sort.organizationId !== 0) {
        params += '&sortColumn=organizationName&sortOrder=' + (this.state.sort.organizationId === 1 ? 'ASC' : 'DESC');
      }

      if (this.state.sort.cardNumber !== 0) {
        params += '&sortColumn=cardNumber&sortOrder=' + (this.state.sort.cardNumber === 1 ? 'ASC' : 'DESC');
      }

      AccountsDao.getAll(params, function (res) {
        if (clb) {
          clb(res);
        }

        self.setState({
          accounts: res.rows,
          selectedAccount: res ? res.rows[0] : null
        });
      });
    },
    onPagerLimitChange: function (ev) {
      let el = $(ev.currentTarget);
      this.setState({
        pagerLimit: +el.attr('data-size')
      });
    },
    onSelect: function (ev) {
      let res = Utils.findById(this.state.accounts, +ev.currentTarget.id);
      this.setState({ selectedAccount: res });
    },
    onFilterChange: function (name, value) {
      let self = this;
      let state = this.state;

      switch (name) {
        case 'fired':
        case 'deleted':
        case 'departmentId':
        case 'organizationId':
          state.filters[name] = +value;
          break;
        case 'name':
        case 'cardNumber':
          state.filters[name] = value;
          break;
      }

      this.setState(state, function () {
        Events.dispatchEvent(Events.EVENT_PAGER_CLICK, { id: 1 });
      });
    },
    onSortChange: function (name, value) {
      let state = this.state;
      state.sort[name] = +value;
      this.setState(state, function () {
        Events.dispatchEvent(Events.EVENT_PAGER_CLICK, { id: 1 });
      });
    },
    onControlButtonClick: function (command, clb) {
      let self = this;

      if (command === 'delete') {
        AccountsDao.del({ id: +self.state.selectedAccount.id }, function (res) {
          Log.info('Аккаунт успешно удалён');
          clb ? clb() : 0;
          Events.dispatchEvent(Events.EVENT_PAGER_CLICK, { id: 1 });
        }, function () {
          Log.error('Ошибка удаления аккаунта');
          clb ? clb() : 0;
        });

        command = 'browse';
      }

      self.setState({
        view: command
      });
    },
    renderAdd: function () {
      let self = this;

      let data = {
        onOk: function () {
          self.setState({
            view: 'browse'
          });
        },
        onCancel: function () {
          self.setState({
            view: 'browse'
          });
        },
        organizations: self.state.organizations,
        zones: self.state.zones
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(AddPersonnel, { data: data })
        )
      );
    },
    renderEdit: function () {
      let self = this;

      let data = {
        onOk: function () {
          self.setState({
            view: 'browse'
          });
        },
        onCancel: function () {
          self.setState({
            view: 'browse'
          });
        },
        organizations: self.state.organizations,
        zones: self.state.zones,
        account: self.state.selectedAccount
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(EditPersonnel, { data: data })
        )
      );
    },
    renderBrowse: function () {
      let class10 = 'pager-item' + (this.state.pagerLimit === 10 ? ' selected' : ''),
          class25 = 'pager-item' + (this.state.pagerLimit === 25 ? ' selected' : ''),
          class50 = 'pager-item' + (this.state.pagerLimit === 50 ? ' selected' : '');

      return React.createElement(
        'div',
        { className: 'content-with-control-panel' },
        React.createElement(ControlPanel, { data: this.state, onClick: this.onControlButtonClick }),
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(InfoPanel, { data: this.state }),
            React.createElement(
              'div',
              { className: 'accounts-panel panel' },
              React.createElement(Accounts, { data: this.state, onSelect: this.onSelect, onChange: this.onFilterChange, onChangeSort: this.onSortChange }),
              React.createElement(
                'div',
                { className: 'halign' },
                React.createElement(Pager, { config: { id: 1 }, onLoad: this.loadAccounts, limit: this.state.pagerLimit })
              ),
              React.createElement(
                'div',
                { className: 'ralign' },
                '\u042D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435:',
                React.createElement(
                  'span',
                  { className: class10, 'data-size': '10', onClick: this.onPagerLimitChange },
                  '10'
                ),
                React.createElement(
                  'span',
                  { className: class25, 'data-size': '25', onClick: this.onPagerLimitChange },
                  '25'
                ),
                React.createElement(
                  'span',
                  { className: class50, 'data-size': '50', onClick: this.onPagerLimitChange },
                  '50'
                )
              )
            )
          )
        )
      );
    },
    render: function () {
      switch (this.state.view) {
        case 'add':
          return this.renderAdd();
        case 'edit':
          return this.renderEdit();
        default:
          return this.renderBrowse();
      }
    }
  });
});