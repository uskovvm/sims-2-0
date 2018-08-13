'use strict';

define(['react', 'react-dom', 'react-draggable', 'utils/utils', 'core/socket', 'objects', './ui_control_panel', './ui_events_panel', './ui_gates_panel', './ui_turnstiles_panel', './ui_eth_controller_panel', './ui_door_controllers_panel', 'dao/departments', 'dao/zones', 'dao/devices', 'cookie'], function (React, ReactDOM, ReactDraggable, Utils, Socket, Objects, ControlPanel, EventsPanel, GatesPanel, TurnstilesPanel, EthControllersPanel, DoorControllersPanel, DepartmentsDao, ZonesDao, DevicesDao, Cookie) {
  // Константы
  let CONST_EVENTS_LENGTH = 6;
  let MODULE_NAME = 'acs/controls';

  return React.createClass({
    getInitialState: function () {
      return {
        events: [],
        filters: [],
        devices: [],
        departments: [],
        zones: [],
        currentEvent: null,
        currentEventTimer: null,
        showEventsPanel: true,
        showTurnstilesPanel: true,
        showEthControllersPanel: true,
        showGatesPanel: true,
        showDoorControllersPanel: true,
        showTooltips: true
      };
    },
    componentDidMount: function () {
      let self = this;

      DepartmentsDao.getAll({}, function (data) {
        self.setState({ departments: data.rows });
      });

      ZonesDao.getAll({}, function (data) {
        self.setState({ zones: data.rows });
      });

      DevicesDao.getAll({}, function (data) {
        let filters = [];

        if (data.rows instanceof Array) {
          for (let i = 0; i < data.rows.length; i++) {
            if (data.rows[i].enabled && data.rows[i].connection.typeId === 1) {
              filters.push(data.rows[i].id);
              data.rows[i] = Objects.compile(Objects.InOutEvent, data.rows[i]);
            }
          }
        }

        self.setState({
          devices: data.rows,
          filters: filters
        });
      });

      Socket.addCallback(Socket.EVENT_INOUT, self.appendEventAndReact);
      Socket.addCallback(Socket.EVENT_INOUT_TIMEOUT, self.appendEventAndReact /*self.handleEvent*/);
      Socket.addCallback(Socket.EVENT_DEVICE_STATE_CHANGE, self.changeDeviceState);

      let getEvents = {
        message: 'GetLastInOutsFunc',
        params: {
          limit: 10
        }
      };

      Socket.send(getEvents, function (data) {
        // Если в ответе пришла очередь событий - обработать её
        Socket.prepareEvent(data, self.appendEvent);
      });

      let res = Cookie.get('events');
      if (res) {
        let coord = res.split(',');
        this.setState({
          panelEvents: {
            x: coord[0],
            y: coord[1]
          }
        });
      }

      Cookie.get('turnstiles');
      if (res) {
        let coord = res.split(',');
        this.setState({
          panelTurnstiles: {
            x: coord[0],
            y: coord[1]
          }
        });
      }

      Cookie.get('doors');
      if (res) {
        let coord = res.split(',');
        this.setState({
          panelDoors: {
            x: coord[0],
            y: coord[1]
          }
        });
      }

      Cookie.get('gates');
      if (res) {
        let coord = res.split(',');
        this.setState({
          panelGates: {
            x: coord[0],
            y: coord[1]
          }
        });
      }
    },
    changeDeviceState: function (data) {
      let self = this;

      let event = Objects.compile(Objects.DeviceStateChangeEvent, data);

      let devices = self.state.devices;
      let idx = Utils.indexOfId(devices, data.event.deviceId);
      if (idx >= 0) {
        if (devices[idx].device.directionOpenMask) {
          devices[idx].device.directionOpenMask = event.data.directionOpenMask;
        }

        if ('state' in event.data) {
          devices[idx].device.state = event.data.state;
        }

        if ('mode' in event.data) {
          devices[idx].device.mode = event.data.mode;
        }
      }

      self.setState({ devices: devices }, function () {
        self.handleEvent(data);
      });
    },
    handleEvent: function (data) {
      let self = this;

      if (self.state.currentEventTimer) {
        clearTimeout(self.state.currentEventTimer);
      }

      let currentEventTimer = setTimeout(function () {
        clearTimeout(self.state.currentEventTimer);
        self.setState({ currentEvent: null, currentEventTimer: null });
      }, 2000);

      let obj = {};

      if (data.event.type.name === Socket.EVENT_DEVICE_STATE_CHANGE) {
        obj = Objects.DeviceStateChangeEvent;
      } else {
        obj = Objects.InOutEvent;
      }

      self.setState({ currentEvent: Objects.compile(obj, data), currentEventTimer: currentEventTimer });
    },
    appendEvent: function (data) {
      let self = this;
      let events = self.state.events;

      events.unshift(Objects.compile(Objects.InOutEvent, data));
      events.sort(function (a, b) {
        if (a.event.datetime > b.event.datetime) {
          return -1;
        }

        if (a.event.datetime < b.event.datetime) {
          return 1;
        }

        return 0;
      });

      if (events.length > CONST_EVENTS_LENGTH) {
        events = events.slice(0, CONST_EVENTS_LENGTH);
      }

      self.setState({ events: events });
    },
    appendEventAndReact: function (data) {
      this.appendEvent(data);
      this.handleEvent(data);
    },
    onChange: function (param) {
      let filters = this.state.filters,
          idx = filters.indexOf(param.id);

      if (param.checked && idx === -1) {
        filters.push(param.id);
      } else if (!param.checked && idx !== -1) {
        filters.splice(idx, 1);
      } else {
        return;
      }

      this.setState({ filters: filters });
    },
    onChangeView: function (name, value) {
      switch (name) {
        case 'events':
          this.setState({ showEventsPanel: value });
          break;
        case 'turnstiles':
          this.setState({ showTurnstilesPanel: value });
          break;
        case 'gates':
          this.setState({ showGatesPanel: value });
          break;
        case 'doorControllers':
          this.setState({ showDoorControllersPanel: value });
          break;
        case 'ethControllers':
          this.setState({ showEthControllersPanel: value });
          break;
        case 'showTooltips':
          this.setState({ showTooltips: value });
          break;
      }
    },
    onDrugStop: function (ev, obj) {
      Cookie.set(obj.node.id, obj.x + ',' + obj.y);
    },
    render: function () {
      let eventsPanelClassName = 'col s12 m5 l3' + (this.state.showEventsPanel ? '' : ' no-display'),
          turnstilesPanelClassName = 'col s12 m7 l9' + (this.state.showTurnstilesPanel ? '' : ' no-display'),
          ethControllersPanelClassName = 'col s12 m7 l9' + (this.state.showEthControllersPanel ? '' : ' no-display'),
          gatesPanelClassName = 'col s12 m7 l9' + (this.state.showGatesPanel ? '' : ' no-display'),
          doorControllersClassName = 'col s12 m7 l9' + (this.state.showDoorControllersPanel ? '' : ' no-display');

      let panelConfig = {
        moduleName: MODULE_NAME,
        devices: this.state.devices,
        zones: this.state.zones,
        onChange: this.onChange
      };

      let eventPanelConfig = {
        devices: this.state.devices,
        events: this.state.events,
        filters: this.state.filters,
        departments: this.state.departments
      };

      let dragParamsEvents = {
        handle: '.collapsible-panel-header',
        bounds: 'parent',
        zIndex: 100,
        onStop: this.onDrugStop
      };

      if (this.state.panelEvents) {
        dragParamsEvents.x = this.state.panelEvents.x;
        dragParamsEvents.y = this.state.panelEvents.y;
      }

      let dragParamsTurnstiles = {
        handle: '.collapsible-panel-header',
        bounds: 'parent',
        zIndex: 100,
        onStop: this.onDrugStop
      };

      if (this.state.panelTurnstiles) {
        dragParamsTurnstiles.x = this.state.panelTurnstiles.x;
        dragParamsTurnstiles.y = this.state.panelTurnstiles.y;
      }

      let dragParamsGates = {
        handle: '.collapsible-panel-header',
        bounds: 'parent',
        zIndex: 100,
        onStop: this.onDrugStop
      };

      if (this.state.panelGates) {
        dragParamsGates.x = this.state.panelGates.x;
        dragParamsGates.y = this.state.panelGates.y;
      }

      let dragParamsDoors = {
        handle: '.collapsible-panel-header',
        bounds: 'parent',
        zIndex: 100,
        onStop: this.onDrugStop
      };

      if (this.state.panelDoors) {
        dragParamsDoors.x = this.state.panelDoors.x;
        dragParamsDoors.y = this.state.panelDoors.y;
      }

      let dragParamsEthControllers = {
        handle: '.collapsible-panel-header',
        bounds: 'parent',
        zIndex: 100,
        onStop: this.onDrugStop
      };

      if (this.state.panelEthControllers) {
        dragParamsEthControllers.x = this.state.panelEthControllers.x;
        dragParamsEthControllers.y = this.state.panelEthControllers.y;
      }

      return React.createElement(
        'div',
        { className: 'content-with-control-panel' + (this.state.showTooltips ? '' : 'no-tooltips') },
        React.createElement(ControlPanel, { data: this.state, onChangeView: this.onChangeView }),
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'draggable-container' },
              React.createElement(
                ReactDraggable,
                dragParamsEvents,
                React.createElement(
                  'div',
                  { id: 'events', className: 'draggable-wrapper', style: { display: this.state.showEventsPanel ? 'inline-block' : 'none' } },
                  React.createElement(EventsPanel, { data: eventPanelConfig })
                )
              ),
              React.createElement(
                ReactDraggable,
                dragParamsTurnstiles,
                React.createElement(
                  'div',
                  { id: 'turnstiles', className: 'draggable-wrapper', style: { left: '360px', display: this.state.showTurnstilesPanel ? 'inline-block' : 'none' } },
                  React.createElement(TurnstilesPanel, { data: panelConfig, event: this.state.currentEvent })
                )
              ),
              React.createElement(
                ReactDraggable,
                dragParamsGates,
                React.createElement(
                  'div',
                  { id: 'gates', className: 'draggable-wrapper', style: { top: '0', right: '10px', display: this.state.showGatesPanel ? 'inline-block' : 'none' } },
                  React.createElement(GatesPanel, { data: panelConfig, event: this.state.currentEvent })
                )
              ),
              React.createElement(
                ReactDraggable,
                dragParamsDoors,
                React.createElement(
                  'div',
                  { id: 'doors', className: 'draggable-wrapper', style: { top: '330px', left: '360px', display: this.state.showDoorControllersPanel ? 'inline-block' : 'none' } },
                  React.createElement(DoorControllersPanel, { data: panelConfig, event: this.state.currentEvent })
                )
              ),
              React.createElement(
                ReactDraggable,
                dragParamsEthControllers,
                React.createElement(
                  'div',
                  { id: 'ethControllers', className: 'draggable-wrapper', style: { top: '330px', left: '700px', display: this.state.showEthControllersPanel ? 'inline-block' : 'none' } },
                  React.createElement(EthControllersPanel, { data: panelConfig, event: this.state.currentEvent })
                )
              )
            )
          )
        )
      );
    }
  });
});