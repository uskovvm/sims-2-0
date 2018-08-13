'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'dao/calendar', 'utils/utils', 'core/logger'], function (React, ReactDOM, Elements, CalendarDao, Utils, Log) {
  return React.createClass({
    getInitialState: function () {
      return {
        selectedZone: null,
        schedule: []
      };
    },
    componentDidMount: function () {
      this.loadSchedule(this.props.zones ? this.props.zones[0].id : null);
    },
    loadSchedule: function (zoneId) {
      let self = this;

      if (zoneId === null) {
        return;
      }

      zoneId = +zoneId;

      CalendarDao.getWeek({ zoneId: zoneId }, function (res) {
        self.setState({ selectedZone: zoneId, schedule: res });
      }, function () {
        Log.error('Ошибка получения расписания');
        self.setState({ schedule: [] });
      });
    },
    onChange: function (id) {
      this.loadSchedule(+id);
    },
    onChangeSchedule: function (ev) {
      let scheduleId = +ev.currentTarget.id.substr('choice'.length),
          acl = this.props.acl,
          zones = acl.zones;

      if (ev.currentTarget.checked) {
        let idx = Utils.indexOfId(zones, +this.state.selectedZone, 'zoneId');
        if (idx === -1) {
          let selectedSchedule = {
            zoneId: this.state.selectedZone,
            weekSchedules: [scheduleId]
          };
          zones.push(selectedSchedule);
        } else {
          if (zones[idx].weekSchedules.indexOf(scheduleId) === -1) {
            zones[idx].weekSchedules.push(scheduleId);
          }
        }
      } else {
        let idx = Utils.indexOfId(zones, this.state.selectedZone, 'zoneId');
        if (idx !== -1) {
          let idx2 = zones[idx].weekSchedules.indexOf(scheduleId);
          if (idx2 !== -1) {
            zones[idx].weekSchedules.splice(idx2, 1);
          }
        }
      }

      acl.zones = zones;

      this.props.onChange(acl);
    },
    onChangeAccessTypeAll: function (ev) {
      let acl = this.props.acl,
          accessType = +ev.currentTarget.id.substr('ra'.length);
      acl.accessTypeId = accessType;
      delete acl.zones;
      this.props.onChange(acl);
    },
    onChangeAccessType: function (ev) {
      let acl = this.props.acl,
          accessType = +ev.currentTarget.id.substr('r'.length);

      // Вычленяем тип доступа
      let zones = acl.zones || [],

      // Ищем элемент расписания
      idx = Utils.indexOfId(zones, this.state.selectedZone, 'zoneId');

      // Если тип доступа - 'Никогда', удаляем элемент за ненадобностью
      if (accessType === 0) {
        if (idx !== -1) {
          zones.splice(idx, 1);
        }
      } else {
        // Если такой элемент уже существует - просто меняем значения
        if (idx !== -1) {
          zones[idx].accessTypeId = accessType;
          if (accessType === 1 || accessType === 3) {
            delete zones[idx].weekSchedules;
          } else {
            zones[idx].weekSchedules = [];
          }
        } else {
          // В противном случае - добавляем новый элемент
          let zone = {
            zoneId: this.state.selectedZone,
            accessTypeId: accessType,
            weekSchedules: [],
            isWorkZone: false
          };

          if (accessType === 1 || accessType === 3) {
            delete zone.weekSchedules;
          }

          zones.push(zone);
        }
      }

      acl.zones = zones;

      // Передаём изменения
      this.props.onChange(acl);
    },
    onChangeACLType: function (ev) {
      let acl = this.props.acl;
      acl.aclTypeId = +ev.currentTarget.id.substr('access'.length);
      acl.accessTypeId = 0;
      this.props.onChange(acl);
    },
    onChangeWorkZone: function (ev) {
      let acl = this.props.acl,
          zones = acl.zones;

      let idx = Utils.indexOfId(zones, this.state.selectedZone, 'zoneId');
      if (idx !== -1) {
        zones[idx].isWorkZone = ev.currentTarget.checked;
        acl.zones = zones;
        this.props.onChange(acl);
      }
    },
    render: function () {
      let self = this;

      let acl = self.props.acl,
          zones = acl.zones;

      let content = null,
          workZone = null;

      let currentZoneACL = Utils.findById(zones, self.state.selectedZone, 'zoneId');

      if (this.state.schedule !== [] && currentZoneACL && currentZoneACL.accessTypeId === 2) {
        let days = self.state.schedule.map(function (el, idx) {
          let startTimeConfig = {
            id: 'start' + idx,
            value: el.startTime
          };

          let endTimeConfig = {
            id: 'end' + idx,
            value: el.endTime
          };

          let isChecked = currentZoneACL ? currentZoneACL.weekSchedules.indexOf(+el.id) === -1 ? false : true : false;

          return React.createElement(
            'tr',
            { key: idx },
            React.createElement(
              'td',
              null,
              React.createElement('input', { className: 'filled-in', id: 'choice' + el.id, checked: isChecked, onChange: self.onChangeSchedule, type: 'checkbox' }),
              React.createElement('label', { htmlFor: 'choice' + el.id })
            ),
            React.createElement(
              'td',
              null,
              el.days[0] ? 'V' : 'X'
            ),
            React.createElement(
              'td',
              null,
              el.days[1] ? 'V' : 'X'
            ),
            React.createElement(
              'td',
              null,
              el.days[2] ? 'V' : 'X'
            ),
            React.createElement(
              'td',
              null,
              el.days[3] ? 'V' : 'X'
            ),
            React.createElement(
              'td',
              null,
              el.days[4] ? 'V' : 'X'
            ),
            React.createElement(
              'td',
              null,
              el.days[5] ? 'V' : 'X'
            ),
            React.createElement(
              'td',
              null,
              el.days[6] ? 'V' : 'X'
            ),
            React.createElement(
              'td',
              null,
              React.createElement(Elements.Time, { data: startTimeConfig, disabled: true })
            ),
            React.createElement(
              'td',
              null,
              React.createElement(Elements.Time, { data: endTimeConfig, disabled: true })
            )
          );
        });

        content = React.createElement(
          'table',
          null,
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                null,
                '\u0412\u044B\u0431\u043E\u0440'
              ),
              React.createElement(
                'th',
                null,
                '\u041F\u041D'
              ),
              React.createElement(
                'th',
                null,
                '\u0412\u0422'
              ),
              React.createElement(
                'th',
                null,
                '\u0421\u0420'
              ),
              React.createElement(
                'th',
                null,
                '\u0427\u0422'
              ),
              React.createElement(
                'th',
                null,
                '\u041F\u0422'
              ),
              React.createElement(
                'th',
                null,
                '\u0421\u0411'
              ),
              React.createElement(
                'th',
                null,
                '\u0412\u0421'
              ),
              React.createElement(
                'th',
                null,
                '\u0421'
              ),
              React.createElement(
                'th',
                null,
                '\u041F\u041E'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            days
          )
        );
      }

      if (currentZoneACL && currentZoneACL.accessTypeId !== 0) {
        workZone = React.createElement(
          'div',
          null,
          React.createElement('input', { id: 'workZone', type: 'checkbox', className: 'filled-in', checked: currentZoneACL && currentZoneACL.isWorkZone, onChange: this.onChangeWorkZone }),
          React.createElement(
            'label',
            { htmlFor: 'workZone' },
            '\u0420\u0430\u0431\u043E\u0447\u0430\u044F \u0437\u043E\u043D\u0430'
          )
        );
      }

      let modes = null;

      if (this.props.data && this.props.data.mode) {
        if (this.props.data.mode === 1) {
          modes = React.createElement(
            'div',
            null,
            React.createElement('input', { id: 'r3', type: 'radio', className: 'with-gap', checked: currentZoneACL && currentZoneACL.accessTypeId === 3, onChange: this.onChangeAccessType }),
            React.createElement(
              'label',
              { htmlFor: 'r3' },
              '\u041F\u043E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044E \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438'
            )
          );
        } else {
          modes = React.createElement(
            'div',
            null,
            React.createElement('input', { id: 'r3', type: 'radio', className: 'with-gap', checked: currentZoneACL && currentZoneACL.accessTypeId === 3, onChange: this.onChangeAccessType }),
            React.createElement(
              'label',
              { htmlFor: 'r3' },
              '\u041F\u043E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044E \u043E\u0442\u0434\u0435\u043B\u0430'
            )
          );
        }
      }

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'row no-margin-bottom' },
          React.createElement(
            'div',
            { className: 'col l6 m6 s12' },
            React.createElement(
              'div',
              null,
              React.createElement('input', { id: 'access0', type: 'radio', className: 'with-gap', checked: acl.aclTypeId === 0, onChange: this.onChangeACLType }),
              React.createElement(
                'label',
                { htmlFor: 'access0' },
                '\u0412\u0435\u0437\u0434\u0435'
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement('input', { id: 'access1', type: 'radio', className: 'with-gap', checked: acl.aclTypeId === 1, onChange: this.onChangeACLType }),
              React.createElement(
                'label',
                { htmlFor: 'access1' },
                '\u041F\u043E \u043E\u0431\u044A\u0435\u043A\u0442\u0430\u043C'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'col l6 m6 s12' },
            React.createElement(
              'div',
              { hidden: acl.aclTypeId === 1 },
              React.createElement(
                'div',
                { className: 'header5' },
                '\u0414\u043E\u0441\u0442\u0443\u043F'
              ),
              React.createElement(
                'div',
                null,
                React.createElement('input', { id: 'ra0', type: 'radio', className: 'with-gap', checked: acl.accessTypeId === 0, onChange: this.onChangeAccessTypeAll }),
                React.createElement(
                  'label',
                  { htmlFor: 'ra0' },
                  '\u041D\u0438\u043A\u043E\u0433\u0434\u0430'
                )
              ),
              React.createElement(
                'div',
                null,
                React.createElement('input', { id: 'ra1', type: 'radio', className: 'with-gap', checked: acl.accessTypeId === 1, onChange: this.onChangeAccessTypeAll }),
                React.createElement(
                  'label',
                  { htmlFor: 'ra1' },
                  '\u0412\u0441\u0435\u0433\u0434\u0430'
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { hidden: acl.aclTypeId === 0 },
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'col l6 m6 s12' },
              React.createElement(
                'div',
                { className: 'with-element-width with-margin-bottom10' },
                React.createElement(
                  'div',
                  { className: 'header5' },
                  '\u0417\u043E\u043D\u044B:'
                ),
                React.createElement(Elements.List, { values: this.props.zones, selectedValue: this.state.selectedZone, onChange: this.onChange })
              ),
              workZone
            ),
            React.createElement(
              'div',
              { className: 'col l6 m6 s12' },
              React.createElement(
                'div',
                { className: 'header5' },
                '\u0414\u043E\u0441\u0442\u0443\u043F:'
              ),
              React.createElement(
                'div',
                null,
                React.createElement('input', { id: 'r0', type: 'radio', className: 'with-gap', checked: !currentZoneACL || currentZoneACL.accessTypeId === 0, onChange: this.onChangeAccessType }),
                React.createElement(
                  'label',
                  { htmlFor: 'r0' },
                  '\u041D\u0438\u043A\u043E\u0433\u0434\u0430'
                )
              ),
              React.createElement(
                'div',
                null,
                React.createElement('input', { id: 'r1', type: 'radio', className: 'with-gap', checked: currentZoneACL && currentZoneACL.accessTypeId === 1, onChange: this.onChangeAccessType }),
                React.createElement(
                  'label',
                  { htmlFor: 'r1' },
                  '\u0412\u0441\u0435\u0433\u0434\u0430'
                )
              ),
              modes,
              React.createElement(
                'div',
                null,
                React.createElement('input', { id: 'r2', type: 'radio', className: 'with-gap', checked: currentZoneACL && currentZoneACL.accessTypeId === 2, onChange: this.onChangeAccessType }),
                React.createElement(
                  'label',
                  { htmlFor: 'r2' },
                  '\u041F\u043E \u0440\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044E'
                )
              )
            )
          ),
          React.createElement('br', null),
          content
        )
      );
    }
  });
});