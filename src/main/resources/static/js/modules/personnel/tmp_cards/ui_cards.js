'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'objects', './ui_card'], function (React, ReactDOM, Elements, Objects, Card) {
  return React.createClass({
    render: function () {
      let self = this;

      let cards = self.props.data.map(function (el, idx) {
        return React.createElement(Card, {
          data: el,
          key: idx,
          onSelect: self.props.onSelect,
          select: el.number === self.props.selectedCard.number
        });
      });

      return React.createElement(
        'div',
        { className: 'table-wrapper' },
        React.createElement(
          'table',
          { className: 'highlight' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                '\u041D\u043E\u043C\u0435\u0440'
              ),
              React.createElement(
                'th',
                null,
                '\u0421\u0440\u043E\u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F, \u0441'
              ),
              React.createElement(
                'th',
                null,
                '\u0421\u0440\u043E\u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F, \u043F\u043E'
              ),
              React.createElement(
                'th',
                null,
                '\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            cards
          )
        )
      );
    }
  });
});