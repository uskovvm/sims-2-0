'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'core/events'], function (React, ReactDOM, Elements, Events) {
  return React.createClass({
    render: function () {
      let xlsData = {
        className: 'button-report-xls',
        dataTooltip: 'Сохранить в формате EXCEL',
        onClick: function () {
          Events.dispatchEvent(Events.EVENT_REPORT_MAKE, { format: 'xls' });
        }
      };

      let pdfData = {
        className: 'button-report-pdf',
        dataTooltip: 'Сохранить в формате PDF',
        onClick: function () {
          Events.dispatchEvent(Events.EVENT_REPORT_MAKE, { format: 'pdf' });
        }
      };

      let csvData = {
        className: 'button-report-csv',
        dataTooltip: 'Сохранить в формате CSV',
        onClick: function () {
          Events.dispatchEvent(Events.EVENT_REPORT_MAKE, { format: 'csv' });
        }
      };

      return React.createElement(
        'div',
        { className: 'control-panel' },
        React.createElement(Elements.ControlButton, { data: xlsData }),
        React.createElement(Elements.ControlButton, { data: pdfData }),
        React.createElement(Elements.ControlButton, { data: csvData })
      );
    }
  });
});