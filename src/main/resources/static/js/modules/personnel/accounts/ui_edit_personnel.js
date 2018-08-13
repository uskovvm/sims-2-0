'use strict';

define(['jquery', 'react', 'react-dom', 'ui/ui_elements', 'core/socket', 'utils/utils', 'ui/ui_schedule', 'objects', 'dao/calendar', 'dao/accounts', 'ui/ui_week_schedule_manager', 'dao/zones', 'core/events', 'core/logger', 'ui/ui_webcam'], function ($, React, ReactDOM, Elements, Socket, Utils, Schedule, Objects, CalendarDao, AccountsDao, WeekSchedule, ZonesDao, Events, Log, Webcam) {
  return React.createClass({
    getInitialState: function () {
      let account = Objects.clone(this.props.data.account),
          selectedOrganization = { id: 0, name: 'Организация не выбрана', departments: [] };

      if (account) {
        selectedOrganization = Utils.findById(this.props.data.organizations, account.organizationId);
        selectedOrganization = selectedOrganization ? selectedOrganization : { id: 0, name: 'Организация не выбрана', departments: [] };
      }

      return {
        account: account,
        selectedOrganization: selectedOrganization,
        schedule: Objects.clone(Objects.Schedule),
        card: Objects.clone(Objects.Card),
        acl: Objects.clone(Objects.ACL),
        isDec: true,
        webcamOpen: false,
        clb1: null,
        clb2: null
      };
    },
    componentDidMount: function () {
      let self = this;

      self.setState({
        clb1: Events.addCallback(Events.EVENT_KEY_ENTER, function () {
          if (!self.state.webcamOpen) {
            self.onOk();
          }
        }),
        clb2: Events.addCallback(Events.EVENT_KEY_ESC, function () {
          if (!self.state.webcamOpen) {
            self.onCancel();
          }
        })
      });

      AccountsDao.getCard({ number: self.state.account.cardNumber }, function (data) {
        if (data.length > 0) {
          self.setState({ card: data[0] });
        } else {
          self.setState({ card: Objects.clone(Objects.Card) });
        }
      });

      if (self.state.account) {
        CalendarDao.getDay({ accountId: self.state.account.id }, function (data) {
          self.setState({ schedule: data });
        });

        ZonesDao.getACL({ accountId: self.state.account.id }, function (data) {
          self.setState({ acl: data });
        });
      }
    },
    componentWillUnmount: function () {
      Events.removeCallback(Events.EVENT_KEY_ENTER, this.state.clb1);
      Events.removeCallback(Events.EVENT_KEY_ESC, this.state.clb2);
    },
    onFirstNameChange: function (ev) {
      let account = this.state.account;
      account.firstName = ev.currentTarget.value;
      this.setState({ account: account });
    },
    onLastNameChange: function (ev) {
      let account = this.state.account;
      account.lastName = ev.currentTarget.value;
      this.setState({ account: account });
    },
    onMiddleNameChange: function (ev) {
      let account = this.state.account;
      account.middleName = ev.currentTarget.value;
      this.setState({ account: account });
    },
    onOrganizationChange: function (value) {
      let account = this.state.account;
      account.organizationId = +value;
      let organization = Utils.findById(this.props.data.organizations, +value);
      organization = organization ? organization : { id: 0, name: 'Организация не выбрана', departments: [] };
      this.setState({ account: account, selectedOrganization: organization });
    },
    onDepartmentChange: function (value) {
      let account = this.state.account;
      account.departmentId = +value;
      this.setState({ account: account });
    },
    onPositionChange: function (ev) {
      let account = this.state.account;
      account.position = ev.currentTarget.value;
      this.setState({ account: account });
    },
    onChangeFired: function (ev) {
      let account = this.state.account;
      account.fired = +ev.currentTarget.checked;
      this.setState({ account: account });
    },
    onChangeBlocked: function (ev) {
      let account = this.state.account;
      account.blocked = +ev.currentTarget.checked;
      this.setState({ account: account });
    },
    onChangeDeleted: function (ev) {
      let account = this.state.account;
      account.deleted = +ev.currentTarget.checked;
      this.setState({ account: account });
    },
    onCardNumberChange: function (ev) {
      let card = this.state.card;
      let res = this.state.isDec ? parseInt(ev.currentTarget.value) : parseInt(ev.currentTarget.value, 16);

      if (!res && res !== 0 || res.toString().length > 10) {
        return;
      }

      card.number = res ? res : 0;
      this.setState({ card: card });
    },
    onChangeValidTo: function (time) {
      if (time) {
        let card = this.state.card;
        card.validTo = time;
        this.setState({ card: card });
      }
    },
    onReadCard: function () {
      let self = this;

      let getEvents = {
        message: 'ReadCard'
      };

      Socket.send(getEvents, function (data) {
        let card = self.state.card;
        card.number = data.data.number;
        self.setState({ card: card });
      });
    },
    onUnbindCard: function () {
      let self = this;

      AccountsDao.deleteCard({
        number: self.state.card.number
      }, function (res) {
        let account = self.state.account;
        account.cardNumber = '';
        self.setState({
          account: account,
          card: {}
        });
        self.onOk();
      });
    },
    onDeleteAvatar: function () {
      let self = this;

      AccountsDao.setAvatar({ id: self.state.account.id }, function (res) {
        let account = self.state.account;
        account.avatar = '/images/oth/avatar.png';
        self.setState({ account: account });
      });
    },
    onOpenWebcam: function () {
      this.setState({ webcamOpen: true });
    },
    onCloseWebcam: function () {
      this.setState({ webcamOpen: false });
    },
    onWebcamPhoto: function (avatar) {
      let account = this.state.account;
      account.avatar = avatar;
      this.setState({ account: account }, this.onCloseWebcam);
    },
    onLoadAvatar: function () {
      let self = this;
      let inputUI = $('#picture [type=file]'),
          input = inputUI[0];

      if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
          inputUI.attr('src', e.target.result);
          let account = self.state.account;
          account.avatar = e.target.result;
          self.setState({ account: account });
        };

        reader.readAsDataURL(input.files[0]);
      }
    },
    onChangeCardDec: function (ev) {
      this.setState({ isDec: ev.currentTarget.id === 'dec' });
    },
    onChangeSchedule: function (schedule) {
      this.setState({ schedule: schedule });
    },
    onChangeZoneACL: function (acl) {
      this.setState({ acl: acl });
    },
    onChangeScheduleType: function (ev) {
      let account = this.state.account;
      account.dayScheduleTypeId = +ev.currentTarget.id.substr('scheduleType'.length);
      this.setState({ account: account });
    },
    onOk: function () {
      let self = this;

      let account = self.state.account;

      if (!account.firstName && !account.middleName && !account.lastName) {
        return;
      }

      account.cardNumber = self.state.card.number;

      AccountsDao.set(account, function (res) {
        account.id = res.response.id;
        AccountsDao.setAvatar({ id: account.id, avatar: account.avatar });
        AccountsDao.setCard({ accountId: account.id, number: self.state.card.number, validTo: self.state.card.validTo });

        if (account.dayScheduleTypeId === 2) {
          CalendarDao.setDay({ accountId: account.id, schedule: self.state.schedule });
        }

        ZonesDao.setACL({
          accountId: account.id,
          accessTypeId: self.state.acl.accessTypeId,
          aclTypeId: self.state.acl.aclTypeId,
          zones: self.state.acl.zones
        });

        Log.info('Аккаунт успешно создан');

        self.props.data.onOk(account);
      }, function () {
        Log.error('Ошибка создания аккаунта');
        self.props.data.onCancel();
      });
    },
    onCancel: function () {
      this.props.data.onCancel();
    },
    render: function () {
      if (!this.state.account) {
        return null;
      }

      let data = [{
        id: 'info',
        name: 'Информация',
        active: true
      }, {
        id: 'time',
        name: 'Распорядок дня'
      }, {
        id: 'week',
        name: 'Доступ в зоны'
      }];

      let firedBlock = null;
      if (this.state.account.fired) {
        firedBlock = React.createElement(
          'div',
          { className: 'block-fired' },
          '\u0423\u0432\u043E\u043B\u0435\u043D(-\u0430)'
        );
      }

      let name = this.props.data.account ? this.props.data.account.lastName + ' ' + (this.props.data.account.firstName ? this.props.data.account.firstName.substr(0, 1) + '.' : '') + (this.props.data.account.middleName ? this.props.data.account.middleName.substr(0, 1) + '.' : '') : '';

      let schedule = null;
      if (this.state.account.dayScheduleTypeId === 2) {
        schedule = React.createElement(Schedule, { schedule: this.state.schedule, onChange: this.onChangeSchedule });
      }

      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'div',
          { className: 'header1' },
          '\u0423\u0447\u0435\u0442\u043D\u044B\u0435 \u0437\u0430\u043F\u0438\u0441\u0438 - [\u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 ',
          name,
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
                'div',
                { className: 'row no-margin-bottom' },
                React.createElement(
                  'div',
                  { className: 'col s12 m6 l3' },
                  React.createElement(
                    'div',
                    { id: 'picture' },
                    React.createElement('img', { name: 'avatar', src: this.state.account.avatar }),
                    React.createElement('br', null),
                    React.createElement(
                      'div',
                      { className: 'waves-effect waves-light btn with-element-width', onClick: this.onOpenWebcam },
                      '\u0421\u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0440\u043E\u0432\u0430\u0442\u044C'
                    ),
                    React.createElement('br', null),
                    React.createElement(
                      'label',
                      null,
                      React.createElement('input', { type: 'file', className: 'waves-effect waves-light btn with-element-width', onChange: this.onLoadAvatar }),
                      React.createElement(
                        'span',
                        { className: 'waves-effect waves-light btn btn-file-fix with-element-width' },
                        '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C'
                      )
                    ),
                    React.createElement('br', null),
                    React.createElement(
                      'div',
                      { className: 'waves-effect waves-light btn with-element-width', onClick: this.onDeleteAvatar, disabled: !this.state.account.avatar },
                      '\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u044E'
                    )
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'col s12 m7 l9', style: { 'margin-bottom': 0 } },
                  firedBlock,
                  React.createElement(
                    'div',
                    { style: { display: 'inline-block', float: 'right' } },
                    React.createElement('input', { id: 'modalAddAccountFired', className: 'filled-in', type: 'checkbox', checked: this.state.account.fired, onChange: this.onChangeFired }),
                    React.createElement(
                      'label',
                      { style: { 'margin-right': '20px' }, htmlFor: 'modalAddAccountFired' },
                      '\u0423\u0432\u043E\u043B\u0435\u043D'
                    ),
                    React.createElement('input', { id: 'modalAddAccountBlocked', className: 'filled-in', type: 'checkbox', checked: this.state.account.blocked, onChange: this.onChangeBlocked }),
                    React.createElement(
                      'label',
                      { style: { 'margin-right': '20px' }, htmlFor: 'modalAddAccountBlocked' },
                      '\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D'
                    ),
                    React.createElement('input', { id: 'modalAddAccountDeleted', className: 'filled-in', type: 'checkbox', checked: this.state.account.deleted, onChange: this.onChangeDeleted }),
                    React.createElement(
                      'label',
                      { htmlFor: 'modalAddAccountDeleted' },
                      '\u0423\u0434\u0430\u043B\u0451\u043D'
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
                          null,
                          '\u0418\u0414'
                        ),
                        React.createElement(
                          'td',
                          null,
                          this.state.account.id
                        )
                      ),
                      React.createElement(
                        'tr',
                        null,
                        React.createElement(
                          'td',
                          null,
                          '\u0424\u0430\u043C\u0438\u043B\u0438\u044F'
                        ),
                        React.createElement(
                          'td',
                          null,
                          React.createElement('input', { name: 'lastName', type: 'text', value: this.state.account.lastName, onChange: this.onLastNameChange })
                        )
                      ),
                      React.createElement(
                        'tr',
                        null,
                        React.createElement(
                          'td',
                          null,
                          '\u0418\u043C\u044F'
                        ),
                        React.createElement(
                          'td',
                          null,
                          React.createElement('input', { name: 'firstName', type: 'text', value: this.state.account.firstName, onChange: this.onFirstNameChange })
                        )
                      ),
                      React.createElement(
                        'tr',
                        null,
                        React.createElement(
                          'td',
                          null,
                          '\u041E\u0442\u0447\u0435\u0441\u0442\u0432\u043E'
                        ),
                        React.createElement(
                          'td',
                          null,
                          React.createElement('input', { name: 'middleName', type: 'text', value: this.state.account.middleName, onChange: this.onMiddleNameChange })
                        )
                      ),
                      React.createElement(
                        'tr',
                        null,
                        React.createElement(
                          'td',
                          null,
                          '\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F'
                        ),
                        React.createElement(
                          'td',
                          null,
                          React.createElement(Elements.Select, { values: this.props.data.organizations, onChange: this.onOrganizationChange, selectedValue: this.state.account.organizationId })
                        )
                      ),
                      React.createElement(
                        'tr',
                        null,
                        React.createElement(
                          'td',
                          null,
                          '\u041E\u0442\u0434\u0435\u043B'
                        ),
                        React.createElement(
                          'td',
                          null,
                          React.createElement(Elements.Select, { values: this.state.selectedOrganization.departments, onChange: this.onDepartmentChange, selectedValue: this.state.account.departmentId })
                        )
                      ),
                      React.createElement(
                        'tr',
                        null,
                        React.createElement(
                          'td',
                          null,
                          '\u0414\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C'
                        ),
                        React.createElement(
                          'td',
                          null,
                          React.createElement('input', { name: 'position', type: 'text', value: this.state.account.position, onChange: this.onPositionChange })
                        )
                      ),
                      React.createElement(
                        'tr',
                        null,
                        React.createElement(
                          'td',
                          null,
                          '\u041A\u0430\u0440\u0442\u0430'
                        ),
                        React.createElement(
                          'td',
                          null,
                          React.createElement(
                            'div',
                            { className: 'row' },
                            React.createElement(
                              'div',
                              { className: 'col s12 m6 l6' },
                              React.createElement(
                                'div',
                                { className: 'header2' },
                                '\u041D\u043E\u043C\u0435\u0440 \u043A\u0430\u0440\u0442\u044B'
                              ),
                              React.createElement('input', { name: 'cardNumber', placeholder: '\u041D\u043E\u043C\u0435\u0440 \u043A\u0430\u0440\u0442\u044B', type: 'text', value: Utils.prepareCardNumber(this.state.isDec, this.state.card.number), onChange: this.onCardNumberChange }),
                              React.createElement('br', null),
                              '\u0424\u043E\u0440\u043C\u0430\u0442:',
                              React.createElement('br', null),
                              React.createElement('input', { id: 'dec', type: 'radio', className: 'with-gap', checked: this.state.isDec, onChange: this.onChangeCardDec }),
                              React.createElement(
                                'label',
                                { htmlFor: 'dec' },
                                '\u0414\u0435\u0441\u044F\u0442\u0438\u0447\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442'
                              ),
                              React.createElement('br', null),
                              React.createElement('input', { id: 'hex', type: 'radio', className: 'with-gap', checked: !this.state.isDec, onChange: this.onChangeCardDec }),
                              React.createElement(
                                'label',
                                { htmlFor: 'hex' },
                                '\u0428\u0435\u0441\u0442\u043D\u0430\u0434\u0446\u0430\u0442\u0435\u0440\u0438\u0447\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442'
                              ),
                              React.createElement('br', null),
                              React.createElement('br', null)
                            ),
                            React.createElement(
                              'div',
                              { className: 'col s12 m6 l6' },
                              React.createElement(Elements.Datepicker, { date: this.state.card.validTo ? new Date(this.state.card.validTo) : null, caption: 'Время действия карты, до', onChange: this.onChangeValidTo })
                            )
                          ),
                          React.createElement(
                            'div',
                            { className: 'waves-effect waves-light btn with-element-width', onClick: this.onReadCard },
                            '\u0412\u044B\u0434\u0430\u0442\u044C \u043A\u0430\u0440\u0442\u0443'
                          ),
                          React.createElement(
                            'div',
                            { className: 'waves-effect waves-light btn with-element-width', onClick: this.onUnbindCard },
                            '\u0418\u0437\u044A\u044F\u0442\u044C \u043A\u0430\u0440\u0442\u0443'
                          )
                        )
                      )
                    )
                  )
                )
              )
            ),
            React.createElement(
              'div',
              { id: 'time' },
              React.createElement('input', { id: 'scheduleType1', className: 'with-gap', type: 'radio', checked: this.state.account.dayScheduleTypeId === 1, onChange: this.onChangeScheduleType }),
              React.createElement(
                'label',
                { htmlFor: 'scheduleType1' },
                '\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0440\u0430\u0441\u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0434\u043D\u044F \u043E\u0442\u0434\u0435\u043B\u0430'
              ),
              React.createElement('br', null),
              React.createElement('input', { id: 'scheduleType2', className: 'with-gap', type: 'radio', checked: this.state.account.dayScheduleTypeId === 2, onChange: this.onChangeScheduleType }),
              React.createElement(
                'label',
                { htmlFor: 'scheduleType2' },
                '\u0421\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0440\u0430\u0441\u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0434\u043D\u044F'
              ),
              schedule
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
        ),
        React.createElement(Webcam, {
          isOpen: this.state.webcamOpen,
          onRequestClose: this.onCloseWebcam,
          onPhoto: this.onWebcamPhoto })
      );
    }
  });
});