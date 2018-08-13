'use strict';

define(['react', 'react-dom', 'dao/users', 'core/auth', 'ui/ui_elements', 'ui/ui_modal_confirm', './ui_modal_change_password', 'core/logger'], function (React, ReactDOM, UsersDao, Auth, Elements, ModalConfirm, ModalChangePassword, Log) {
  return React.createClass({
    getInitialState: function () {
      return {
        delDialogOpen: false,
        changePasswordDialogOpen: false
      };
    },
    onOpenDelDialog: function () {
      if (this.props.data.selectedUser.id === Auth.getUser().id) {
        Log.error('Пользователь не может удалить себя!');
        return;
      }
      this.setState({ delDialogOpen: true });
    },
    onOpenChangePasswordDialog: function () {
      this.setState({ changePasswordDialogOpen: true });
    },
    onCloseModal: function () {
      this.setState(this.getInitialState());
    },
    onUserDel: function () {
      this.props.onClick('delete', this.onCloseModal);
    },
    onPasswordReset: function (oldPassword, newPassword) {
      let self = this;

      let params = {
        id: this.props.data.selectedUser.id,
        oldPassword: oldPassword,
        newPassword: newPassword
      };

      UsersDao.setPassword(params, self.onCloseModal, self.onCloseModal);
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
        dataTooltip: 'Изменить',
        onClick: function () {
          self.props.onClick('edit');
        }
      };

      let btnDelData = {
        className: 'button-delete',
        dataTooltip: 'Удалить',
        onClick: this.onOpenDelDialog
      };

      let btnResetPasswordData = {
        className: 'button-reset-password',
        dataTooltip: 'Сбросить пароль',
        onClick: this.onOpenChangePasswordDialog
      };

      let buttons = null;
      if (Auth.hasPermission(Auth.Permission.PERM_USERS_MANAGEMENT)) {
        buttons = [React.createElement(Elements.ControlButton, { data: btnAddData }), React.createElement(Elements.ControlButton, { data: btnEditData }), React.createElement(Elements.ControlButton, { data: btnDelData })];
      }

      return React.createElement(
        'div',
        { className: 'control-panel' },
        buttons,
        React.createElement(Elements.ControlButton, { data: btnResetPasswordData }),
        React.createElement(ModalConfirm, { isOpen: this.state.delDialogOpen, onRequestClose: this.onCloseModal, onRequestOk: this.onUserDel }),
        React.createElement(ModalChangePassword, { isOpen: this.state.changePasswordDialogOpen, onRequestClose: this.onCloseModal, onRequestOk: this.onPasswordReset })
      );
    }
  });
});