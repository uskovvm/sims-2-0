'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'ui/ui_modal_confirm'], function (React, ReactDOM, Elements, ModalConfirm) {
  return React.createClass({
    getInitialState: function () {
      return {
        delDialogOpen: false
      };
    },
    onCloseModal: function () {
      this.setState(this.getInitialState());
    },
    onOpenDelDialog: function () {
      this.setState({ delDialogOpen: true });
    },
    onZoneDel: function () {
      this.props.onClick('delete', this.onCloseModal);
    },
    render: function () {
      let self = this;
      let btnAddData = {
        className: 'button-add',
        dataTooltip: 'Добавить',
        onClick: function () {
          self.props.onClick('add');
        }
      };

      let btnEditData = {
        className: 'button-edit',
        dataTooltip: 'Редактировать',
        onClick: function () {
          self.props.onClick('edit');
        }
      };

      let btnDelData = {
        className: 'button-delete',
        dataTooltip: 'Удалить',
        onClick: this.onOpenDelDialog
      };

      return React.createElement(
        'div',
        { className: 'control-panel' },
        React.createElement(Elements.ControlButton, { data: btnAddData }),
        React.createElement(Elements.ControlButton, { data: btnEditData }),
        React.createElement(Elements.ControlButton, { data: btnDelData }),
        React.createElement(ModalConfirm, {
          isOpen: this.state.delDialogOpen,
          caption: 'Удаление',
          text: 'Вы уверены?',
          onRequestClose: this.onCloseModal,
          onRequestOk: this.onZoneDel })
      );
    }
  });
});