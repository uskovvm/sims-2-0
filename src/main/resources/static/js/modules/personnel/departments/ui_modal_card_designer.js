'use strict';

define(['react', 'react-dom', 'react-modal', 'ui/ui_card_designer', 'dao/badges'], function (React, ReactDOM, Modal, CardDesigner, BadgesDao) {
  return React.createClass({
    getInitialState: function () {
      return {
        accounts: []
      };
    },
    componentWillReceiveProps: function (newProps) {
      let self = this;

      if (newProps.selectedDepartment && newProps.isOpen) {
        BadgesDao.getAll({ departmentId: newProps.selectedDepartment.id }, function (data) {
          self.setState({ accounts: data });
        });
      }
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
        React.createElement(CardDesigner, { accounts: this.state.accounts })
      );
    }
  });
});