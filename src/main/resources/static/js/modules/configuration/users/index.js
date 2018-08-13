'use strict';

define(['jquery', 'react', 'react-dom', 'core/events', 'ui/ui_pager', 'utils/utils', 'dao/users', 'dao/core', './ui_users', './ui_control_panel', './ui_add_user', './ui_edit_user', 'core/logger'], function ($, React, ReactDOM, Events, Pager, Utils, UsersDao, CoreDao, Users, ControlPanel, AddUser, EditUser, Log) {
  return React.createClass({
    getInitialState: function () {
      return {
        users: [],
        selectedUser: null,
        roles: [],
        pagerLimit: 10,
        view: 'browse'
      };
    },
    componentDidMount: function () {
      let self = this;

      CoreDao.getRoles({}, function (data) {
        self.setState({ roles: data });
      });
    },
    loadUsers: function (_params, clb) {
      let self = this;

      let params = {};

      if (_params) {
        params.offset = _params.offset;
        params.limit = _params.limit;
      }

      UsersDao.getAll(params, function (data) {
        self.setState({
          users: data.rows,
          selectedUser: data.rows && data.rows.length ? data.rows[0] : null
        }, function () {
          if (clb) {
            clb(data);
          }
        });
      });
    },
    onControlButtonClick: function (command, clb) {
      let self = this;

      if (command === 'delete') {
        if (!self.state.selectedUser) {
          return;
        }

        UsersDao.del({ id: self.state.selectedUser.id }, function (data) {
          Log.info('Пользователь успешно удалён');
          clb ? clb() : 0;
          Events.dispatchEvent(Events.EVENT_PAGER_CLICK, { id: 2 });
        }, function () {
          Log.error('Ошибка удаления пользователя');
          clb ? clb() : 0;
        });

        command = 'view';
      }

      self.setState({ view: command });
    },
    onPagerLimitChange: function (ev) {
      let el = $(ev.currentTarget);
      this.setState({
        pagerLimit: +el.attr('data-size')
      });
    },
    onUserChange: function (id) {
      let res = Utils.findById(this.state.users, +id);
      this.setState({ selectedUser: res });
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
            React.createElement(
              'div',
              { className: 'panel users-panel' },
              React.createElement(Users, { data: this.state, onSelect: this.onUserChange }),
              React.createElement(
                'div',
                { className: 'halign' },
                React.createElement(Pager, { config: { id: 2 }, onLoad: this.loadUsers, limit: this.state.pagerLimit })
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
    renderAdd: function () {
      let self = this;

      let data = {
        onOk: function (user) {
          let users = self.state.users;
          users.push(user);
          self.setState({ view: 'browse' });
        },
        onCancel: function () {
          self.setState({ view: 'browse' });
        },
        roles: this.state.roles
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(AddUser, { data: data })
        )
      );
    },
    renderEdit: function () {
      let self = this;

      let data = {
        onOk: function (user) {
          let users = self.state.users;
          let idx = Utils.indexOfId(users, user.id);
          users[idx] = user;
          self.setState({ view: 'browse' });
        },
        onCancel: function () {
          self.setState({ view: 'browse' });
        },
        roles: this.state.roles,
        selectedUser: this.state.selectedUser
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(EditUser, { data: data })
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