'use strict';

define(['jquery', 'react', 'react-dom', 'dao/users', './ui_role', 'core/events', 'core/logger'], function ($, React, ReactDOM, UsersDao, Role, Events, Log) {
  return React.createClass({
    getInitialState: function () {
      return {
        username: '',
        usernameAvailable: true,
        password: '',
        roles: [],
        blocked: false,
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
    onChangeUsername: function (ev) {
      let self = this;

      self.setState({
        username: ev.currentTarget.value,
        usernameAvailable: true
      });

      UsersDao.isUsernameAvailable({ username: self.state.username }, function (data) {
        self.setState({ usernameAvailable: data.status === 'success' });
      });
    },
    onChangePassword: function (ev) {
      this.setState({ password: ev.currentTarget.value });
    },
    onChangeUserBlocked: function (ev) {
      this.setState({ blocked: ev.currentTarget.checked });
    },
    onChangeRoles: function (key, value) {
      let roles = this.state.roles,
          idx = roles.indexOf(key);

      if (value && idx === -1) {
        roles.push(key);
      } else if (!value && idx !== -1) {
        roles.splice(idx, 1);
      } else {
        return;
      }

      this.setState({ roles: roles });
    },
    onOk: function () {
      let self = this;

      let user = {
        username: self.state.username,
        password: self.state.password,
        roles: self.state.roles,
        blocked: +self.state.blocked
      };

      UsersDao.set(user, function (responseData) {
        user.id = responseData.response.id;
        Log.info('Пользователь успешно добавлен');
        self.props.data.onOk(user);
      }, function () {
        Log.error('Ошибка добавления пользователя');
      });
    },
    onCancel: function () {
      this.props.data.onCancel();
    },
    render: function () {
      let self = this;

      let roles = self.props.data.roles.map(function (el, idx) {
        let checked = $.inArray(el.id, self.state.roles) !== -1;
        return React.createElement(Role, { key: idx, data: el, checked: checked, onChange: self.onChangeRoles });
      });

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'header1' },
          '\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438 - [\u041D\u043E\u0432\u044B\u0439]'
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col s12 m6 l5' },
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
                    '\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F:'
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement('input', { name: 'username', type: 'text', value: this.state.username, onChange: this.onChangeUsername }),
                    React.createElement(
                      'div',
                      { className: 'alert', hidden: this.state.usernameAvailable },
                      '\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442\u043E'
                    )
                  )
                ),
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'td',
                    null,
                    '\u041F\u0430\u0440\u043E\u043B\u044C'
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement('input', { name: 'password', type: 'password', value: this.state.password, onChange: this.onChangePassword })
                  )
                )
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'col s12 m6 l7', style: { 'paddingTop': '15px' } },
            roles
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement('input', { id: 'modalAddUserBlocked', className: 'filled-in', type: 'checkbox', checked: this.state.blocked, onChange: this.onChangeUserBlocked }),
          React.createElement(
            'label',
            { htmlFor: 'modalAddUserBlocked' },
            '\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D'
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