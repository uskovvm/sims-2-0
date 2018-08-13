'use strict';

define(['jquery', 'react', 'react-dom', 'objects', 'dao/core', 'core/logger', './ui_connection_selector', 'ui/ui_elements'], function ($, React, ReactDOM, Objects, CoreDao, Log, ConnectionSelector, Elements) {
  return React.createClass({
    getInitialState: function () {
      return {
        connection: this.getEmptyItem()
      };
    },
    getEmptyItem: function () {
      let connection = Objects.clone(Objects.Connection);
      delete connection.id;
      connection.name = 'Новое соединение';
      connection.typeId = this.props.data.connectionTypes[0] ? this.props.data.connectionTypes[0].id : 0;
      return connection;
    },
    onOk: function () {
      let self = this;

      CoreDao.setConnection(self.state.connection, function (res) {
        self.props.data.onOk(res);
      }, function (err) {
        Log.error('Ошибка сохранения соединения');
        self.props.data.onCancel();
      });
    },
    onCancel: function () {
      this.props.data.onCancel();
    },
    onChangeConnectionType: function (event) {
      let typeId = parseInt(event.currentTarget.id.substr('connectionType'.length));

      let connectionType = this.props.data.connectionTypes.find(el => {
        return el.id === typeId;
      });

      let connection = this.state.connection;
      connection.typeId = typeId;

      if (connectionType.ipRequired) {
        delete connection.baudrate;
        delete connection.sysName;
        connection.host = '';
        connection.port = 0;
      } else {
        delete connection.host;
        delete connection.port;
        connection.sysName = '';
        connection.baudrate = 9600;
      }

      this.setState({
        connection: connection
      });
    },
    onChangeName: function (event) {
      let connection = this.state.connection;
      connection.name = event.currentTarget.value;
      this.setState({ connection: connection });
    },
    onChangeSysName: function (val) {
      let connection = this.state.connection;
      connection.sysName = val;
      this.setState({ connection: connection });
    },
    onChangeHost: function (event) {
      let connection = this.state.connection;
      connection.host = event.currentTarget.value;
      this.setState({ connection: connection });
    },
    onChangePort: function (event) {
      let connection = this.state.connection;
      connection.port = parseInt(event.currentTarget.value);
      this.setState({ connection: connection });
    },
    onChangeBaudrate: function (value) {
      let connection = this.state.connection;
      connection.baudrate = parseInt(value);
      this.setState({ connection: connection });
    },
    onChangeUser: function (event) {
      let connection = this.state.connection;
      connection.user = event.currentTarget.value;
      this.setState({ connection: connection });
    },
    onChangePassword: function (event) {
      let connection = this.state.connection;
      connection.password = event.currentTarget.value;
      this.setState({ connection: connection });
    },
    onChangeDatabase: function (event) {
      let connection = this.state.connection;
      connection.database = event.currentTarget.value;
      this.setState({ connection: connection });
    },
    onChangeEnabled: function (event) {
      let connection = this.state.connection;
      connection.enabled = event.currentTarget.checked ? 1 : 0;
      this.setState({ connection: connection });
    },
    render: function () {
      let settings = null,
          self = this,
          dbConnection = null;

      const speeds = [{ id: 9600, name: '9600' }, { id: 19200, name: '19200' }, { id: 38400, name: '38400' }, { id: 57600, name: '57600' }, { id: 115200, name: '115200' }];

      let connectionTypes = [];

      self.props.data.connectionTypes.forEach(el => {
        let id = 'connectionType' + el.id;
        connectionTypes.push(React.createElement(
          'div',
          null,
          React.createElement('input', { className: 'with-gap', id: id, type: 'radio', name: 'group1', checked: self.state.connection.typeId === el.id, onChange: self.onChangeConnectionType }),
          React.createElement(
            'label',
            { htmlFor: id },
            el.name
          )
        ));
      });

      let connectionType = this.props.data.connectionTypes.find(el => {
        return el.id === self.state.connection.typeId;
      });

      let ports = self.props.data.ports.map(el => {
        return { id: el.sysName, name: el.sysName };
      });

      if (connectionType.ipRequired) {
        settings = React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col s12 m6 l6' },
            React.createElement(
              'div',
              { className: 'header3' },
              'IP'
            ),
            React.createElement('input', { className: 'with-element-width', type: 'text', value: this.state.connection.host, onChange: this.onChangeHost })
          ),
          React.createElement(
            'div',
            { className: 'col s12 m6 l6' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u041F\u043E\u0440\u0442'
            ),
            React.createElement('input', { className: 'with-element-width', type: 'number', value: this.state.connection.port, onChange: this.onChangePort })
          )
        );
      } else {
        settings = React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col s12 m6 l6' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u041F\u043E\u0440\u0442'
            ),
            React.createElement(Elements.Select, { className: 'with-element-width', values: ports, title: '\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E', selectedValue: this.state.connection.sysName, onChange: this.onChangeSysName })
          ),
          React.createElement(
            'div',
            { className: 'col s12 m6 l6' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043F\u043E\u0440\u0442\u0430'
            ),
            React.createElement(Elements.Select, { className: 'with-element-width', values: speeds, title: '\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E', selectedValue: this.state.connection.baudrate, onChange: this.onChangeBaudrate })
          )
        );
      }

      if (connectionType.isDatabaseConnection) {
        dbConnection = React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col s12 m6 l6' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F'
            ),
            React.createElement('input', { className: 'with-element-width', type: 'text', value: this.state.connection.user, onChange: this.onChangeUser }),
            React.createElement('br', null),
            React.createElement(
              'div',
              { className: 'header3' },
              '\u041F\u0430\u0440\u043E\u043B\u044C'
            ),
            React.createElement('input', { className: 'with-element-width', type: 'password', value: this.state.connection.password, onChange: this.onChangePassword })
          ),
          React.createElement(
            'div',
            { className: 'col s12 m6 l6' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0411\u0430\u0437\u0430 \u0434\u0430\u043D\u043D\u044B\u0445'
            ),
            React.createElement('input', { className: 'with-element-width', type: 'text', value: this.state.connection.database, onChange: this.onChangeDatabase })
          )
        );
      }

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'header1' },
          '\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435 - [\u043D\u043E\u0432\u043E\u0435]'
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col s12 m6 l6 ' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
            ),
            React.createElement('input', { className: 'with-element-width', type: 'text', value: this.state.connection.name, onChange: this.onChangeName }),
            React.createElement('br', null),
            React.createElement('br', null)
          ),
          React.createElement(
            'div',
            { className: 'col s12 m6 l6' },
            React.createElement(
              'div',
              { className: 'header3' },
              '\u0422\u0438\u043F \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F'
            ),
            connectionTypes
          )
        ),
        React.createElement('hr', null),
        settings,
        React.createElement('hr', null),
        dbConnection,
        React.createElement('hr', null),
        React.createElement('input', { type: 'checkbox', className: 'filled-in', id: 'enabled', checked: this.state.connection.enabled, onChange: this.onChangeEnabled }),
        React.createElement(
          'label',
          { className: 'header3', htmlFor: 'enabled' },
          '\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E'
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'center-align', style: { 'margin-top': '20px' } },
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