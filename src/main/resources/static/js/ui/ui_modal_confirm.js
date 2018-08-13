'use strict';

define(['react', 'react-dom', 'react-modal', 'core/events'], function (React, ReactDOM, Modal, Events) {
  return React.createClass({
    getInitialState: function () {
      return {
        clb1: null,
        clb2: null
      };
    },
    componentDidMount: function () {
      let self = this;

      let clb1 = Events.addCallback(Events.EVENT_KEY_ENTER, function () {
        if (self.props.isOpen) {
          self.props.onRequestOk();
        }
      });

      let clb2 = Events.addCallback(Events.EVENT_KEY_ESC, function () {
        if (self.props.isOpen) {
          self.props.onRequestClose();
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
    render: function () {
      let style = this.props.style ? this.props.style : {
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        },
        content: {
          margin: 'auto auto',
          position: 'relative',
          borderRadius: '5px',
          width: '600px'
        }
      };

      let caption = this.props.caption ? this.props.caption : 'Вы уверены?';
      let text = this.props.text ? this.props.text : '';

      return React.createElement(
        Modal,
        { isOpen: this.props.isOpen, onRequestClose: this.props.onRequestClose, style: style },
        React.createElement(
          'div',
          { className: 'header2 halign' },
          caption
        ),
        React.createElement(
          'div',
          { className: 'halign' },
          text
        ),
        React.createElement(
          'div',
          { className: 'center-align with-margin-top10' },
          React.createElement(
            'div',
            { className: 'waves-effect waves-light btn with-element-width', onClick: this.props.onRequestOk },
            '\u0414\u0430'
          ),
          React.createElement(
            'div',
            { className: 'waves-effect waves-light btn with-element-width', onClick: this.props.onRequestClose },
            '\u041E\u0442\u043C\u0435\u043D\u0430'
          )
        )
      );
    }
  });
});