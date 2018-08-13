'use strict';

define(['jquery', 'react', 'react-dom'], function ($, React, ReactDOM) {
  return React.createClass({
    onChange: function (ev) {
      this.props.onChange($(ev.currentTarget).attr('data-id'), ev.currentTarget.checked);
    },
    render: function () {
      let id = 'chbx' + this.props.data.id;

      return React.createElement(
        'div',
        null,
        React.createElement('input', { type: 'checkbox', className: 'filled-in', id: id, 'data-id': this.props.data.id, onChange: this.onChange, checked: this.props.checked }),
        React.createElement(
          'label',
          { htmlFor: id },
          this.props.data.name
        )
      );
    }
  });
});