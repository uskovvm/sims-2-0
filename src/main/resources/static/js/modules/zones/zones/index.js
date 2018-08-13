'use strict';

define(['react', 'react-dom', './ui_control_panel', './ui_zones', 'utils/utils', 'dao/zones', 'objects', 'core/logger', 'core/auth', './ui_add_zone', './ui_edit_zone'], function (React, ReactDOM, ControlPanel, Zones, Utils, ZonesDao, Objects, Log, Auth, AddZone, EditZone) {
  return React.createClass({
    getInitialState: function () {
      return {
        zones: [],
        selectedZone: null,
        view: 'browse'
      };
    },
    componentDidMount: function () {
      let self = this;

      ZonesDao.getAll({}, function (data) {
        self.setState({
          zones: data.rows,
          selectedZone: data.rows ? data.rows[0] : null
        });
        Log.info('Зоны успешно загружены');
      }, function () {
        Log.error('Ошибка загрузки зон');
      });
    },
    onChange: function (id) {
      this.setState({ selectedZone: Utils.findById(this.state.zones, +id) });
    },
    onControlButtonClick: function (command, clb) {
      let self = this;

      if (command === 'delete') {
        if (!self.state.selectedZone) {
          return;
        }

        ZonesDao.del({ id: self.state.selectedZone.id }, function (data) {
          Log.info('Зона успешно удалена');

          let zones = self.state.zones;

          let idx = Utils.indexOfId(zones, self.state.selectedZone.id);
          if (idx >= 0) {
            zones.splice(idx, 1);
            self.setState({
              zones: zones,
              selectedZone: zones ? Objects.clone(zones[0]) : null
            });
          }

          clb ? clb() : 0;
        }, function () {
          Log.error('Ошибка удаления зоны');
          clb ? clb() : 0;
        });

        command = 'view';
      }

      this.setState({ view: command });
    },
    renderAdd: function () {
      let self = this;

      let data = {
        onOk: function (zone) {
          let zones = self.state.zones;
          zones.push(zone);
          self.setState({
            zones: zones,
            selectedZone: zone,
            view: 'browse'
          });
        },
        onCancel: function () {
          self.setState({ view: 'browse' });
        }
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(AddZone, { data: data })
        )
      );
    },
    renderEdit: function () {
      let self = this;

      let data = {
        onOk: function (zone) {
          let zones = self.state.zones;

          let idx = Utils.indexOfId(zones, zone.id);
          zones[idx] = zone;
          self.setState({
            zones: zones,
            selectedZone: zone,
            view: 'browse'
          });
        },
        onCancel: function () {
          self.setState({ view: 'browse' });
        },
        zone: self.state.selectedZone
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(EditZone, { data: data })
        )
      );
    },
    renderBrowse: function () {
      let className1 = '',
          controlPanel = null;

      if (Auth.hasPermission(Auth.Permission.PERM_ZONES_MANAGEMENT)) {
        className1 = 'content-with-control-panel';
        controlPanel = React.createElement(ControlPanel, { data: this.state, onClick: this.onControlButtonClick });
      }

      return React.createElement(
        'div',
        { className: className1 },
        controlPanel,
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'col s9 m9 s12' },
                React.createElement(Zones, { data: this.state, onChange: this.onChange })
              ),
              React.createElement(
                'div',
                { className: 'col s3 m3 s12' },
                React.createElement(
                  'div',
                  { className: 'panel' },
                  '\u0417\u043E\u043D\u0430 - \u044D\u0442\u043E \u043F\u043E\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u043E\u0431\u043B\u0430\u0441\u0442\u044C, \u0432 \u043A\u043E\u0442\u043E\u0440\u0443\u044E \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0445\u043E\u0434.'
                )
              )
            )
          )
        )
      );
    },
    render: function () {
      switch (this.state.view) {
        case 'add':
          return this.renderAdd();
        case 'edit':
          return this.renderEdit();
        case 'browse':
        default:
          return this.renderBrowse();
      }
    }
  });
});