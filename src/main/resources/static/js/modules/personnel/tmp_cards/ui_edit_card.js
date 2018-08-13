'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'objects', 'core/events', 'dao/cards', 'utils/utils', 'core/logger', 'ui/ui_week_schedule_manager', 'dao/zones'], function (React, ReactDOM, Elements, Objects, Events, CardDao, Utils, Log, WeekSchedule, ZonesDao) {
  return React.createClass({
    getInitialState: function () {
      let card = Objects.clone(this.props.data.card);
      let doc = Objects.clone(card.doc);
      delete card.docId;

      return {
        acl: Objects.clone(Objects.ACL),
        card: card,
        doc: doc,
        isDec: true
      };
    },
    componentDidMount: function () {
      let self = this;

      if (self.state.card) {
        ZonesDao.getACL({ cardNumber: self.state.card.number }, function (data) {
          self.setState({ acl: data });
        });
      }
    },
    onChangeCardDec: function (ev) {
      this.setState({ isDec: ev.currentTarget.id === 'dec' });
    },
    onChangeCardNumber: function (ev) {
      let card = this.state.card,
          res = this.state.isDec ? parseInt(ev.currentTarget.value) : parseInt(ev.currentTarget.value, 16);

      if (!res && res !== 0 || res.toString().length > 10) {
        return;
      }

      card.number = res ? res : 0;
      this.setState({ card: card });
    },
    onChangeStartDate: function (date) {
      let card = this.state.card;

      if (date) {
        card.validFrom = new Date(date).getTime();
        this.setState({ card: card });
      }
    },
    onChangeEndDate: function (date) {
      let card = this.state.card;

      if (date) {
        card.validTo = new Date(date).getTime();
        this.setState({ card: card });
      }
    },
    onChangeStartTime: function (time) {
      let card = this.state.card;
      if (time) {
        time = +time.value;
        let date1 = new Date(card.validFrom);
        let date2 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), time / 60, time % 60);
        card.validFrom = date2.getTime();
        this.setState({ card: card });
      }
    },
    onChangeEndTime: function (time) {
      let card = this.state.card;
      if (time) {
        time = +time.value;
        let date1 = new Date(card.validTo);
        let date2 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), time / 60, time % 60);
        card.validTo = date2.getTime();;
        this.setState({ card: card });
      }
    },
    onChangeZoneACL: function (acl) {
      this.setState({ acl: acl });
    },
    onChangeDocType: function (ev) {
      let doc = this.state.doc;
      doc.type = ev.currentTarget.value;
      this.setState({ doc: doc });
    },
    onChangeDocNumber: function (ev) {
      let doc = this.state.doc;
      doc.number = ev.currentTarget.value;
      this.setState({ doc: doc });
    },
    onChangeDocIssueDate: function (date) {
      let doc = this.state.doc;
      doc.issueDate = new Date(date).getTime();
      this.setState({ doc: doc });
    },
    onChangeDocIssuerName: function (ev) {
      let doc = this.state.doc;
      doc.issuerName = ev.currentTarget.value;
      this.setState({ doc: doc });
    },
    onChangeDocData: function (ev) {
      let doc = this.state.doc;
      doc.body = ev.currentTarget.value;
      this.setState({ doc: doc });
    },
    onChangeDocOwnerName: function (ev) {
      let doc = this.state.doc;
      doc.ownerName = ev.currentTarget.value;
      this.setState({ doc: doc });
    },
    onOk: function () {
      let self = this;

      let card = self.state.card;

      if (!card.number) {
        return;
      }

      card.doc = self.state.doc;

      CardDao.set(card, function (res) {
        Log.info('Временная карта успешно сохранена');

        ZonesDao.setACL({
          cardNumber: card.number,
          accessTypeId: self.state.acl.accessTypeId,
          aclTypeId: self.state.acl.aclTypeId,
          zones: self.state.acl.zones
        });

        self.props.data.onOk(card);
      }, function () {
        Log.error('Ошибка сохранения временной карты');
        self.props.data.onCancel();
      });
    },
    onCancel: function () {
      this.props.data.onCancel();
    },
    render: function () {
      let data = [{
        id: 'info',
        name: 'Информация',
        active: true
      }, {
        id: 'week',
        name: 'Доступ в зоны'
      }];

      let timeFrom = new Date(this.state.card.validFrom);
      timeFrom = timeFrom.getHours() * 60 + timeFrom.getMinutes();

      let startTimeConfig = {
        id: 'start',
        value: timeFrom,
        onChange: this.onChangeStartTime
      };

      let timeTo = new Date(this.state.card.validTo);
      timeTo = timeTo.getHours() * 60 + timeTo.getMinutes();

      let endTimeConfig = {
        id: 'end',
        value: timeTo,
        onChange: this.onChangeEndTime
      };

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'header1' },
          '\u0412\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u044B - [\u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 ',
          this.state.card.number,
          ']'
        ),
        React.createElement(
          'div',
          { className: 'with-margin-bottom10' },
          React.createElement(
            Elements.Tabs,
            { data: data },
            React.createElement(
              'div',
              { id: 'info' },
              React.createElement(
                'table',
                { className: 'cards-table' },
                React.createElement(
                  'tbody',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041D\u043E\u043C\u0435\u0440 \u043A\u0430\u0440\u0442\u044B'
                    ),
                    React.createElement(
                      'td',
                      null,
                      this.state.card.number
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041D\u0430\u0447\u0430\u043B\u043E \u0441\u0440\u043E\u043A\u0430 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement(Elements.Datepicker, { date: new Date(this.state.card.validFrom), onChange: this.onChangeStartDate }),
                      ' ',
                      React.createElement(Elements.Time, { className: 'with-element-width', style: { 'margin-top': '10px', 'margin-bottom': '0 !important;' }, data: startTimeConfig })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 \u0441\u0440\u043E\u043A\u0430 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement(Elements.Datepicker, { date: new Date(this.state.card.validTo), onChange: this.onChangeEndDate }),
                      ' ',
                      React.createElement(Elements.Time, { className: 'with-element-width', style: { 'margin-top': '10px', 'margin-bottom': '0 !important;' }, data: endTimeConfig })
                    )
                  )
                )
              ),
              React.createElement('hr', null),
              React.createElement(
                'div',
                { className: 'header2' },
                '\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442'
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
                      { style: { width: '240px' } },
                      '\u0422\u0438\u043F'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { name: 'docType', type: 'text', value: this.state.doc.type, onChange: this.onChangeDocType })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041D\u043E\u043C\u0435\u0440'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { name: 'docNumber', type: 'text', value: this.state.doc.number, onChange: this.onChangeDocNumber })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u0414\u0430\u0442\u0430 \u0432\u044B\u0434\u0430\u0447\u0438'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement(Elements.Datepicker, { date: this.state.doc.issueDate ? new Date(this.state.doc.issueDate) : null, onChange: this.onChangeDocIssueDate })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041E\u0440\u0433\u0430\u043D, \u0432\u044B\u0434\u0430\u0432\u0448\u0438\u0439 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { name: 'docIssuer', type: 'text', value: this.state.doc.issuerName, onChange: this.onChangeDocIssuerName })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u0414\u0430\u043D\u043D\u044B\u0435'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { name: 'docData', type: 'text', value: this.state.doc.body, onChange: this.onChangeDocData })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u0412\u043B\u0430\u0434\u0435\u043B\u0435\u0446'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { name: 'docOwner', type: 'text', value: this.state.doc.ownerName, onChange: this.onChangeDocOwnerName })
                    )
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { id: 'week' },
              React.createElement(WeekSchedule, { data: { mode: 2 }, acl: this.state.acl, zones: this.props.data.zones, onChange: this.onChangeZoneACL })
            )
          )
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'center-align', style: { 'margin-top': '20px' } },
          React.createElement(
            'div',
            { className: 'waves-effect waves-light btn with-element-width', onClick: this.onOk },
            '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C'
          ),
          React.createElement(
            'div',
            { className: 'waves-effect waves-light btn with-element-width', onClick: this.onCancel },
            '\u041E\u0442\u043C\u0435\u043D\u0430'
          )
        )
      );
    }
  });
});