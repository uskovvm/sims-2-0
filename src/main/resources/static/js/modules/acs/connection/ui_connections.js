'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    render: function () {
      let content = null,
          self = this;

      if (!self.props.data.connections.length) {
        content = React.createElement(
          'div',
          { className: 'halign' },
          '\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F'
        );
      } else {
        let rows = [];
        self.props.data.connections.forEach(el => {
          let className = 'clickable ' + (self.props.data.selectedConnection && self.props.data.selectedConnection.id === el.id ? 'selected' : '');

          let connectionType = this.props.data.connectionTypes.find(item => {
            return item.id === el.typeId;
          });

          connectionType = connectionType || { name: '' };

          rows.push(React.createElement(
            'tr',
            { id: el.id, onClick: self.props.onSelect, className: className },
            React.createElement(
              'td',
              null,
              el.id
            ),
            React.createElement(
              'td',
              null,
              connectionType.name
            ),
            React.createElement(
              'td',
              null,
              el.name
            ),
            React.createElement(
              'td',
              null,
              el.sysName
            ),
            React.createElement(
              'td',
              null,
              el.baudrate
            ),
            React.createElement(
              'td',
              null,
              el.host
            ),
            React.createElement(
              'td',
              null,
              el.port
            )
          ));
        });

        content = React.createElement(
          'table',
          null,
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
                '\u0422\u0438\u043F'
              ),
              React.createElement(
                'th',
                null,
                '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'th',
                null,
                '\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u043E\u0435 \u0438\u043C\u044F'
              ),
              React.createElement(
                'th',
                null,
                '\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C'
              ),
              React.createElement(
                'th',
                null,
                '\u0425\u043E\u0441\u0442'
              ),
              React.createElement(
                'th',
                null,
                '\u041F\u043E\u0440\u0442'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            rows
          )
        );
      }

      return React.createElement(
        'div',
        { className: 'panel connections-panel' },
        React.createElement(
          'div',
          { className: 'header2' },
          '\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F:'
        ),
        content
      );
    }
  });
});