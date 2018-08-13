'use strict';

define(['react', 'react-dom', 'utils/utils', 'objects'], function (React, ReactDOM, Utils, Objects) {
  return React.createClass({
    render: function () {
      let account = this.props.data.selectedAccount;
      if (!account) {
        account = Objects.clone(Objects.Account);
      }

      let name = account.lastName + ' ' + account.firstName + ' ' + account.middleName,
          department = Utils.findById(this.props.data.departments, account.departmentId),
          organization = Utils.findById(this.props.data.organizations, account.organizationId);

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'header2' },
          '\u0414\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F'
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col s3' },
            React.createElement('img', { className: 'ui-avatar', src: account.avatar })
          ),
          React.createElement(
            'div',
            { className: 'col s9' },
            React.createElement(
              'span',
              { className: 'header3' },
              '\u0424\u0418\u041E:'
            ),
            ' ',
            name,
            React.createElement('br', null),
            React.createElement(
              'span',
              { className: 'header3' },
              '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F:'
            ),
            ' ',
            organization ? organization.name : '',
            React.createElement('br', null),
            React.createElement(
              'span',
              { className: 'header3' },
              '\u041E\u0442\u0434\u0435\u043B:'
            ),
            ' ',
            department ? department.name : '',
            React.createElement('br', null),
            React.createElement(
              'span',
              { className: 'header3' },
              '\u0414\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C:'
            ),
            ' ',
            account.position,
            React.createElement('br', null),
            React.createElement(
              'span',
              { className: 'header3' },
              '\u041D\u043E\u043C\u0435\u0440 \u043A\u0430\u0440\u0442\u044B:'
            ),
            ' ',
            Utils.prepareCardNumber(true, account.cardNumber),
            React.createElement('br', null),
            React.createElement(
              'span',
              { className: 'header3' },
              '\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D:'
            ),
            ' ',
            account.blocked ? 'Да' : 'Нет',
            React.createElement('br', null),
            React.createElement(
              'span',
              { className: 'header3' },
              '\u0423\u0432\u043E\u043B\u0435\u043D:'
            ),
            ' ',
            account.fired ? 'Да' : 'Нет',
            React.createElement('br', null),
            React.createElement(
              'span',
              { className: 'header3' },
              '\u0423\u0434\u0430\u043B\u0451\u043D:'
            ),
            ' ',
            account.deleted ? 'Да' : 'Нет'
          )
        )
      );
    }
  });
});