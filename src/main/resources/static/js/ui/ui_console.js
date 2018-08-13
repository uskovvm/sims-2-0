'use strict';

define(['jquery', 'react', 'react-dom', 'core/events', 'utils/time'], function ($, React, ReactDOM, Events, Time) {
  let MAX_ITEMS = 100,
      DISPLAY_ITEMS = 10;

  return React.createClass({
    getInitialState: function () {
      return {
        strings: []
      };
    },
    componentDidMount: function () {
      Events.addCallback(Events.EVENT_CONSOLE_MESSAGE, this.onMessage);
      $('#__main__').css({ 'padding-bottom': '40px' });
    },
    onMessage: function (str) {
      let strings = this.state.strings;
      str.date = new Date();
      strings.push(str);
      if (strings.length > MAX_ITEMS) {
        strings.splice(0, strings.length - MAX_ITEMS);
      }
      this.setState({ strings: strings }, this.forceUpdate);
    },
    componentDidUpdate: function () {
      let self = this;

      let el = $(this.refs.messages);
      el.animate({ scrollTop: el.outerHeight() }, 'fast');
    },
    onChange: function (ev) {
      $('#__main__').css({ 'padding-bottom': !this.props.config.show ? '110px' : '40px' });
      this.props.config.onChange(ev);
    },
    render: function () {
      let strings = [],
          len = this.state.strings.length;

      for (let i = len - 1; i >= Math.max(len - DISPLAY_ITEMS, 0); i--) {
        strings.push(React.createElement(
          'div',
          null,
          Time.format('DDMMYYYYHHMMSS', this.state.strings[i].date),
          ': ',
          React.createElement(
            'b',
            null,
            this.state.strings[i].message
          )
        ));
      }

      strings.reverse();

      let messagesClassName = 'console-messages' + (this.props.config.show ? '' : ' hidden');

      return React.createElement(
        'div',
        { className: 'console' },
        React.createElement(
          'div',
          { className: 'console-button', onClick: this.onChange },
          React.createElement('i', { className: 'fa fa-bars' })
        ),
        React.createElement(
          'b',
          null,
          '\u041A\u043E\u043D\u0441\u043E\u043B\u044C:'
        ),
        React.createElement(
          'div',
          { className: messagesClassName },
          React.createElement(
            'div',
            { ref: 'messages' },
            strings
          )
        )
      );
    }
  });
});