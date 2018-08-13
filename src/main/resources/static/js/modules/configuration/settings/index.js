'use strict';

define(['react', 'react-dom', 'dao/core'], function (React, ReactDOM, CoreDao) {
  let Port = React.createClass({
    displayName: 'Port',

    render: function () {
      function getStatusNameById(id) {
        switch (id) {
          case 0:
            return 'Недоступно';
          case 1:
            return 'Доступен';
          case 2:
            return 'В процессе подключения';
          case 3:
            return 'Открыто и занято устройством';
          default:
            return 'Нет данных';
        }
      }

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          this.props.data.id
        ),
        React.createElement(
          'td',
          null,
          this.props.data.name
        ),
        React.createElement(
          'td',
          null,
          this.props.data.vid
        ),
        React.createElement(
          'td',
          null,
          this.props.data.pid
        ),
        React.createElement(
          'td',
          null,
          this.props.data.serialNumber
        ),
        React.createElement(
          'td',
          null,
          this.props.data.pnpid
        ),
        React.createElement(
          'td',
          null,
          this.props.data.sysName
        ),
        React.createElement(
          'td',
          null,
          getStatusNameById(this.props.data.status)
        )
      );
    }
  });

  return React.createClass({
    getInitialState: function () {
      return {
        ports: [],
        versions: {}
      };
    },
    componentDidMount: function () {
      let self = this;

      CoreDao.getPorts({}, function (data) {
        self.setState({ ports: data });
      });

      CoreDao.getVersions({}, function (data) {
        self.setState({ versions: data });
      });
    },
    render: function () {
      let self = this;

      let ports = this.state.ports.map(function (el, idx) {
        return React.createElement(Port, { key: idx, data: el });
      });

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(
            'div',
            { className: 'panel' },
            React.createElement(
              'div',
              { className: 'header2' },
              '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u043F\u043E\u0440\u0442\u043E\u0432'
            ),
            React.createElement(
              'div',
              { className: 'port-panel' },
              React.createElement(
                'table',
                { className: 'ports-table' },
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
                      'VID'
                    ),
                    React.createElement(
                      'th',
                      null,
                      'PID'
                    ),
                    React.createElement(
                      'th',
                      null,
                      '\u0421\u0435\u0440\u0438\u0439\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440'
                    ),
                    React.createElement(
                      'th',
                      null,
                      'PNPID'
                    ),
                    React.createElement(
                      'th',
                      null,
                      '\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u043E\u0435 \u0438\u043C\u044F'
                    ),
                    React.createElement(
                      'th',
                      null,
                      '\u0421\u0442\u0430\u0442\u0443\u0441'
                    )
                  )
                ),
                React.createElement(
                  'tbody',
                  null,
                  ports
                )
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'panel with-margin-top20' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0412\u0435\u0440\u0441\u0438\u044F \u041F\u041E: ',
              this.state.versions.backend
            ),
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0412\u0435\u0440\u0441\u0438\u044F API: ',
              this.state.versions.api
            )
          )
        )
      );
    }
  });
});