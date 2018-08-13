'use strict';

const SAVE_TIMEOUT = 5000;

define(['react', 'react-dom', 'ui/ui_elements', 'dao/core', 'dao/zones', 'dao/devices', './ui_devices', 'utils/utils', 'objects', 'ui/ui_modal_confirm', './ui_device_settings', 'core/logger'], function (React, ReactDOM, Elements, CoreDao, ZonesDao, DevicesDao, Devices, Utils, Objects, ModalConfirm, DeviceSettings, Log) {
  return React.createClass({
    getInitialState: function () {
      return {
        deviceTypes: [],
        identificationTypes: [],
        devices: [],
        connections: [],
        connectionConfigs: [],
        protocols: [],
        zones: [],
        selectedDevice: null,
        delDialogOpen: false,
        error: null,
        autosave: null
      };
    },
    componentDidMount: function () {
      let self = this;

      let promise = new Promise((resolve, reject) => {
        ZonesDao.getAll({}, data => resolve({ zones: data.rows }), reject);
      });

      promise.then(res => {
        return new Promise((resolve, reject) => {
          CoreDao.getDeviceTypes({}, data => {
            res.deviceTypes = data;
            resolve(res);
          }, reject);
        });
      }).then(res => {
        return new Promise((resolve, reject) => {
          CoreDao.getIdentificationTypes({}, data => {
            res.identificationTypes = data;
            resolve(res);
          }, reject);
        });
      }).then(res => {
        return new Promise((resolve, reject) => {
          CoreDao.getProtocols({}, data => {
            res.protocols = data;
            resolve(res);
          }, reject);
        });
      }).then(res => {
        return new Promise((resolve, reject) => {
          CoreDao.getConnections({}, data => {
            res.connections = data;
            resolve(res);
          }, reject);
        });
      }).then(res => {
        return new Promise((resolve, reject) => {
          CoreDao.getConnectionConfig({}, data => {
            res.connectionConfigs = data;
            resolve(res);
          }, reject);
        });
      }).then(res => {
        return new Promise((resolve, reject) => {
          DevicesDao.getAll({}, data => {
            res.devices = data.rows;
            resolve(res);
          }, reject);
        });
      }).then(res => {
        res.selectedDevice = res.devices.length ? res.devices[0] : null;
        self.setState(res);
      });
    },
    onCloseModal: function () {
      this.setState({ delDialogOpen: false });
    },
    onOpenDelDialog: function () {
      this.setState({ delDialogOpen: true });
    },
    updateTimeout: function () {
      if (this.state.autosave !== null) {
        clearTimeout(this.state.autosave);
      }

      this.setState({ autosave: setTimeout(this.onSave, SAVE_TIMEOUT) });
    },
    deleteTimeout: function () {
      clearTimeout(this.state.autosave);
      this.setState({ autosave: null });
    },
    onSave: function (ev) {
      let self = this,
          devices = self.state.devices;

      // Копируем объект
      let data = Objects.clone(self.state.selectedDevice),
          dataId = data.id;

      if (data.connection.typeId === 0) {
        self.setState({
          error: {
            id: 1,
            description: 'Не выбран тип устройства!'
          }
        });

        return;
      }

      // Если объект - новый, удаляем временный ID
      if (typeof data.id === 'string') {
        delete data.id;
      }

      DevicesDao.set(data, responseData => {
        let idx = Utils.indexOfId(devices, dataId);
        if (idx >= 0) {
          data.id = responseData.response.id;
          devices[idx] = data;
          self.setState({ devices: devices, selectedDevice: data });
        }
        Log.info('Данные успешно сохранены');
      }, responseData => {
        self.setState({
          error: {
            id: 1,
            description: responseData.description
          }
        });

        Log.error('Ошибка сохранения данных');
      });

      self.deleteTimeout();
    },
    onAdd: function (ev) {
      let devices = this.state.devices;
      let newDevice = Objects.clone(Objects.Device);
      newDevice.name = 'Новое устройство';
      newDevice.id = 'tmp' + new Date().getTime();
      devices.push(newDevice);
      this.setState({ devices: devices, selectedDevice: Objects.clone(newDevice) });
    },
    onDelete: function (ev) {
      let self = this;

      // delete not saved device, which has id like 'tmpXXX'
      if (typeof this.state.selectedDevice.id === 'string') {
        this.deleteDevice(this.state.selectedDevice.id);
        self.onCloseModal();
        return;
      }

      DevicesDao.del({ id: self.state.selectedDevice.id }, data => {
        self.deleteDevice(self.state.selectedDevice.id);
        self.onCloseModal();
      }, self.onCloseModal);
    },
    deleteDevice: function (id) {
      let self = this;

      let devices = this.state.devices,
          selectedDevice = this.state.selectedDevice;

      for (let i = 0; i < devices.length; i++) {
        if (devices[i].id === id) {
          devices.splice(i, 1);

          self.setState({
            devices: devices,
            selectedDevice: devices && devices.length ? devices[0] : null
          });

          break;
        }
      }
    },
    onDeviceSelect: function (id) {
      this.setState({ selectedDevice: Utils.findById(this.state.devices, +id) });
    },
    onChangeEnabled: function (ev) {
      this.state.selectedDevice.enabled = ev.currentTarget.checked;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeDeviceType: function (value) {
      let device = this.state.selectedDevice;
      device.connection.typeId = +value;
      device.connection.protocolId = 0;
      device.connection.connectionId = 0;
      let el = this.state.deviceTypes.find((el, idx) => {
        return el.id === +value;
      });
      if (el) {
        switch (el.id) {
          case 1:
          case 6:
          case 7:
          case 9:
            device.access = {
              zoneAId: 0,
              zoneBId: 0,
              accessModeAB: 0,
              accessModeBA: 0
            };

            break;

          case 4:
            device.access = {
              zoneId: 0
            };

            break;
        }
      }

      this.setState({ selectedDevice: device, error: null }, this.updateTimeout);
    },
    onChangeProtocol: function (value) {
      this.state.selectedDevice.connection.protocolId = +value;
      this.state.selectedDevice.connection.connectionId = 0;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeConnection: function (value) {
      this.state.selectedDevice.connection.connectionId = +value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeAddr: function (ev) {
      this.state.selectedDevice.connection.addr = +ev.currentTarget.value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeName: function (ev) {
      this.state.selectedDevice.name = ev.currentTarget.value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeDescription: function (ev) {
      this.state.selectedDevice.description = ev.currentTarget.value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeIdx: function (ev) {
      this.state.selectedDevice.device.idx = +ev.currentTarget.value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeIdentificationType: function (value) {
      this.state.selectedDevice.device.identificationTypeId = +value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeWdtChannel: function (ev) {
      this.state.selectedDevice.device.wdtChannel = +ev.currentTarget.value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeBroken: function (ev) {
      this.state.selectedDevice.device.broken = ev.currentTarget.checked;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeInvert: function (ev) {
      this.state.selectedDevice.device.invert = ev.currentTarget.checked;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeDCBSyncTimeout: function (ev) {
      this.state.selectedDevice.device.syncTimeout = +ev.currentTarget.value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeCardAutoreg: function (ev) {
      this.state.selectedDevice.device.cardAutoreg = ev.currentTarget.checked;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeZoneA: function (value) {
      let access = this.state.selectedDevice.access || {};
      access.zoneAId = +value;
      this.state.selectedDevice.access = access;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeZoneB: function (value) {
      let access = this.state.selectedDevice.access || {};
      access.zoneBId = +value;
      this.state.selectedDevice.access = access;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeAccessModeAB: function (value) {
      let access = this.state.selectedDevice.access || {};
      access.accessModeAB = +value;
      this.state.selectedDevice.access = access;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeAccessModeBA: function (value) {
      let access = this.state.selectedDevice.access || {};
      access.accessModeBA = +value;
      this.state.selectedDevice.access = access;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeLogin: function (value) {
      this.state.selectedDevice.login = value.currentTarget.value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangePassword: function (value) {
      this.state.selectedDevice.password = value.currentTarget.value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeCameraId: function (value) {
      this.state.selectedDevice.cameraId = value.currentTarget.value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeCamera: function (value) {
      this.state.selectedDevice.device.cameraId = +value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeCameraTimeout: function (value) {
      this.state.selectedDevice.shotTimeout = +value.currentTarget.value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    onChangeDBConnection: function (value) {
      this.state.selectedDevice.device.dbConnectionId = +value;
      this.setState({ selectedDevice: this.state.selectedDevice, error: null }, this.updateTimeout);
    },
    render: function () {
      let btnAddData = {
        className: 'button-add',
        dataTooltip: 'Добавить',
        onClick: this.onAdd
      };

      let btnSaveData = {
        className: 'button-save',
        dataTooltip: 'Сохранить',
        onClick: this.onSave
      };

      let btnDelData = {
        className: 'button-delete',
        dataTooltip: 'Удалить',
        onClick: this.onOpenDelDialog
      };

      return React.createElement(
        'div',
        { className: 'content-with-control-panel' },
        React.createElement(
          'div',
          { className: 'control-panel' },
          React.createElement(Elements.ControlButton, { data: btnAddData }),
          React.createElement(Elements.ControlButton, { data: btnSaveData }),
          React.createElement(Elements.ControlButton, { data: btnDelData })
        ),
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
                { className: 'col s12 m4 l3' },
                React.createElement(Devices, { data: this.state, onSelect: this.onDeviceSelect })
              ),
              React.createElement(
                'div',
                { className: 'col s12 m8 l9' },
                React.createElement(DeviceSettings, {
                  data: this.state,
                  onChangeEnabled: this.onChangeEnabled,
                  onChangeDeviceType: this.onChangeDeviceType,
                  onChangeProtocol: this.onChangeProtocol,
                  onChangeConnection: this.onChangeConnection,
                  onChangeAddr: this.onChangeAddr,
                  onChangeName: this.onChangeName,
                  onChangeDescription: this.onChangeDescription,
                  onChangeIdx: this.onChangeIdx,
                  onChangeIdentificationType: this.onChangeIdentificationType,
                  onChangeWdtChannel: this.onChangeWdtChannel,
                  onChangeInvert: this.onChangeInvert,
                  onChangeBroken: this.onChangeBroken,
                  onChangeCardAutoreg: this.onChangeCardAutoreg,
                  onChangeZoneA: this.onChangeZoneA,
                  onChangeZoneB: this.onChangeZoneB,
                  onChangeAccessModeAB: this.onChangeAccessModeAB,
                  onChangeAccessModeBA: this.onChangeAccessModeBA,
                  onChangeLogin: this.onChangeLogin,
                  onChangePassword: this.onChangePassword,
                  onChangeCameraId: this.onChangeCameraId,
                  onChangeCamera: this.onChangeCamera,
                  onChangeCameraTimeout: this.onChangeCameraTimeout,
                  onChangeDCBSyncTimeout: this.onChangeDCBSyncTimeout,
                  onChangeDBConnection: this.onChangeDBConnection })
              )
            )
          )
        ),
        React.createElement(ModalConfirm, {
          isOpen: this.state.delDialogOpen,
          onRequestClose: this.onCloseModal,
          onRequestOk: this.onDelete })
      );
    }
  });
});