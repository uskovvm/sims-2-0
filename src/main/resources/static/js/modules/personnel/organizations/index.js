'use strict';

define(['jquery', 'react', 'react-dom', 'ui/ui_pager', './ui_organizations', 'utils/utils', './ui_control_panel', 'dao/organizations', 'dao/zones', 'core/logger', './ui_add_organization', './ui_edit_organization'], function ($, React, ReactDOM, Pager, Organizations, Utils, ControlPanel, OrganizationsDao, ZonesDao, Log, AddOrganization, EditOrganization) {
  return React.createClass({
    getInitialState: function () {
      return {
        view: 'browse',
        organizations: [],
        zones: [],
        selectedOrganization: null,
        pagerLimit: 10
      };
    },
    componentDidMount: function () {
      let self = this;

      ZonesDao.getAll({}, function (res) {
        self.setState({ zones: res.rows });
      });
    },
    loadOrganizations: function (_params, clb) {
      let self = this;

      let params = {};

      if (_params) {
        params.offset = _params.offset;
        params.limit = _params.limit;
      }

      OrganizationsDao.getAll(params, function (res) {
        if (clb) {
          clb(res);
        }

        self.setState({
          organizations: res.rows,
          selectedOrganization: !res.rows.length ? null : res.rows[0]
        });

        Log.info('Организации успешно загружены');
      });
    },
    onPagerLimitChange: function (ev) {
      let el = $(ev.currentTarget);
      this.setState({
        pagerLimit: +el.attr('data-size')
      });
    },
    onSelect: function (id) {
      let res = Utils.findById(this.state.organizations, +id);
      this.setState({ selectedOrganization: res });
    },
    onControlButtonClicked: function (command, clb) {
      let self = this;

      if (command === 'delete') {
        OrganizationsDao.del({ id: self.state.selectedOrganization.id }, function (res) {
          Log.info('Организация успешно удалена');
          clb ? clb() : 0;
        }, function () {
          Log.error('Ошибка удаления организации');
          clb ? clb() : 0;
        });

        command = 'browse';
      }

      this.setState({
        view: command
      });
    },
    renderAdd: function () {
      let self = this;

      let data = {
        onOk: function () {
          self.setState({ view: 'browse' });
        },
        onCancel: function () {
          self.setState({ view: 'browse' });
        },
        zones: self.state.zones
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(AddOrganization, { data: data })
        )
      );
    },
    renderEdit: function () {
      let self = this;

      let data = {
        onOk: function () {
          self.setState({ view: 'browse' });
        },
        onCancel: function () {
          self.setState({ view: 'browse' });
        },
        zones: self.state.zones,
        organization: self.state.selectedOrganization
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(EditOrganization, { data: data })
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
        React.createElement(ControlPanel, { data: this.state, onClick: this.onControlButtonClicked }),
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'organizations-panel panel' },
              React.createElement(Organizations, { data: this.state, onSelect: this.onSelect }),
              React.createElement(
                'div',
                { className: 'halign' },
                React.createElement(Pager, { onLoad: this.loadOrganizations, limit: this.state.pagerLimit })
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