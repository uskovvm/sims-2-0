'use strict';

define(['react', 'react-dom', './ui_control_panel', './ui_connections', 'dao/core', './ui_add_connection', './ui_edit_connection', 'utils/utils', 'core/logger'], function (React, ReactDOM, ControlPanel, ConnectionsPanel, CoreDao, ConnectionAdd, ConnectionEdit, Utils, Log) {
  return React.createClass({
    getInitialState: function () {
      return {
        connections: [],
        connectionTypes: [],
        ports: [],
        selectedConnection: null,
        view: 'browse'
      };
    },
    componentDidMount: function () {
      let self = this;

      CoreDao.getConnections({}, function (data) {
        self.setState({
          connections: data,
          selectedConnection: data && data.length ? data[0] : null });
      });

      CoreDao.getConnectionTypes({}, function (data) {
        self.setState({ connectionTypes: data });
      });

      CoreDao.getPorts({}, function (data) {
        self.setState({ ports: data });
      });
    },
    onClick: function (command, clb) {
      let self = this;

      if (command === 'delete') {
        CoreDao.delConnection({ id: +self.state.selectedConnection.id }, function (res) {
          Log.info('Соединение успешно удалёно');
          self.componentDidMount();
          clb ? clb() : 0;
        }, function () {
          Log.error('Ошибка удаления соединения');
          clb ? clb() : 0;
        });

        command = 'browse';
      }

      self.setState({
        view: command
      });
    },
    onSelect: function (ev) {
      let res = Utils.findById(this.state.connections, +ev.currentTarget.id);
      this.setState({ selectedConnection: res });
    },
    renderBrowse: function () {
      return React.createElement(
        'div',
        { className: 'content-with-control-panel' },
        React.createElement(ControlPanel, { data: this.state, onClick: this.onClick }),
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(ConnectionsPanel, { onSelect: this.onSelect, data: this.state })
          )
        )
      );
    },
    renderAdd: function () {
      let self = this;

      let unusedPorts = self.state.ports.slice();
      self.state.connections.forEach(el => {
        let i = 0;
        for (; i < unusedPorts.length; i++) {
          if (el.sysName === unusedPorts[i].sysName) {
            break;
          }
        }
        unusedPorts.splice(i, 1);
      });

      let data = {
        onOk: function (data) {
          self.setState({
            view: 'browse'
          }, self.componentDidMount);
        },
        onCancel: function () {
          self.setState({
            view: 'browse'
          });
        },
        connectionTypes: self.state.connectionTypes,
        ports: unusedPorts
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(ConnectionAdd, { data: data })
        )
      );
    },
    renderEdit: function () {
      let self = this;

      let unusedPorts = self.state.ports.slice();
      self.state.connections.forEach(el => {
        let i = 0;
        for (; i < unusedPorts.length; i++) {
          if (el.sysName === unusedPorts[i].sysName && self.state.selectedConnection.sysName !== unusedPorts[i].sysName) {
            break;
          }
        }
        unusedPorts.splice(i, 1);
      });

      let data = {
        onOk: function (data) {
          self.setState({
            view: 'browse'
          }, self.componentDidMount);
        },
        onCancel: function () {
          self.setState({
            view: 'browse'
          });
        },
        connection: self.state.selectedConnection,
        connectionTypes: self.state.connectionTypes,
        ports: unusedPorts
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(ConnectionEdit, { data: data })
        )
      );
    },
    render: function () {
      switch (this.state.view) {
        case 'browse':
          return this.renderBrowse();
        case 'add':
          return this.renderAdd();
        case 'edit':
          return this.renderEdit();
      }
    }
  });
});