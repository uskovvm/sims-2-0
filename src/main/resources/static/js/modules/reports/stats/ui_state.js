'use strict';

define(['react', 'react-dom'], function (React, ReactDOM) {
  return React.createClass({
    render: function () {
      return React.createElement('div', { className: 'attendance-state attendance-state' + +this.props.data });
    }
  });
});