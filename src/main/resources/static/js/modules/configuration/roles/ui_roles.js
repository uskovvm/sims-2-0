'use strict';

define(['react', 'react-dom', './ui_role'], function (React, ReactDOM, Role) {
  return React.createClass({
    render: function () {
      let self = this;

      let roles = this.props.data.roles.map(function (el, idx) {
        return React.createElement(Role, { key: idx, data: el, onChange: self.props.onChange, selection: el.id === self.props.data.currentRole.id });
      });

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'table',
          { className: 'highlight roles-table' },
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
                '\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'th',
                null,
                '\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            roles
          )
        )
      );
    }
  });
});