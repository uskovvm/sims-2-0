'use strict';

define(['react', 'react-dom', './ui_permission'], function (React, ReactDOM, Permission) {
  return React.createClass({
    render: function () {
      let self = this;

      let data = this.props.data.permissions.map(function (el, idx) {
        let checked = !self.props.data.currentRole ? false : self.props.data.currentRole.permissions.indexOf(el.id) !== -1;
        return React.createElement(Permission, { key: idx, data: el, onChange: self.props.onChange, checked: checked });
      });

      let res = [],
          tmpArr = [],
          len = Math.ceil(data.length / 3);

      for (let i = 0; i < data.length; i++) {
        if (i % len === 0 && i !== 0) {
          res.push(React.createElement(
            'div',
            { className: 'col l4 m6 s12' },
            tmpArr
          ));
          tmpArr = [];
        }

        tmpArr.push(data[i]);
      }

      if (tmpArr) {
        res.push(React.createElement(
          'div',
          { className: 'col l4 m6 s12' },
          tmpArr
        ));
      }

      return React.createElement(
        'div',
        { className: 'panel with-margin-top20' },
        React.createElement(
          'div',
          { className: 'header2' },
          '\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u043F\u0440\u0430\u0432\u0430 \u0434\u043B\u044F \u0440\u043E\u043B\u0438'
        ),
        React.createElement(
          'div',
          { className: 'row no-margin-bottom' },
          res
        )
      );
    }
  });
});