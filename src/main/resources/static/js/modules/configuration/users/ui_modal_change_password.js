'use strict';

define(['react', 'react-dom', 'react-modal', 'core/events'], function (React, ReactDOM, Modal, Events) {
  return React.createClass({
    getInitialState: function () {
      return {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
        hasError: false,
        clb1: null,
        clb2: null
      };
    },
    componentDidMount: function () {
      let self = this;

      let clb1 = Events.addCallback(Events.EVENT_KEY_ENTER, function () {
        if (self.props.isOpen) {
          self.onOk();
        }
      });

      let clb2 = Events.addCallback(Events.EVENT_KEY_ESC, function () {
        if (self.props.isOpen) {
          self.onCancel();
        }
      });

      self.setState({
        clb1: clb1,
        clb2: clb2
      });
    },
    componentWillUnmount: function () {
      Events.removeCallback(Events.EVENT_KEY_ENTER, this.state.clb1);
      Events.removeCallback(Events.EVENT_KEY_ESC, this.state.clb2);
    },
    onOldPasswordChange: function (ev) {
      this.setState({ oldPassword: ev.currentTarget.value, hasError: false });
    },
    onNewPasswordChange: function (ev) {
      let self = this;

      self.setState({ newPassword: ev.currentTarget.value }, function () {
        self.setState({ hasError: self.state.newPassword !== self.state.newPasswordConfirm });
      });
    },
    onNewPasswordConfirmChange: function (ev) {
      let self = this;

      self.setState({ newPasswordConfirm: ev.currentTarget.value }, function () {
        self.setState({ hasError: self.state.newPassword !== self.state.newPasswordConfirm });
      });
    },
    onOk: function () {
      if (this.state.newPassword === this.state.newPasswordConfirm) {
        this.props.onRequestOk(this.state.oldPassword, this.state.newPassword);
      }
    },
    onCancel: function () {
      this.setState({
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
        hasError: false
      });
      this.props.onRequestClose();
    },
    render: function () {
      let style = {
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        },
        content: {
          margin: 'auto auto',
          position: 'relative',
          borderRadius: '5px',
          width: '300px'
        }
      };

      return React.createElement(
        Modal,
        { isOpen: this.props.isOpen, onRequestClose: this.props.onRequestClose, style: style },
        React.createElement(
          'div',
          { className: 'header1' },
          '\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C'
        ),
        React.createElement('input', { type: 'password', value: this.state.oldPassword, placeholder: '\u0421\u0442\u0430\u0440\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C', onChange: this.onOldPasswordChange }),
        React.createElement('br', null),
        React.createElement('input', { type: 'password', value: this.state.newPassword, placeholder: '\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C', onChange: this.onNewPasswordChange }),
        React.createElement('br', null),
        React.createElement('input', { type: 'password', value: this.state.newPasswordConfirm, placeholder: '\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0433\u043E \u043F\u0430\u0440\u043E\u043B\u044F', onChange: this.onNewPasswordConfirmChange }),
        React.createElement('br', null),
        React.createElement(
          'div',
          { className: 'alert', hidden: !this.state.hasError },
          '\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442!'
        ),
        React.createElement(
          'div',
          { className: 'center-align' },
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