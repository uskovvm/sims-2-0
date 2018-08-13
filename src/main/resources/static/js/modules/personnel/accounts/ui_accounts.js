'use strict';

define(['react', 'react-dom', 'utils/utils', './ui_account', 'ui/ui_elements', 'objects'], function (React, ReactDOM, Utils, Account, Elements, Objects) {
  return React.createClass({
    onChangeFilterName: function (value) {
      this.props.onChange('name', value);
    },
    onChangeFilterDepartment: function (value) {
      this.props.onChange('departmentId', value);
    },
    onChangeFilterOrganization: function (value) {
      this.props.onChange('organizationId', value);
    },
    onChangeFilterCardNumber: function (value) {
      /*if (value.length <= 10) {
        value = '0' + value;
      } else {
        value = value.substr(value.length - 10);
      }*/
      this.props.onChange('cardNumber', value);
    },
    render: function () {
      let self = this;

      let accounts = this.props.data.accounts.map(function (el, idx) {
        let department = Utils.findById(self.props.data.departments, el.departmentId);
        let organization = Utils.findById(self.props.data.organizations, el.organizationId);

        return React.createElement(Account, {
          data: el,
          departmentName: department ? department.name : '',
          organizationName: organization ? organization.name : '',
          key: idx,
          onSelect: self.props.onSelect,
          select: el.id === self.props.data.selectedAccount.id });
      });

      let firedFilterData = [{ id: 0, name: 'Все' }, { id: 1, name: 'Да' }, { id: 2, name: 'Нет' }];

      let deletedFilterData = [{ id: 0, name: 'Все' }, { id: 1, name: 'Да' }, { id: 2, name: 'Нет' }];

      let values = this.props.data.departments.map(function (el, idx) {
        return Objects.clone(el);
      });
      values.unshift({ id: 0, name: 'Все' });

      let organizationValues = this.props.data.organizations.map(function (el, idx) {
        return Objects.clone(el);
      });
      organizationValues.unshift({ id: 0, name: 'Все' });

      return React.createElement(
        'div',
        { className: 'table-wrapper' },
        React.createElement(
          'table',
          { className: 'highlight accounts-table' },
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
                React.createElement(
                  Elements.Filter,
                  { config: { id: 'name' }, onChange: this.props.onChangeSort },
                  '\u0424\u0418\u041E'
                ),
                ' ',
                React.createElement(Elements.Input, { position: 'left', selectedValue: Utils.nvl(this.props.data.filters['name'], ''), onChange: this.onChangeFilterName })
              ),
              React.createElement(
                'th',
                null,
                React.createElement(
                  Elements.Filter,
                  { config: { id: 'organizationId' }, onChange: this.props.onChangeSort },
                  '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F'
                ),
                ' ',
                React.createElement(Elements.DropList, { selectedValue: Utils.nvl(this.props.data.filters['organizationId'], 0), values: organizationValues, onChange: this.onChangeFilterOrganization })
              ),
              React.createElement(
                'th',
                null,
                React.createElement(
                  Elements.Filter,
                  { config: { id: 'departmentId' }, onChange: this.props.onChangeSort },
                  '\u041E\u0442\u0434\u0435\u043B'
                ),
                ' ',
                React.createElement(Elements.DropList, { selectedValue: Utils.nvl(this.props.data.filters['departmentId'], 0), values: values, onChange: this.onChangeFilterDepartment })
              ),
              React.createElement(
                'th',
                null,
                '\u0414\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C'
              ),
              React.createElement(
                'th',
                null,
                React.createElement(
                  Elements.Filter,
                  { config: { id: 'cardNumber' }, onChange: this.props.onChangeSort },
                  '\u041D\u043E\u043C\u0435\u0440 \u043A\u0430\u0440\u0442\u044B'
                ),
                ' ',
                React.createElement(Elements.Input, { selectedValue: /*Utils.prepareCardNumber(true, */this.props.data.filters['cardNumber'] /*)*/, onChange: this.onChangeFilterCardNumber })
              ),
              React.createElement(
                'th',
                null,
                '\u0423\u0432\u043E\u043B\u0435\u043D: ',
                React.createElement(
                  'span',
                  { style: { width: '42px', display: 'inline-block' } },
                  React.createElement(Elements.BuiltinFilterSelect, { selectedValue: this.props.data.filters['fired'], id: 'fired', values: firedFilterData, onChange: this.props.onChange })
                )
              ),
              React.createElement(
                'th',
                null,
                '\u0423\u0434\u0430\u043B\u0451\u043D: ',
                React.createElement(
                  'span',
                  { style: { width: '42px', display: 'inline-block' } },
                  React.createElement(Elements.BuiltinFilterSelect, { selectedValue: this.props.data.filters['deleted'], id: 'deleted', values: deletedFilterData, onChange: this.props.onChange })
                )
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            accounts
          )
        )
      );
    }
  });
});