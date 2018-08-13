'use strict';

define(['react', 'react-dom', './ui_user'], function (React, ReactDOM, User) {
  return React.createClass({
    onClick: function (ev) {
      this.props.onSelect(ev.currentTarget.id);
    },
    render: function () {
      let self = this;

      let users = this.props.data.users.map(function (el, idx) {
        let selected = el.id === self.props.data.selectedUser.id;
        return React.createElement(User, { key: idx, data: el, roles: self.props.data.roles, onClick: self.onClick, selected: selected });
      });

      return React.createElement(
        'div',
        { className: 'table-wrapper' },
        React.createElement(
          'table',
          { className: 'highlight users-table' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                '\u0418\u0414'
              ),
              React.createElement(
                'th',
                null,
                '\u0418\u043C\u044F'
              ),
              React.createElement(
                'th',
                null,
                '\u0420\u043E\u043B\u0438'
              ),
              React.createElement(
                'th',
                null,
                '\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            users
          )
        )
      );
    }
  });
});