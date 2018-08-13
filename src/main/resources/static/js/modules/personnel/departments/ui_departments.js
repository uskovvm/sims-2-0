'use strict';

define(['react', 'react-dom', './ui_department', 'utils/utils'], function (React, ReactDOM, Department, Utils) {
  return React.createClass({
    onSelect: function (ev) {
      this.props.onSelect(ev.currentTarget.id);
    },
    render: function () {
      let self = this;

      let departments = self.props.data.departments.map(function (el, idx) {
        let selected = el.id === self.props.data.selectedDepartment.id;
        let organizationName = Utils.findById(self.props.data.organizations, el.organizationId);
        organizationName = organizationName ? organizationName.name : '';
        return React.createElement(Department, { key: idx, data: el, organizationName: organizationName, selected: selected, onSelect: self.onSelect });
      });

      return React.createElement(
        'div',
        { className: 'table-wrapper' },
        React.createElement(
          'table',
          { className: 'highlight departments-table' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                '\u0418\u0414'
              ),
              React.createElement(
                'th',
                null,
                '\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'th',
                null,
                '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'th',
                null,
                '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            departments
          )
        )
      );
    }
  });
});