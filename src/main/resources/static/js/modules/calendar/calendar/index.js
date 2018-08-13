'use strict';

define(['jquery', 'react', 'react-dom', 'dao/calendar', 'react-day-picker'], function ($, React, ReactDOM, CalendarDao, DayPicker) {
  const weekdaysLong = {
    ru: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };

  const weekdaysShort = {
    ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  };

  const months = {
    ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  const firstDayOfWeek = {
    ru: 1,
    en: 0
  };

  const localeUtils = {
    formatDay: (d, locale = 'en') => `${weekdaysLong[locale][d.getDay()]}, ${d.getDate()} ${months[locale][d.getMonth()]} ${d.getFullYear()}`,
    formatWeekdayShort: (index, locale = 'en') => weekdaysShort[locale][index],
    formatWeekdayLong: (index, locale = 'en') => weekdaysLong[locale][index],
    getFirstDayOfWeek: locale => firstDayOfWeek[locale],
    getMonths: locale => months[locale],
    formatMonthTitle: (d, locale) => `${months[locale][d.getMonth()]} ${d.getFullYear()}`
  };

  function sameDay(d1, d2) {
    if (!d1 || !d2) {
      return false;
    }

    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  }

  let DateChooser = React.createClass({
    displayName: 'DateChooser',

    render: function () {
      return React.createElement(
        'div',
        { className: 'calendardropdownmenu', style: { top: this.props.y, left: this.props.x } },
        React.createElement(
          'div',
          { id: '3', className: 'item', onClick: this.props.onClick },
          '\u0420\u0430\u0431\u043E\u0447\u0438\u0439'
        ),
        React.createElement(
          'div',
          { id: '2', className: 'item', onClick: this.props.onClick },
          '\u0421\u043E\u043A\u0440\u0430\u0449\u0451\u043D\u043D\u044B\u0439'
        ),
        React.createElement(
          'div',
          { id: '1', className: 'item', onClick: this.props.onClick },
          '\u0412\u044B\u0445\u043E\u0434\u043D\u043E\u0439'
        )
      );
    }
  });

  let YearCalendar = React.createClass({
    displayName: 'YearCalendar',

    getInitialState: function () {
      return {
        showChooser: false,
        chooserX: 0,
        chooserY: 0,
        selectedDay: null
      };
    },
    handleDayClick: function (e, day, { selected }) {
      let parent = $('.yearcalendar')[0];

      this.setState({
        selectedDay: selected ? null : day,
        showChooser: true,
        chooserX: e.clientX - parent.parentNode.offsetLeft - e.target.offsetWidth,
        chooserY: e.clientY - parent.parentNode.offsetTop - e.target.offsetHeight
      });
    },
    onChooserClick: function (ev) {
      this.setState({ showChooser: false });
      this.props.onChange(this.state.selectedDay, +ev.currentTarget.id);
    },
    render: function () {
      let self = this;

      function checkDayType(key, type) {
        let time = Math.floor((key.getTime() - new Date(key.getFullYear(), 0, 0)) / (3600000 * 24));
        let day_ = self.props.data.days[time];
        if (day_) {
          return day_.type === type;
        }

        return false;
      }

      let modifiers = {
        saturday: day => {
          return checkDayType(day, 3) ? false : day.getDay() === 6;
        },
        sunday: day => {
          return checkDayType(day, 3) ? false : day.getDay() === 0;
        },
        holiday: day => {
          return checkDayType(day, 1);
        },
        preholiday: day => {
          return checkDayType(day, 2);
        }
      };

      let chooser = null;
      if (this.state.showChooser) {
        chooser = React.createElement(DateChooser, {
          x: this.state.chooserX,
          y: this.state.chooserY,
          onClick: this.onChooserClick
        });
      }

      return React.createElement(
        'div',
        { className: 'yearcalendar' },
        React.createElement(DayPicker, {
          selectedDays: day => sameDay(this.state.selectedDay, day),
          onDayClick: this.handleDayClick.bind(this),
          locale: 'ru',
          localeUtils: localeUtils,
          initialMonth: new Date(new Date().getFullYear(), 0, 1),
          canChangeMonth: false,
          numberOfMonths: 12,
          modifiers: modifiers,
          showWeekNumbers: true
        }),
        chooser
      );
    }
  });

  return React.createClass({
    getInitialState: function () {
      return {
        base: {
          year: new Date().getFullYear(),
          days: {}
        }
      };
    },
    componentDidMount: function () {
      let self = this;
      CalendarDao.getBase({}, function (data) {
        self.setState({ base: data });
      });
    },
    onChange: function (date, type, name) {
      let day = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 3600000 / 24);
      let base = this.state.base;
      base.days[day] = {
        type: type,
        name: name
      };

      this.setState({ base: base });
    },
    saveCalendar: function (data) {
      CalendarDao.setBase(this.state.base);
    },
    render: function () {
      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(
            'div',
            { className: 'panel' },
            React.createElement(
              'div',
              { className: 'header2b' },
              '\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C'
            ),
            React.createElement(YearCalendar, { data: this.state.base, onChange: this.onChange }),
            React.createElement(
              'div',
              { className: 'halign' },
              React.createElement(
                'div',
                { className: 'waves-effect waves-light btn with-element-width', onClick: this.saveCalendar },
                '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C'
              )
            )
          )
        )
      );
    }
  });
});