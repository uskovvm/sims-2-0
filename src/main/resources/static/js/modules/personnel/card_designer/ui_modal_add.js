'use strict';

define(['react', 'react-dom', 'react-modal', 'core/events'], function (React, ReactDOM, Modal, Events) {
  return React.createClass({
    getInitialState: function () {
      return {
        name: '',
        width: 86 * 6,
        height: 54 * 6,
        clb1: null,
        clb2: null
      };
    },
    componentDidMount: function () {
      let self = this;

      let clb1 = Events.addCallback(Events.EVENT_KEY_ENTER, function () {
        if (self.props.isOpen) {
          self.onClick();
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
    onChangeName: function (ev) {
      this.setState({ name: ev.currentTarget.value });
    },
    onChangeWidth: function (ev) {
      this.setState({ width: +ev.currentTarget.value });
    },
    onChangeHeight: function (ev) {
      this.setState({ height: +ev.currentTarget.value });
    },
    onClick: function () {
      this.props.onRequestOk(this.state);
      this.setState({
        name: '',
        width: 86 * 6,
        height: 54 * 6
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
          width: '600px'
        }
      };

      return React.createElement(
        Modal,
        { isOpen: this.props.isOpen, onRequestClose: this.props.onRequestClose, style: style },
        React.createElement(
          'div',
          { className: 'header1' },
          '\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D'
        ),
        React.createElement(
          'table',
          null,
          React.createElement(
            'tbody',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                null,
                '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'td',
                null,
                React.createElement('input', { type: 'text', onChange: this.onChangeName, value: this.state.name })
              )
            ),
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                null,
                '\u0428\u0438\u0440\u0438\u043D\u0430'
              ),
              React.createElement(
                'td',
                null,
                React.createElement('input', { type: 'number', onChange: this.onChangeWidth, value: this.state.width })
              )
            ),
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                null,
                '\u0412\u044B\u0441\u043E\u0442\u0430'
              ),
              React.createElement(
                'td',
                null,
                React.createElement('input', { type: 'number', onChange: this.onChangeHeight, value: this.state.height })
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'halign' },
          React.createElement(
            'div',
            { className: 'waves-effect waves-light btn with-element-width', onClick: this.onClick },
            '\u041E\u041A'
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