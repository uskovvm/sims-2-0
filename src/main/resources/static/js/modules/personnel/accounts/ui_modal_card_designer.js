'use strict';

define(['react', 'react-dom', 'react-modal', 'ui/ui_card_designer', 'dao/badges'], function (React, ReactDOM, Modal, CardDesigner, BadgesDao) {
  return React.createClass({
    getInitialState: function () {
      return {
        account: null
      };
    },
    componentWillReceiveProps: function (newProps) {
      let self = this;

      if (!newProps.account || !newProps.isOpen) {
        this.setState({ account: null });
        return;
      }

      BadgesDao.get({ accountId: +newProps.account.id }, function (data) {
        self.setState({ account: data });
      });
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
          width: '720px'
        }
      };

      return React.createElement(
        Modal,
        { isOpen: this.props.isOpen, onRequestClose: this.props.onRequestClose, style: style },
        React.createElement(CardDesigner, { account: this.state.account })
      );
    }
  });
});