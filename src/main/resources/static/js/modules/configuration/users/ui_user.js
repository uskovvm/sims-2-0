'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    render: function () {
      let self = this;

      let className = 'clickable ' + (this.props.selected ? 'selected' : '');

      let roles = [];

      if (this.props.data.roles) {
        roles = this.props.data.roles.map(function (el, idx) {
          let role = self.props.roles.find(function (el2, idx2) {
            return +el === +el2.id;
          });

          if (!role) {
            return React.createElement(
              'li',
              { className: 'header3', key: idx },
              '\u0420\u043E\u043B\u044C'
            );
          }

          return React.createElement(
            'li',
            { className: 'header3', key: idx },
            role.name
          );
        });
      }

      return React.createElement(
        'tr',
        { id: this.props.data.id, onClick: this.props.onClick, className: className },
        React.createElement(
          'td',
          null,
          this.props.data.id
        ),
        React.createElement(
          'td',
          null,
          this.props.data.username
        ),
        React.createElement(
          'td',
          null,
          React.createElement(
            'ul',
            { className: 'fix' },
            roles
          )
        ),
        React.createElement(
          'td',
          null,
          this.props.data.blocked ? 'Да' : 'Нет'
        )
      );
    }
  });
});