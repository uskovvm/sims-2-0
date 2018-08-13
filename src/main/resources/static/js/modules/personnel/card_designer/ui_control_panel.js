'use strict';

define(['jquery', 'react', 'react-dom', 'ui/ui_elements', 'ui/ui_modal_confirm', './ui_modal_add', 'dao/badges', 'svg', 'svg-draggable', 'svg-select', 'svg-resize'], function ($, React, ReactDOM, Elements, ModalConfirm, ModalAdd, BadgesDao, SVG) {
  let CONST_ROUND = 20;

  return React.createClass({
    getInitialState: function () {
      return {
        addDialogOpen: false,
        saveDialogOpen: false,
        delDialogOpen: false
      };
    },
    onCloseModal: function () {
      this.setState({
        addDialogOpen: false,
        saveDialogOpen: false,
        delDialogOpen: false
      });
    },
    onAdd: function () {
      this.setState({ addDialogOpen: true });
    },
    onSave: function () {
      this.setState({ saveDialogOpen: true });
    },
    onDel: function () {
      this.setState({ delDialogOpen: true });
    },
    onAddTemplate: function (data) {
      let self = this;

      $('#tmpSVG').empty();
      let draw = SVG('tmpSVG').size(data.width, data.height);
      draw.rect(data.width, data.height).attr({ fill: '#ffffff', rx: CONST_ROUND, ry: CONST_ROUND });

      let obj = {
        name: data.name,
        template: $('#tmpSVG').html(),
        params: []
      };

      $('#tmpSVG').empty();

      BadgesDao.setTemplate(obj, function (res) {
        obj.id = res.response.id;
        self.props.onClick('add', obj);
        self.onCloseModal();
      });
    },
    onSaveTemplate: function (data) {
      let self = this;

      this.props.funcUnbindSelectedElement();

      let draw = SVG('tmpSVG').size(data.width, data.height);
      draw.rect(data.width, data.height).attr({ fill: '#ffffff' });

      let obj = self.props.selectedTemplate;
      obj.template = $('#templatePreview').html();

      BadgesDao.setTemplate(obj, function (res) {
        self.props.onClick('save', obj);
        self.onCloseModal();
      });
    },
    onDelTemplate: function () {
      let self = this;

      BadgesDao.delTemplate({ id: self.props.selectedTemplate.id }, function (res) {
        self.props.onClick('del');
        self.onCloseModal();
      });
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
        onClick: this.onDel
      };

      return React.createElement(
        'div',
        { className: 'control-panel' },
        React.createElement(Elements.ControlButton, { data: btnAddData }),
        React.createElement(Elements.ControlButton, { data: btnSaveData }),
        React.createElement(Elements.ControlButton, { data: btnDelData }),
        React.createElement(ModalAdd, {
          isOpen: this.state.addDialogOpen,
          onRequestClose: this.onCloseModal,
          onRequestOk: this.onAddTemplate }),
        React.createElement(ModalConfirm, {
          isOpen: this.state.saveDialogOpen,
          caption: 'Сохранить',
          text: 'Прошлое значение будет переписано при сохранении. Продолжить?',
          onRequestClose: this.onCloseModal,
          onRequestOk: this.onSaveTemplate }),
        React.createElement(ModalConfirm, {
          isOpen: this.state.delDialogOpen,
          caption: 'Удалить',
          text: 'Вы уверены?',
          onRequestClose: this.onCloseModal,
          onRequestOk: this.onDelTemplate }),
        React.createElement('div', { id: 'tmpSVG', style: { display: 'none' } })
      );
    }
  });
});