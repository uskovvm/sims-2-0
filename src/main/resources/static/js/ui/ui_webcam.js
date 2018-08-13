'use strict';

define(['jquery', 'react', 'react-dom', 'react-modal', 'react-webcam', 'core/events'], function ($, React, ReactDOM, Modal, Webcam, Events) {
  return React.createClass({
    getInitialState: function () {
      return {
        screenshot: null,
        currentImage: null,
        clb1: null,
        clb2: null
      };
    },
    componentDidMount: function () {
      let self = this;

      let clb1 = Events.addCallback(Events.EVENT_KEY_ENTER, function () {
        if (self.props.isOpen) {
          self.onSelectPhoto();
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

    handleClick: function () {
      const screenshot = this.webcam.getScreenshot();
      this.setState({ screenshot });
    },
    onShoot: function (data) {
      //let canvas = $('#webcamPhoto').first(), video = $('#webcamVideo').first();
      //let context = canvas.getContext('2d');
      //context.drawImage(video, 0, 0, video.width, video.height);
      //this.setState({ currentImage: canvas.toDataURL('image/png') });
      const currentImage = this.webcam.getScreenshot();
      this.setState({ currentImage });
    },
    onSelectPhoto: function () {
      this.props.onPhoto(this.state.currentImage);
    },
    render: function () {
      let style = {
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        },
        content: {
          margin: 'auto auto',
          borderRadius: '5px',
          position: 'relative',
          width: '360px'
        }
      };

      return React.createElement(
        Modal,
        { isOpen: this.props.isOpen, onRequestClose: this.props.onRequestClose, style: style },
        React.createElement(
          'div',
          { className: 'center-align' },
          React.createElement(
            'div',
            { className: 'header2', style: { marginTop: 0 } },
            '\u0412\u0435\u0431-\u043A\u0430\u043C\u0435\u0440\u0430'
          ),
          React.createElement(Webcam, {
            id: 'webcamVideo',
            audio: false,
            width: 320,
            height: 240,
            ref: node => this.webcam = node,
            screenshotFormat: 'image/png'
          }),
          React.createElement('br', null),
          React.createElement('img', { src: this.state.currentImage }),
          React.createElement('input', { className: 'waves-effect waves-light btn', type: 'button', value: '\u0421\u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0440\u043E\u0432\u0430\u0442\u044C', onClick: this.onShoot }),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'center-align' },
            React.createElement('input', { className: 'waves-effect waves-light btn', type: 'button', value: 'OK', onClick: this.onSelectPhoto }),
            React.createElement('input', { className: 'waves-effect waves-light btn', type: 'button', value: '\u041E\u0442\u043C\u0435\u043D\u0430', onClick: this.props.onRequestClose })
          )
        )
      );
    }
  });
});