'use strict';

define(['react', 'react-dom', 'ui/ui_elements'], function (React, ReactDOM, Elements) {
  return React.createClass({
    render: function () {
      let identificationTypes = this.props.identificationTypes.slice();
      identificationTypes.unshift({ id: 0, name: 'Не выбрано' });

      return React.createElement(Elements.Select, { className: 'with-element-width', values: identificationTypes, selectedValue: this.props.selectedDevice.device.identificationTypeId, onChange: this.props.onChange });
    }
  });
});