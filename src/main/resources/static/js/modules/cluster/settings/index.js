'use strict';

define(['jquery', 'react', 'react-dom', 'dao/core', 'core/logger', './ui_control_panel'], function ($, React, ReactDOM, CoreDao, Log, ControlPanel) {
  let MODE_MASTER = 1,
      MODE_SLAVE = 2;

  return React.createClass({
    getInitialState: function () {
      return {
        enabled: false,
        mode: MODE_MASTER,
        masterAddress: '',
        slaveAddresses: [],
        autosave: null
      };
    },
    componentDidMount: function () {
      let self = this;

      CoreDao.getCluster({}, function (data) {
        self.setState(data);
        Log.info('Данные о кластере успешно загружены');
      }, function () {
        Log.error('Ошибка загрузки данных по кластеру');
      });
    },
    updateTimeout: function () {
      if (this.state.autosave !== null) {
        clearTimeout(this.state.autosave);
      }

      this.setState({ autosave: setTimeout(this.onSave, 3000) });
    },
    deleteTimeout: function () {
      clearTimeout(this.state.autosave);
      this.setState({ autosave: null });
    },
    onChangeEnabled: function () {
      this.setState({
        enabled: !this.state.enabled,
        masterAddress: '',
        slaveAddresses: []
      }, this.updateTimeout);
    },
    onChangeMode: function (ev) {
      this.setState({
        mode: +$(ev.currentTarget).attr('data-id')
      }, this.updateTimeout);
    },
    onChangeMasterIp: function (ev) {
      this.setState({
        masterAddress: ev.currentTarget.value
      }, this.updateTimeout);
    },
    onAddSlaveIp: function () {
      let ips = this.state.slaveAddresses;
      ips.push('');

      this.setState({
        slaveAddresses: ips
      }, this.updateTimeout);
    },
    onChangeSlaveIp: function (ev) {
      let id = +$(ev.currentTarget).attr('data-id');
      let ips = this.state.slaveAddresses;
      ips[id] = ev.currentTarget.value;

      this.setState({
        slaveAddresses: ips
      }, this.updateTimeout);
    },
    onDelSlaveIp: function (ev) {
      let id = +$(ev.currentTarget).attr('data-id');
      let ips = this.state.slaveAddresses;
      ips.splice(id, 1);

      this.setState({
        slaveAddresses: ips
      }, this.updateTimeout);
    },
    onSave: function () {
      let params = {
        enabled: this.state.enabled,
        mode: this.state.mode
      };

      if (params.mode === MODE_MASTER) {
        params.slaveAddresses = this.state.slaveAddresses;
      }

      if (params.mode === MODE_SLAVE) {
        params.masterAddress = this.state.masterAddress;
      }

      CoreDao.setCluster(params, function () {
        Log.info('Данные о кластере успешно сохранены');
      }, function () {
        Log.error('Ошибка сохранения данных о кластере');
      });
    },
    render: function () {
      let self = this;

      let masterSlavePanel = null;

      if (self.state.enabled) {
        masterSlavePanel = React.createElement(
          'div',
          { className: 'with-margin-top10 with-margin-bottom10' },
          React.createElement(
            'div',
            null,
            React.createElement('input', { className: 'with-gap', id: 'master', type: 'radio', 'data-id': MODE_MASTER, checked: self.state.mode === MODE_MASTER, onChange: self.onChangeMode }),
            React.createElement(
              'label',
              { htmlFor: 'master' },
              '\u041C\u0430\u0441\u0442\u0435\u0440'
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement('input', { className: 'with-gap', id: 'slave', type: 'radio', 'data-id': MODE_SLAVE, checked: self.state.mode === MODE_SLAVE, onChange: self.onChangeMode }),
            React.createElement(
              'label',
              { htmlFor: 'slave' },
              '\u0412\u0442\u043E\u0440\u0438\u0447\u043D\u044B\u0439'
            )
          )
        );
      }

      let masterAddressPanel = null;

      if (self.state.enabled && self.state.mode === MODE_SLAVE) {
        masterAddressPanel = React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'header2' },
            '\u0410\u0434\u0440\u0435\u0441 \u043C\u0430\u0441\u0442\u0435\u0440\u0430:'
          ),
          React.createElement('input', { className: 'with-element-width', type: 'text', value: self.state.masterAddress, onChange: self.onChangeMasterIp })
        );
      }

      let slaveIpPanel = null;

      if (self.state.enabled && self.state.mode === MODE_MASTER) {
        let addresses = self.state.slaveAddresses.map(function (el, idx) {
          return React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              null,
              '\u0412\u0442\u043E\u0440\u0438\u0447\u043D\u044B\u0439 \u0441\u0435\u0440\u0432\u0435\u0440 ',
              idx + 1,
              ':'
            ),
            React.createElement(
              'td',
              null,
              React.createElement('input', { className: 'with-element-width', type: 'text', value: el, 'data-id': idx, onChange: self.onChangeSlaveIp })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(
                'div',
                { className: 'waves-effect waves-light btn', 'data-id': idx, onClick: self.onDelSlaveIp },
                'X'
              )
            )
          );
        });

        slaveIpPanel = React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'header2' },
            '\u0410\u0434\u0440\u0435\u0441\u0430 \u0432\u0442\u043E\u0440\u0438\u0447\u043D\u044B\u0445 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u0432:'
          ),
          React.createElement(
            'table',
            { style: { width: 'auto' } },
            React.createElement(
              'tbody',
              null,
              addresses
            )
          ),
          React.createElement(
            'div',
            { className: 'waves-effect waves-light btn', onClick: self.onAddSlaveIp },
            '\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C'
          )
        );
      }

      let data = {
        onClick: self.onSave
      };

      let content = null;
      if (self.state.enabled) {
        content = React.createElement(
          'div',
          null,
          React.createElement('hr', null),
          masterSlavePanel,
          React.createElement('hr', null),
          masterAddressPanel,
          slaveIpPanel
        );
      }

      return React.createElement(
        'div',
        { className: 'content-with-control-panel' },
        React.createElement(ControlPanel, { data: data }),
        React.createElement(
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
                { className: 'switch' },
                React.createElement(
                  'label',
                  null,
                  '\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C',
                  React.createElement('input', { type: 'checkbox', checked: self.state.enabled, onChange: self.onChangeEnabled }),
                  React.createElement('span', { className: 'lever' }),
                  '\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C'
                )
              ),
              content
            )
          )
        )
      );
    }
  });
});