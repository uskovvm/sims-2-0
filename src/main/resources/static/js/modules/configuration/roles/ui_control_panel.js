'use strict';

define(['react', 'react-dom', 'ui/ui_elements'], function (React, ReactDOM, Elements) {
  return React.createClass({
    render: function () {
      let btnSaveData = {
        className: 'button-save',
        dataTooltip: 'Сохранить',
        onClick: this.props.onSave
      };

      return React.createElement(
        'div',
        { className: 'control-panel' },
        React.createElement(Elements.ControlButton, { data: btnSaveData })
      );
    }
  });
});