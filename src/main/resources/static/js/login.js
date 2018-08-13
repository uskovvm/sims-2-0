'use strict';

define(['react', 'react-dom', 'core/auth'], function (React, ReactDOM, Auth) {
  return React.createClass({
    getInitialState: function () {
      return {
        username: null,
        password: null,
        error: null
      };
    },
    onSubmit: function (ev) {
      ev.preventDefault();

      let self = this;

      Auth.login({
        username: this.state.username,
        password: this.state.password
      }, null, function (error) {
        self.setState({ error: 'Доступ запрещен: неверное имя пользователя или пароль.' });
      });
    },
    onUsernameChange: function (ev) {
      this.setState({ username: ev.currentTarget.value });
    },
    onPasswordChange: function (ev) {
      this.setState({ password: ev.currentTarget.value });
    },

    render: function () {
      return React.createElement(
        'div',
        { className: 'ui-auth' },
        React.createElement(
          'div',
          { className: 'header1' },
          '\u0412\u0445\u043E\u0434 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443'
        ),
        React.createElement(
          'form',
          { onSubmit: this.onSubmit },
          React.createElement('input', { name: 'username', type: 'text', value: this.state.username, placeholder: '\u041B\u043E\u0433\u0438\u043D', onChange: this.onUsernameChange, autofocus: true }),
          React.createElement('br', null),
          React.createElement('input', { name: 'password', type: 'password', value: this.state.password, placeholder: '\u041F\u0430\u0440\u043E\u043B\u044C', onChange: this.onPasswordChange }),
          React.createElement('br', null),
          React.createElement(
            'div',
            { className: 'alert', hidden: !this.state.error },
            this.state.error
          ),
          React.createElement(
            'div',
            { className: 'center-align' },
            React.createElement('input', { className: 'waves-effect waves-light btn', type: 'submit', value: '\u0412\u043E\u0439\u0442\u0438!', onClick: this.onSubmit })
          )
        )
      );
    }
  });
});