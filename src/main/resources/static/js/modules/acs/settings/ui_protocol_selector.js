'use strict';

define(['react', 'react-dom', 'ui/ui_elements'], function (React, ReactDOM, Elements) {
  return React.createClass({
    render: function () {
      let selectedElementId = this.props.selectedDevice.connection.protocolId;
      if (selectedElementId === null) {
        selectedElementId = this.props.protocols && this.props.protocols.length ? this.props.protocols[0].id : '';
      }

      let protocols = this.props.protocols.slice();
      protocols.unshift({ id: 0, name: 'Не выбрано' });

      return React.createElement(Elements.Select, { className: 'with-element-width', selectedValue: selectedElementId, values: protocols, onChange: this.props.onChange });
    }
  });
});