'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    onClick: function (ev) {
      this.props.onChange(+ev.currentTarget.id);
    },
    render: function () {
      let self = this;

      let zones = self.props.data.zones.map(function (el, idx) {
        let className = self.props.data.selectedZone && el.id === self.props.data.selectedZone.id ? 'selected' : '';

        return React.createElement(
          'tr',
          { id: el.id, className: className, key: idx, onClick: self.onClick },
          React.createElement(
            'td',
            null,
            el.id
          ),
          React.createElement(
            'td',
            null,
            el.name
          ),
          React.createElement(
            'td',
            null,
            el.description
          ),
          React.createElement(
            'td',
            null,
            el.singlePass ? 'Да' : 'Нет'
          ),
          React.createElement(
            'td',
            null,
            el.singlePassTimeout
          )
        );
      });

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'table',
          { className: 'zones-table' },
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
                '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'th',
                null,
                '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'th',
                null,
                '\u041E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u044B\u0439 \u043F\u0440\u043E\u0445\u043E\u0434'
              ),
              React.createElement(
                'th',
                null,
                '\u0422\u0430\u0439\u043C\u0430\u0443\u0442 \u043E\u0434\u043D\u043E\u043A\u0440\u0430\u0442\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0445\u043E\u0434\u0430'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            zones
          )
        )
      );
    }
  });
});