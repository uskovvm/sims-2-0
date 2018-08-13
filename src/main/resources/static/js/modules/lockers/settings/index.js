'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    render: function () {
      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(
            'div',
            { className: 'panel' },
            'Lockers'
          )
        )
      );
    }
  });
});