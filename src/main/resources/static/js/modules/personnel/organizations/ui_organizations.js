'use strict';

define(['react', 'react-dom', './ui_organization'], function (React, ReactDOM, Organization) {
  return React.createClass({
    onSelect: function (ev) {
      this.props.onSelect(ev.currentTarget.id);
    },
    render: function () {
      let self = this;

      let organizations = self.props.data.organizations.map(function (el, idx) {
        let selected = el.id === self.props.data.selectedOrganization.id;
        return React.createElement(Organization, { key: idx, data: el, selected: selected, onSelect: self.onSelect });
      });

      return React.createElement(
        'div',
        { className: 'table-wrapper' },
        React.createElement(
          'table',
          { className: 'highlight organizations-table' },
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
                '\u041F\u043E\u043B\u043D\u043E\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'th',
                null,
                '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435'
              ),
              React.createElement(
                'th',
                null,
                '\u0421\u043F\u0438\u0441\u043E\u043A \u043E\u0442\u0434\u0435\u043B\u043E\u0432'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            organizations
          )
        )
      );
    }
  });
});