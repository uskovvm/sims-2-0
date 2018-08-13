'use strict';

define(['react', 'react-dom', 'utils/utils'], function (React, ReactDOM, Utils) {
  return React.createClass({
    render: function () {
      let className = 'clickable ' + (this.props.select ? 'selected' : '');
      let name = this.props.data.lastName + ' ' + this.props.data.firstName + ' ' + this.props.data.middleName;

      return React.createElement(
        'tr',
        { id: this.props.data.id, onClick: this.props.onSelect, className: className },
        React.createElement(
          'td',
          null,
          this.props.data.id
        ),
        React.createElement(
          'td',
          null,
          name
        ),
        React.createElement(
          'td',
          null,
          this.props.organizationName
        ),
        React.createElement(
          'td',
          null,
          this.props.departmentName
        ),
        React.createElement(
          'td',
          null,
          this.props.data.position
        ),
        React.createElement(
          'td',
          null,
          Utils.prepareCardNumber(10, this.props.data.cardNumber)
        ),
        React.createElement(
          'td',
          null,
          this.props.data.fired ? React.createElement(
            'span',
            { className: 'success' },
            '\u0414\u0430'
          ) : React.createElement(
            'span',
            { className: 'error' },
            '\u041D\u0435\u0442'
          )
        ),
        React.createElement(
          'td',
          null,
          this.props.data.deleted ? React.createElement(
            'span',
            { className: 'success' },
            '\u0414\u0430'
          ) : React.createElement(
            'span',
            { className: 'error' },
            '\u041D\u0435\u0442'
          )
        )
      );
    }
  });
});