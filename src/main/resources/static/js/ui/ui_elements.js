'use strict';

/**
 * Программные компоненты и виджеты
 */

define(['jquery', 'react', 'react-dom', 'core/events', 'objects', 'react-modal', 'utils/utils', 'utils/time', 'dao/accounts', 'dao/departments', 'core/logger'], function ($, React, ReactDOM, Events, Objects, Modal, Utils, Time, AccountsDao, DepartmentsDao, Log) {
  let Module = {
    EVENT_PANEL_COLLAPSE: 'EventPanelCollapse',
    EVENT_PANEL_EXPAND: 'EventPanelExpand'
  };
  return Objects.merge(Module, {
    /**
     * Панель с элементами управления.
     * 
     * Параметры:
     * open: [boolean],              // состояние свёрнуто/развёрнуто
     * icon: [string],               // путь до иконки (отображается слева в заголовке)
     * title: [string],              // заголовок окна
     * menuData: {                   // данные для создания меню
     *   items: [                    // список пунктов меню
     *     {
     *       render: [function],     // название пункта меню
     *       onClick: [function]     // обработчик по клику
     *     },
     *     {
     *       divider: 'line'       // разделитель
     *     },
     *     ...
     *   ]
     * }
     *        
     **/
    Panel: React.createClass({
      displayName: 'Panel',

      getInitialState: function () {
        return {
          open: this.props.data.open,
          collapseHandler: null,
          expandHandler: null
        };
      },
      componentDidMount: function () {
        let self = this;

        let collapseHandler = Events.addCallback(Module.EVENT_PANEL_COLLAPSE, function (data) {
          if (data.id === self.props.data.id) {
            self.setState({
              open: false
            });
          }
        });

        let expandHandler = Events.addCallback(Module.EVENT_PANEL_EXPAND, function (data) {
          if (data.id === self.props.data.id) {
            self.setState({
              open: true
            });
          }
        });

        this.setState({ collapseHandler: collapseHandler, expandHandler: expandHandler });
      },
      componentWillUnmount: function () {
        Events.removeCallback(Module.EVENT_PANEL_COLLAPSE, this.state.collapseHandler);
        Events.removeCallback(Module.EVENT_PANEL_EXPAND, this.state.expandHandler);
      },
      onCollapseClick: function (ev) {
        this.setState({
          open: !this.state.open
        });
      },
      render: function () {
        let self = this;

        let panelClassName = 'collapsible-panel';
        if (self.props.className) {
          panelClassName += ' ' + self.props.className;
        }

        if (!this.state.open) {
          panelClassName += ' collapsed';
        }

        let menuData = {
          items: [{
            render: function () {
              return self.state.open ? 'Свернуть' : 'Развернуть';
            },
            onClick: self.onCollapseClick
          }]
        };

        if (self.props.data && self.props.data.menuData && self.props.data.menuData.items) {
          menuData.items = self.props.data.menuData.items.concat(menuData.items);
        }

        return React.createElement(
          'div',
          { className: panelClassName, style: this.props.style },
          React.createElement(
            'div',
            { className: 'collapsible-panel-header' },
            React.createElement('div', { className: 'collapsible-panel-header-icon ' + self.props.data.iconClassName, alt: self.props.data.title, hidden: !self.props.data.iconClassName }),
            self.props.data.title,
            React.createElement(Module.Menu, { className: 'menu-panel-button', data: menuData })
          ),
          React.createElement(
            'div',
            { className: 'collapsible-panel-content' },
            this.props.children
          )
        );
      }
    }), // Panel
    /**
     * Простое меню.
     * 
     * Параметры:
     * className=[string]          // дополнительные классы для кастомизации
     * disabled=[boolean]          // включить/выключить компонент
     * data: {                     // данные по настройке и содержанию компонента
     *   items: [                  // список пунктов меню
     *     {
     *       render: [function],   // название пункта меню
     *       onClick: [function]   // обработчик по клику
     *     },
     *     {
     *       devider: 'line'     // разделитель
     *     },
     *     ...
     *   ]
     * }
     * 
     **/
    Menu: React.createClass({
      displayName: 'Menu',

      getInitialState: function () {
        return {
          open: false,
          mouseOuterClickHandler: null
        };
      },
      componentDidMount: function () {
        let self = this;

        let mouseOuterClickHandler = $(document).on('mouseup', function (e) {
          let container = $(self.refs.droplist);
          if (!container.is(e.target) && !container.has(e.target).length) {
            self.setState({ open: false });
          }
        });

        this.setState({ mouseOuterClickHandler: mouseOuterClickHandler });
      },
      componentWillUnmount: function () {
        let self = this;

        $(document).off('mouseup', self.state.mouseOuterClickHandler);

        self.setState({ mouseOuterClickHandler: null });
      },
      onClose: function (ev) {
        this.setState({
          open: false
        });
      },
      onClick: function (ev) {
        if (this.props.disabled) {
          return;
        }

        this.setState({
          open: !this.state.open
        });
      },
      render: function () {
        let self = this;

        let menuClassName = 'menu';
        if (self.props.className) {
          menuClassName += ' ' + self.props.className;
        }

        let items = [];

        if (self.props.data && self.props.data.items) {
          items = self.props.data.items.map(function (el, idx) {
            // Вертикальный разделитель
            if (el.divider) {
              return React.createElement('hr', { key: idx });
            }

            // Прочие элементы
            function onClickHook(ev) {
              if (el.onClick) {
                el.onClick(ev);
                self.onClose();
              }
            }

            return React.createElement(
              'div',
              { key: idx, className: 'menu-item', onClick: onClickHook },
              el.render()
            );
          });
        }

        return React.createElement(
          'div',
          { className: menuClassName },
          React.createElement(
            'div',
            { className: 'menu-button', onClick: this.onClick },
            React.createElement('i', { className: 'fa fa-bars', 'aria-hidden': 'true' })
          ),
          React.createElement(
            'div',
            { className: 'menu-content', hidden: !this.state.open },
            items
          )
        );
      }
    }), // Menu
    /**
     * Компонент для выбора дат
     *
     * Список параметров:
     * {
     *   caption: [string]           // заголовок
     *   date: [date]                // дата по умолчанию
     *   onChange: [function]        // функция обратного вызова при изменении даты
     * }
     **/
    Datepicker: React.createClass({
      displayName: 'Datepicker',

      componentDidMount: function () {
        let self = this;

        $(this.refs.picker).pickadate({
          closeOnSelect: true,
          onSet: function (context) {
            self.props.onChange(+context.select);
          },
          onStart: function () {
            if (self.props.date) {
              this.set('select', [self.props.date.getFullYear(), self.props.date.getMonth(), self.props.date.getDate()]);
              self.props.onChange(self.props.date.getTime());
            }
          },
          selectMonths: true,
          selectYears: 15
        });
      },
      componentWillReceiveProps: function (newProps) {
        if (newProps.date) {
          $(this.refs.picker).pickadate('picker').set('select', [newProps.date.getFullYear(), newProps.date.getMonth(), newProps.date.getDate()]);
        }
      },
      render: function () {
        return React.createElement(
          'div',
          { className: 'ui-element-item' },
          React.createElement(
            'div',
            { className: 'header2' },
            this.props.caption
          ),
          React.createElement('input', { ref: 'picker', type: 'date', className: 'datepicker with-element-width' })
        );
      }
    }), // Datepicker
    MonthPicker: React.createClass({
      displayName: 'MonthPicker',

      getInitialState: function () {
        return {
          isOpen: false,
          year: this.props.data.year,
          selectedYear: this.props.data.year,
          selectedMonth: this.props.data.month,
          clb1: null,
          clb2: null
        };
      },
      componentDidMount: function () {
        let self = this;

        let clb1 = Events.addCallback(Events.EVENT_KEY_ENTER, function () {
          if (self.state.isOpen) {
            self.onOk();
          }
        });

        let clb2 = Events.addCallback(Events.EVENT_KEY_ESC, function () {
          if (self.state.isOpen) {
            self.onCancel();
          }
        });

        self.setState({
          clb1: clb1,
          clb2: clb2
        });
      },
      componentWillUnmount: function () {
        Events.removeCallback(Events.EVENT_KEY_ENTER, this.state.clb1);
        Events.removeCallback(Events.EVENT_KEY_ESC, this.state.clb2);
      },
      componentWillReceiveProps: function (newProps) {
        this.setState({
          year: newProps.data.year,
          selectedYear: newProps.data.year,
          selectedMonth: newProps.data.month
        });
      },
      onChangeYear: function (ev) {
        let res = +ev.currentTarget.value;

        this.setState({
          year: res ? res : new Date().getFullYear(),
          month: 1
        });
      },
      onChangeMonth: function (ev) {
        this.setState({
          selectedYear: this.state.year,
          selectedMonth: +ev.currentTarget.id.substr('month'.length)
        });
      },
      onOK: function () {
        this.props.onChange({
          month: this.state.selectedMonth,
          year: this.state.selectedYear
        });
        this.hide();
      },
      onCancel: function () {
        this.hide();
        this.setState(this.getInitialState());
      },
      show: function () {
        this.setState({
          isOpen: true
        });
      },
      hide: function () {
        this.setState({
          isOpen: false
        });
      },
      rollLeft: function () {
        this.setState({
          year: --this.state.year
        });
      },
      rollRight: function () {
        this.setState({
          year: ++this.state.year
        });
      },
      isChecked: function (id) {
        return this.state.year === this.state.selectedYear && id === this.state.selectedMonth ? 'selected' : '';
      },
      render: function () {
        let style = this.props.style ? this.props.style : {
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
          },
          content: {
            margin: 'auto auto',
            position: 'relative',
            borderRadius: '5px',
            width: '600px'
          }
        };

        return React.createElement(
          'div',
          null,
          React.createElement('input', { type: 'text', className: 'with-element-width', readonly: true, value: this.state.selectedYear + '.' + (this.state.selectedMonth < 10 ? '0' : '') + this.state.selectedMonth, onClick: this.show }),
          React.createElement(
            Modal,
            { isOpen: this.state.isOpen, onRequestClose: this.props.onRequestClose, style: style },
            React.createElement(
              'div',
              { className: 'halign' },
              React.createElement(
                'span',
                { className: 'month-picker-arrow', onClick: this.rollLeft },
                '<'
              ),
              React.createElement('input', { className: 'month-picker-year-selector', type: 'text', value: this.state.year, onChange: this.onChangeYear }),
              React.createElement(
                'span',
                { className: 'month-picker-arrow', onClick: this.rollRight },
                '>'
              )
            ),
            React.createElement(
              'table',
              null,
              React.createElement(
                'tbody',
                null,
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'td',
                    { id: 'month1', onClick: this.onChangeMonth, className: this.isChecked(1) },
                    '\u042F\u043D\u0432'
                  ),
                  React.createElement(
                    'td',
                    { id: 'month2', onClick: this.onChangeMonth, className: this.isChecked(2) },
                    '\u0424\u0435\u0432'
                  ),
                  React.createElement(
                    'td',
                    { id: 'month3', onClick: this.onChangeMonth, className: this.isChecked(3) },
                    '\u041C\u0430\u0440'
                  ),
                  React.createElement(
                    'td',
                    { id: 'month4', onClick: this.onChangeMonth, className: this.isChecked(4) },
                    '\u0410\u043F\u0440'
                  )
                ),
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'td',
                    { id: 'month5', onClick: this.onChangeMonth, className: this.isChecked(5) },
                    '\u041C\u0430\u0439'
                  ),
                  React.createElement(
                    'td',
                    { id: 'month6', onClick: this.onChangeMonth, className: this.isChecked(6) },
                    '\u0418\u044E\u043D'
                  ),
                  React.createElement(
                    'td',
                    { id: 'month7', onClick: this.onChangeMonth, className: this.isChecked(7) },
                    '\u0418\u044E\u043B'
                  ),
                  React.createElement(
                    'td',
                    { id: 'month8', onClick: this.onChangeMonth, className: this.isChecked(8) },
                    '\u0410\u0432\u0433'
                  )
                ),
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'td',
                    { id: 'month9', onClick: this.onChangeMonth, className: this.isChecked(9) },
                    '\u0421\u0435\u043D'
                  ),
                  React.createElement(
                    'td',
                    { id: 'month10', onClick: this.onChangeMonth, className: this.isChecked(10) },
                    '\u041E\u043A\u0442'
                  ),
                  React.createElement(
                    'td',
                    { id: 'month11', onClick: this.onChangeMonth, className: this.isChecked(11) },
                    '\u041D\u043E\u044F'
                  ),
                  React.createElement(
                    'td',
                    { id: 'month12', onClick: this.onChangeMonth, className: this.isChecked(12) },
                    '\u0414\u0435\u043A'
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'center-align with-margin-top10' },
              React.createElement(
                'div',
                { className: 'waves-effect waves-light btn with-element-width', onClick: this.onOK },
                '\u0414\u0430'
              ),
              React.createElement(
                'div',
                { className: 'waves-effect waves-light btn with-element-width', onClick: this.onCancel },
                '\u041E\u0442\u043C\u0435\u043D\u0430'
              )
            )
          )
        );
      }
    }),
    AccountChooser: React.createClass({
      displayName: 'AccountChooser',

      getInitialState: function () {
        return {
          accounts: [],
          selectedAccount: null
        };
      },
      componentDidMount: function () {
        let self = this;

        if (self.props.useDefault) {
          AccountsDao.getAll({ name: '', limit: 1 }, function (res) {
            self.setState({
              accounts: res.rows ? res.rows : [],
              selectedAccount: null
            }, function () {
              if (!res.rows || !res.rows[0]) {
                return;
              }

              let ev = {
                currentTarget: {
                  id: res.rows[0].id
                }
              };

              self.onClick(ev);
            });
          }, function () {
            Log.error('Ошибка загрузки аккаунтов');
          });
        }
      },
      onChange: function () {
        let self = this;

        AccountsDao.getAll({ name: this.refs.lastName.value }, function (res) {
          self.setState({
            accounts: res.rows ? res.rows : [],
            selectedAccount: null
          });
        }, function () {
          Log.error('Ошибка загрузки аккаунтов');
        });
      },
      onClick: function (ev) {
        let res = Utils.findById(this.state.accounts, +ev.currentTarget.id);
        if (res) {
          this.setState({ selectedAccount: res });
          this.refs.lastName.value = res.lastName + ' ' + res.firstName + ' ' + res.middleName;
          this.props.onChange(res.id);
          Events.dispatchEvent(Events.EVENT_REPORT_METADATA_UPDATE, { account: res });
        }
      },
      render: function () {
        let self = this;

        let accounts = this.state.accounts.map(function (el, idx) {
          return React.createElement(
            'div',
            { id: el.id, key: idx, className: 'selector-item', onClick: self.onClick },
            el.lastName,
            ' ',
            el.firstName,
            ' ',
            el.middleName
          );
        });

        let droplistClassName = 'droplist-content2';
        switch (this.props.position) {
          case 'top':
            droplistClassName += ' droplist-position-top';
            break;
          case 'bottom':
            droplistClassName += ' droplist-position-bottom';
            break;
        }

        return React.createElement(
          'div',
          { className: 'ui-element-item' },
          React.createElement(
            'div',
            { className: 'header2' },
            '\u0412\u044B\u0431\u043E\u0440 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430'
          ),
          React.createElement(
            'div',
            { className: 'droplist with-element-width' },
            React.createElement('input', { ref: 'lastName', type: 'text', onChange: this.props.onChange, onClick: this.onChange, placeholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0444\u0430\u043C\u0438\u043B\u0438\u044E \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u0430', onChange: this.onChange }),
            React.createElement(
              'div',
              { className: droplistClassName, hidden: this.state.selectedAccount !== null },
              accounts
            )
          )
        );
      }
    }), // AccountChooser
    DepartmentChooser: React.createClass({
      displayName: 'DepartmentChooser',

      getInitialState: function () {
        return {
          departments: [],
          selectedDepartment: null
        };
      },
      componentDidMount: function () {
        let self = this;

        if (self.props.useDefault) {
          DepartmentsDao.getAll({ name: '', limit: 1 }, function (res) {
            self.setState({
              departments: res.rows ? res.rows : [],
              selectedDepartment: null
            }, function () {
              if (!res.rows || !res.rows[0]) {
                return;
              }

              let ev = {
                currentTarget: {
                  id: res.rows[0].id
                }
              };

              self.onClick(ev);
            });
          }, function () {
            Log.error('Ошибка загрузки отделов');
          });
        }
      },
      onChange: function () {
        let self = this;

        DepartmentsDao.getAll({ name: this.refs.name.value }, function (data) {
          self.setState({
            departments: data.rows ? data.rows : [],
            selectedDepartment: null
          });
        }, function () {
          Log.error('Ошибка загрузки отделов');
        });
      },
      onClick: function (ev) {
        let res = Utils.findById(this.state.departments, +ev.currentTarget.id);
        if (res) {
          this.setState({ selectedDepartment: res });
          this.refs.name.value = res.name;
          this.props.onChange(res.id);
          Events.dispatchEvent(Events.EVENT_REPORT_METADATA_UPDATE, { department: res });
        }
      },
      render: function () {
        let self = this;

        let departments = this.state.departments.map(function (el, idx) {
          return React.createElement(
            'div',
            { id: el.id, key: idx, className: 'selector-item', onClick: self.onClick },
            el.name
          );
        });

        let droplistClassName = 'droplist-content2';
        switch (this.props.position) {
          case 'top':
            droplistClassName += ' droplist-position-top';
            break;
          case 'bottom':
            droplistClassName += ' droplist-position-bottom';
            break;
        }

        return React.createElement(
          'div',
          { className: 'ui-element-item' },
          React.createElement(
            'div',
            { className: 'header2' },
            '\u0412\u044B\u0431\u043E\u0440 \u043E\u0442\u0434\u0435\u043B\u0430'
          ),
          React.createElement(
            'div',
            { className: 'droplist with-element-width' },
            React.createElement('input', { ref: 'name', type: 'text', onChange: this.props.onChange, onClick: this.onChange, placeholder: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043E\u0442\u0434\u0435\u043B\u0430', onChange: this.onChange }),
            React.createElement(
              'div',
              { className: droplistClassName, hidden: this.state.selectedDepartment !== null },
              departments
            )
          )
        );
      }
    }), // DepartmentChooser
    InOutEventTypeChooser: React.createClass({
      displayName: 'InOutEventTypeChooser',

      onChange: function (ev) {
        let el = $(ev.currentTarget);
        this.props.onChange({ id: +el.attr('data-id'), value: ev.currentTarget.checked });
      },
      render: function () {
        return React.createElement(
          'div',
          { className: 'ui-element-item' },
          React.createElement(
            'div',
            { className: 'header2' },
            '\u0412\u044B\u0431\u043E\u0440 \u0441\u043E\u0431\u044B\u0442\u0438\u0439'
          ),
          React.createElement('input', { id: 'chbxIn', 'data-id': '1', type: 'checkbox', className: 'filled-in', checked: this.props.eventTypes && this.props.eventTypes.indexOf(1) !== -1, onChange: this.onChange }),
          React.createElement(
            'label',
            { htmlFor: 'chbxIn' },
            '\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 - \u0412\u0445\u043E\u0434'
          ),
          React.createElement('br', null),
          React.createElement('input', { id: 'chbxOut', 'data-id': '2', type: 'checkbox', className: 'filled-in', checked: this.props.eventTypes && this.props.eventTypes.indexOf(2) !== -1, onChange: this.onChange }),
          React.createElement(
            'label',
            { htmlFor: 'chbxOut' },
            '\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 - \u0412\u044B\u0445\u043E\u0434'
          )
        );
      }
    }), // InOutEventTypeChooser
    AccessChooser: React.createClass({
      displayName: 'AccessChooser',

      render: function () {
        let values = [{
          id: 1,
          name: 'Свободный проход'
        }, {
          id: 2,
          name: 'Контроль прохода'
        }, {
          id: 3,
          name: 'Проход запрещён'
        }];

        let className = this.props.className ? ' ' + this.props.className : '';

        return React.createElement(Module.Select, { className: className, values: values, position: this.props.position, selectedValue: this.props.value, onChange: this.props.onChange });
      }
    }), // AccessChooser
    BuiltinFilterSelect: React.createClass({
      displayName: 'BuiltinFilterSelect',

      onChange: function (value) {
        this.props.onChange(this.props.id, +value);
      },
      render: function () {
        let className = 'built-in-filter' + (this.props.className ? ' ' + this.props.className : '');

        return React.createElement(Module.Select, { className: className, values: this.props.values, selectedValue: this.props.selectedValue, onChange: this.onChange });
      }
    }), // BuiltinFilterSelect
    ControlButton: React.createClass({
      displayName: 'ControlButton',

      onDown: function (ev) {
        $(ev.currentTarget).addClass('revert');
      },
      onUp: function (ev) {
        $(ev.currentTarget).removeClass('revert');
      },
      render: function () {
        let popup = null;
        if (this.props.data.dataTooltip) {
          popup = React.createElement(
            'div',
            { className: 'popup' },
            this.props.data.dataTooltip
          );
        }

        return React.createElement(
          'div',
          {
            className: 'button-control-panel tooltipped',
            'data-type': this.props.data.dataType || 0,
            style: this.props.style || {},
            onClick: this.props.data.onClick,
            onMouseDown: this.onDown,
            onMouseUp: this.onUp,
            onMouseLeave: this.onUp },
          React.createElement('div', { className: this.props.data.className }),
          popup
        );
      }
    }), // ControlButton
    ColorSelector: React.createClass({
      displayName: 'ColorSelector',

      getInitialState: function () {
        return {
          r: 0,
          g: 0,
          b: 0,
          color: '#000000',
          clb1: null,
          clb2: null
        };
      },
      componentDidMount: function () {
        let self = this;

        let clb1 = Events.addCallback(Events.EVENT_KEY_ENTER, function () {
          if (self.props.isOpen) {
            self.onOk();
          }
        });

        let clb2 = Events.addCallback(Events.EVENT_KEY_ESC, function () {
          if (self.props.isOpen) {
            self.props.onRequestClose();
          }
        });

        self.setState({
          clb1: clb1,
          clb2: clb2
        });
      },
      componentWillUnmount: function () {
        Events.removeCallback(Events.EVENT_KEY_ENTER, this.state.clb1);
        Events.removeCallback(Events.EVENT_KEY_ESC, this.state.clb2);
      },
      makeColor: function (_r, _g, _b) {
        let r = _r.toString(16),
            g = _g.toString(16),
            b = _b.toString(16);
        return '#' + (r < 10 ? '0' + r : r) + (g < 10 ? '0' + g : g) + (b < 10 ? '0' + b : b);
      },
      onChangeR: function (ev) {
        let r = +ev.currentTarget.value,
            g = this.state.g,
            b = this.state.b;
        this.setState({ r: r, color: this.makeColor(r, g, b) });
      },
      onChangeG: function (ev) {
        let g = +ev.currentTarget.value,
            r = this.state.r,
            b = this.state.b;
        this.setState({ g: g, color: this.makeColor(r, g, b) });
      },
      onChangeB: function (ev) {
        let b = +ev.currentTarget.value,
            r = this.state.r,
            g = this.state.g;
        this.setState({ b: b, color: this.makeColor(r, g, b) });
      },
      onChangeHex: function (ev) {
        let self = this;
        let color = ev.currentTarget.value;

        if (color.indexOf('#') === 0) {
          if (color.length === 7) {
            let r = parseInt(color.substr(1, 2), 16),
                g = parseInt(color.substr(3, 2), 16),
                b = parseInt(color.substr(5, 2), 16);
            self.setState({
              r: r,
              g: g,
              b: b,
              color: self.makeColor(r, g, b)
            });
          } else {
            self.setState({ color: color });
          }
        }
      },
      onClick: function (ev) {
        if (this.props.onRequestOk) {
          this.props.onRequestOk(this.makeColor(this.state.r, this.state.g, this.state.b));
        }
        this.props.onRequestClose();
      },
      render: function () {
        let style = {
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
          },
          content: {
            margin: 'auto auto',
            position: 'relative',
            borderRadius: '5px',
            width: '360px'
          }
        };

        let color = this.makeColor(this.state.r, this.state.g, this.state.b);

        return React.createElement(
          Modal,
          { isOpen: this.props.isOpen, onRequestClose: this.props.onRequestClose, style: style },
          React.createElement(
            'div',
            { className: 'header1' },
            '\u0412\u044B\u0431\u043E\u0440 \u0446\u0432\u0435\u0442\u0430'
          ),
          React.createElement(
            'div',
            { className: 'halign' },
            React.createElement('div', { className: 'color-preview', style: { 'background-color': color } })
          ),
          React.createElement(
            'table',
            null,
            React.createElement(
              'tbody',
              null,
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u041A\u0440\u0430\u0441\u043D\u044B\u0439'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'number', min: '0', max: '255', onChange: this.onChangeR, value: this.state.r })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u0417\u0435\u043B\u0451\u043D\u044B\u0439'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'number', min: '0', max: '255', onChange: this.onChangeG, value: this.state.g })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  '\u0421\u0438\u043D\u0438\u0439'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'number', min: '0', max: '255', onChange: this.onChangeB, value: this.state.b })
                )
              ),
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'td',
                  null,
                  'HEX'
                ),
                React.createElement(
                  'td',
                  null,
                  React.createElement('input', { type: 'text', onChange: this.onChangeHex, value: this.state.color })
                )
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'halign' },
            React.createElement(
              'div',
              { className: 'waves-effect waves-light btn with-element-half-width', onClick: this.onClick },
              '\u041E\u041A'
            ),
            React.createElement(
              'div',
              { className: 'waves-effect waves-light btn with-element-half-width', onClick: this.props.onRequestClose },
              '\u041E\u0442\u043C\u0435\u043D\u0430'
            )
          )
        );
      }
    }), // ColorSelector
    DropList: React.createClass({
      displayName: 'DropList',

      getInitialState: function () {
        return {
          optionsHidden: true,
          handler: null
        };
      },
      componentDidMount: function () {
        let self = this;

        let handler = $(document).on('mouseup', function (e) {
          let container = $(self.refs.droplist);
          if (!container.is(e.target) && !container.has(e.target).length) {
            self.setState({ optionsHidden: true });
          }
        });

        this.setState({ handler: handler });
      },
      componentWillUnmount: function () {
        let self = this;

        $(document).off('mouseup', self.state.handler);

        self.setState({ handler: null });
      },
      onClick: function (ev) {
        if (this.props.disabled) {
          return;
        }

        this.setState({ optionsHidden: !this.state.optionsHidden });
      },
      onChange: function (ev) {
        this.props.onChange(+$(ev.currentTarget).attr('data-value'));
        this.setState({ optionsHidden: true });
      },
      render: function () {
        let self = this;

        let className = 'droplist droplist-short' + (this.props.className ? ' ' + this.props.className : '');

        let items = [],
            currentItem = {
          id: 0,
          name: 'Не выбрано'
        };

        if (this.props.values) {
          items = this.props.values.map(function (el, idx) {
            let className = 'selector-item';

            if (self.props.selectedValue === el.id) {
              className += ' selected';
              currentItem = el;
            }

            return React.createElement(
              'div',
              { key: idx, className: className, 'data-value': el.id, onClick: self.onChange },
              el.name
            );
          });
        }

        let title = Utils.nvl(this.props.title, ' ');
        let headerClassName = 'droplist-header' + (!this.props.title ? ' with-caret' : '');

        return React.createElement(
          'div',
          { className: className, ref: 'droplist', disabled: !!this.props.disabled },
          React.createElement(
            'div',
            { className: headerClassName, onClick: this.onClick },
            this.props.title
          ),
          React.createElement(
            'div',
            { className: 'droplist-content', hidden: this.state.optionsHidden },
            items
          )
        );
      }
    }), // DropList
    Input: React.createClass({
      displayName: 'Input',

      getInitialState: function () {
        return {
          visible: false,
          handler: null
        };
      },
      componentDidMount: function () {
        let self = this;

        let handler = $(document).on('mouseup', function (e) {
          let container = $(self.refs.input);
          if (!container.is(e.target) && !container.has(e.target).length) {
            self.setState({ visible: false });
          }
        });

        this.setState({ handler: handler });
      },
      componentWillUnmount: function () {
        let self = this;

        $(document).off('mouseup', self.state.handler);

        self.setState({ handler: null });
      },
      onClick: function (ev) {
        this.setState({ visible: !this.state.visible });
      },
      onClose: function (ev) {
        this.setState({ visible: false });
      },
      onChange: function (ev) {
        this.props.onChange(ev.currentTarget.value);
      },
      onClear: function () {
        this.props.onChange('');
      },
      render: function () {
        let value = Utils.nvl(this.props.selectedValue, '');

        let title = Utils.nvl(this.props.title, ' ');
        let headerClassName = 'droplist-header' + (!this.props.title ? ' with-caret' : '');

        let droplistClassName = 'droplist-content input-content';
        switch (this.props.position) {
          case 'top':
            droplistClassName += ' droplist-position-top';
            break;
          case 'bottom':
            droplistClassName += ' droplist-position-bottom';
            break;
          case 'left':
            droplistClassName += ' droplist-position-left';
            break;
          case 'right':
            droplistClassName += ' droplist-position-right';
            break;
        }

        return React.createElement(
          'div',
          { className: 'droplist droplist-short', ref: 'input' },
          React.createElement(
            'div',
            { className: headerClassName, onClick: this.onClick },
            this.props.title
          ),
          React.createElement(
            'div',
            { className: droplistClassName, hidden: !this.state.visible },
            React.createElement('input', { type: 'text', className: 'with-element-width', onChange: this.onChange, placeholder: '\u0424\u0438\u043B\u044C\u0442\u0440', value: value }),
            React.createElement(
              'span',
              { className: 'btn', onClick: this.onClose },
              'OK'
            ),
            React.createElement(
              'span',
              { className: 'btn', onClick: this.onClear },
              '\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C'
            )
          )
        );
      }
    }), // Input
    Filter: React.createClass({
      displayName: 'Filter',

      getInitialState: function () {
        return {
          value: 0
        };
      },
      onClick: function (ev) {
        let self = this;

        let value = self.state.value + 1;
        if (value === 3) {
          value = 0;
        }
        self.setState({ value: value }, function () {
          self.props.onChange(this.props.config.id, +this.state.value);
        });
      },
      render: function () {
        let className = '';
        switch (this.state.value) {
          case 1:
            className = 'filter-down';
            break;
          case 2:
            className = 'filter-up';
            break;
          default:
            className = 'filter';
        }

        return React.createElement(
          'div',
          { className: className, onClick: this.onClick },
          this.props.children
        );
      }
    }), // Filter
    Tabs: React.createClass({
      displayName: 'Tabs',

      getInitialState: function () {
        return {
          selectedTab: this.props.data ? this.props.data[0].id : ''
        };
      },
      onClick: function (ev) {
        let id = $(ev.currentTarget).attr('data-id');
        this.setState({ selectedTab: id });
      },
      render: function () {
        let self = this;

        let delim = Math.floor(12 / this.props.data.length);
        delim = delim < 3 ? 3 : delim;

        let tabs = this.props.data.map(function (el, idx) {
          let className = 'col s' + delim + ' m' + delim + ' l' + delim + ' tab-header' + (self.state.selectedTab === el.id ? ' active' : '');
          return React.createElement(
            'div',
            { key: idx, 'data-id': el.id, className: className, onClick: self.onClick },
            el.name
          );
        });

        let tabContent = React.createElement(
          'div',
          null,
          '\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445'
        );
        for (let i = 0; i < this.props.children.length; i++) {
          if (this.props.children[i].props.id === self.state.selectedTab) {
            tabContent = this.props.children[i];
          }
        }

        return React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'row no-margin-bottom' },
            tabs
          ),
          React.createElement(
            'div',
            { className: 'tab-content-container' },
            tabContent
          )
        );
      }
    }), // Tabs
    /**
     * Простой cписок
     * 
     * Параметры:
     * values - пары значений { id: [number], name: [string] }
     * selectedValue - [number] - текущее значение
     * onChange - колбэк на изменение
     * className - класс, применяемый к контейнеру
     * 
     */
    List: React.createClass({
      displayName: 'List',

      onChange: function (ev) {
        this.props.onChange($(ev.currentTarget).attr('data-value'));
      },
      render: function () {
        let self = this;
        let items = self.props.values.map((el, idx) => {
          let className = 'list-item ' + (el.id === self.props.selectedValue ? 'selected' : '');

          return React.createElement(
            'div',
            { className: className, key: idx, 'data-value': el.id, onClick: self.onChange },
            el.name
          );
        });

        return React.createElement(
          'div',
          { className: 'list' },
          items
        );
      }
    }),
    /**
     * Простой селектор
     * 
     * Параметры:
     * values - пары значений { id: [number], name: [string] }
     * selectedValue - [number] - текущее значение
     * onChange - колбэк на изменение
     * className - класс, применяемый к контейнеру
     * 
     */
    Select: React.createClass({
      displayName: 'Select',

      getInitialState: function () {
        return {
          optionsHidden: true,
          handler: null
        };
      },
      componentDidMount: function () {
        let self = this;

        let handler = $(document).on('mouseup', function (e) {
          let container = $(self.refs.select);
          if (!container.is(e.target) && !container.has(e.target).length) {
            self.setState({ optionsHidden: true });
          }
        });

        this.setState({ handler: handler });
      },
      componentWillUnmount: function () {
        let self = this;

        $(document).off('mouseup', self.state.handler);

        self.setState({ handler: null });
      },
      onChange: function (ev) {
        this.props.onChange($(ev.currentTarget).attr('data-value'));
        this.setState({ optionsHidden: true });
      },
      onClick: function (ev) {
        if (this.props.disabled) {
          return;
        }

        this.setState({
          optionsHidden: !this.state.optionsHidden
        });
      },
      render: function () {
        let self = this;

        let items = [],
            currentItem = {
          id: 0,
          name: self.props.title || 'Не выбрано'
        };

        if (this.props.values) {
          items = this.props.values.map(function (el, idx) {
            let className = 'selector-item';

            if (self.props.selectedValue === el.id) {
              className += ' selected';
              currentItem = el;
            }

            return React.createElement(
              'div',
              { key: idx, className: className, 'data-value': el.id, onClick: self.onChange },
              el.name
            );
          });
        }

        if (currentItem === {}) {
          items.unshift(React.createElement(
            'div',
            { className: 'selector-item selected' },
            '\u041D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D\u043E'
          ));
        }

        let className = (this.props.className ? this.props.className + ' ' : '') + 'selector' + (this.props.className ? ' ' + this.props.className : '');

        let droplistClassName = 'selector-content';
        switch (this.props.position) {
          case 'top':
            droplistClassName += ' droplist-position-top';
            break;
          case 'bottom':
            droplistClassName += ' droplist-position-bottom';
            break;
        }

        return React.createElement(
          'div',
          { className: className, ref: 'select', disabled: !!this.props.disabled },
          React.createElement(
            'div',
            { className: 'selector-header', onClick: this.onClick },
            currentItem.name
          ),
          React.createElement(
            'div',
            { className: droplistClassName, hidden: this.state.optionsHidden },
            items
          )
        );
      }
    }), // Select
    /**
     * Элемент для задания времени суток
     * 
     * Параметры:
     * data: 
     * {
     *  id: [number],         // ид элемента
     *  value: [number],      // значение элемента
     *  onChange: [function([number], [number])]  // функция обратного вызова при изменении значения
     * }
     */
    Time: React.createClass({
      displayName: 'Time',

      getInitialState: function () {
        return {
          data: Time.formatTime(this.props.data.value)
        };
      },
      componentWillReceiveProps: function (newProps) {
        this.setState({ data: Time.formatTime(newProps.data.value) });
      },
      onChange: function (ev) {
        let self = this;

        if (self.props.disabled) {
          return;
        }

        let data = ev.currentTarget.value;

        self.setState({ data: data }, function () {
          let res = data.match(Time.TIME_REGEXP);
          if (res) {
            self.props.data.onChange({ id: self.props.data.id, value: Time.parseTime(data) });
          }
        });
      },
      render: function () {
        return React.createElement('input', { type: 'text', className: this.props.className || '', style: this.props.style || {}, pattern: Time.TIME_REGEXP, value: this.state.data, onChange: this.onChange });
      }
    }) // Time
  });
});