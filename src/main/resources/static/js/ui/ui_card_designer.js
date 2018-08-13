'use strict';

define(['jquery', 'react', 'react-dom', 'utils/utils', 'ui/ui_elements', 'dao/badges', 'core/logger', 'svg', 'svg-draggable', 'svg-select', 'svg-resize'], function ($, React, ReactDOM, Utils, Elements, BadgesDao, Log, SVG) {
  let CARD_SIZE_MULT = 6,
      CARD_HEIGHT = 54 * CARD_SIZE_MULT,
      CARD_WIDTH = 86 * CARD_SIZE_MULT;

  return React.createClass({
    getInitialState: function () {
      return {
        selectedTemplateId: 0,
        templates: [],
        tmpAccount: {
          account: {
            id: 0,
            firstName: 'Имя',
            lastName: 'Фамилия',
            middleName: 'Отчество',
            position: 'Должность',
            departmentId: 0,
            cardNumber: 'Номер карты',
            avatar: 'images/oth/avatar.png',
            deleted: false,
            fired: false
          },
          department: {
            id: 0,
            name: 'Отдел'
          }
        }
      };
    },
    componentDidMount: function () {
      let self = this;

      BadgesDao.getTemplates({}, function (res) {
        Log.info('Шаблоны успешно загружены');

        self.setState({
          templates: res,
          selectedTemplateId: res ? res[0].id : 0
        }, function () {
          self.makeCard(self.state.selectedTemplateId);
        });
      }, function () {
        Log.error('Ошибка загрузки шаблонов');
      });
    },
    onSVGExportClick: function (ev) {
      if ($(ev.currentTarget).attr('disabled') == true) {
        return;
      }

      if (this.props.accounts) {
        $(ev.currentTarget).attr('href', 'data:image/svg+xml;,' + encodeURIComponent($('#cardDesignerMult').html()));
        return;
      }
      $(ev.currentTarget).attr('href', 'data:image/svg+xml;,' + encodeURIComponent($('#cardDesigner').html()));
    },
    onPNGExportClick: function (ev) {
      if ($(ev.currentTarget).attr('disabled') == true) {
        return;
      }

      let height = this.props.accounts ? CARD_HEIGHT * 1 * this.props.accounts.length : CARD_HEIGHT;

      //fix
      let svg = document.querySelector('svg');

      let rect = svg.getBoundingClientRect();

      let canvas = $('<canvas>').attr({ width: rect.width, height: rect.height }).get(0),
          context = canvas.getContext('2d');

      ev.stopPropagation();
      ev.preventDefault();

      let image = new Image(CARD_WIDTH, height);
      image.onload = function () {
        context.drawImage(image, 0, 0);
        let a = $('#exportTmp').attr({
          href: canvas.toDataURL('image/png'),
          download: 'card.png'
        });
        a.get(0).click();
      };
      image.src = 'data:image/svg+xml;,' + encodeURIComponent(this.props.accounts ? $('#cardDesignerMult').html() : $('#cardDesigner').html());
    },
    onPDFExportClick: function (ev) {
      let params = {
        format: 'pdf',
        templateId: this.state.selectedTemplateId
      };

      if (this.props.account.account) {
        params.accountId = this.props.account.account.id;
      } else if (this.props.accounts) {
        params.departmentId = this.props.accounts[0].department.id;
      } else {
        return;
      }

      $(ev.currentTarget).attr('href', './personnel/api/badges/print?p=' + JSON.stringify(params));
    },
    onChangeTemplate: function (value) {
      let self = this;

      self.setState({ selectedTemplateId: +value }, function () {
        self.makeCard(self.state.selectedTemplateId);
      });
    },
    findTemplate: function (id) {
      return Utils.findById(this.state.templates, +id);
    },
    makeCard: function (id) {
      let template = this.findTemplate(id);
      if (template === null) {
        return "<div className='halign'>Шаблон не найден</div>";
      }

      if (this.props.accounts) {
        $('#cardDesigner').empty().append($(template.template));
        this.makeCards(template, this.props.accounts);
        return;
      }

      let account = this.props.account;
      account = account ? account : this.state.tmpAccount;
      $('#cardDesigner').empty().append(this.makeSingleCard(template, account));
    },
    getValue: function (value, account) {
      let fields = value.split('.');
      let obj = account;
      for (let j = 0; j < fields.length; j++) {
        obj = obj[fields[j]];
        if (!obj) {
          continue;
        }
      }

      return obj;
    },
    makeSingleCard: function (template, account) {
      account.account.cardNumber = Utils.prepareCardNumber(true, account.account.cardNumber);
      let card = $(template.template);

      for (let i = 0; i < template.params.length; i++) {
        let param = template.params[i];
        let obj = '';

        if (param.value[0] !== '#') {
          obj = this.getValue(param.value, account);
        } else {
          switch (param.value) {
            case '#account.name':
              obj = this.getValue('account.lastName', account) + ' ' + this.getValue('account.firstName', account) + ' ' + this.getValue('account.middleName', account);
              break;
            case '#account.name2':
              obj = this.getValue('account.firstName', account) + ' ' + this.getValue('account.middleName', account);
              break;
            case '#account.name3':
              obj = this.getValue('account.lastName', account) + ' ' + this.getValue('account.firstName', account)[0] + '.' + this.getValue('account.middleName', account)[0] + '.';
              break;
          }
        }

        switch (param.type) {
          case 'text':
            card.find('#' + param.id + ' tspan').html(obj);
            break;
          case 'image':
            Utils.fetchBlob(obj, function (blob) {
              let binImg = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(blob)));
              card.find('#' + param.id).attr('xlink:href', binImg);
            });
            break;
        }
      }

      return card;
    },
    makeCards: function (template, accounts) {
      $('#cardDesignerMult').empty();
      let draw = SVG('cardDesignerMult').size(CARD_WIDTH, CARD_HEIGHT * (accounts.length + 1));

      for (let i = 0; i < accounts.length; i++) {
        let nested = draw.nested();
        nested.svg(this.makeSingleCard(template, accounts[i]).html());
        nested.attr({
          x: 0,
          y: (CARD_HEIGHT + 1) * i
        });
        draw.line(0, CARD_HEIGHT * i, CARD_WIDTH, CARD_HEIGHT * i).stroke({ width: 1 });
      }
    },
    checkDisabled: function () {
      return !this.props.accounts && !this.props.account;
    },
    render: function () {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col l6 m6 s12' },
            React.createElement(
              'div',
              { className: 'header2' },
              '\u0412\u044B\u0431\u043E\u0440 \u0448\u0430\u0431\u043B\u043E\u043D\u0430'
            ),
            React.createElement(Elements.Select, { values: this.state.templates, selectedValue: this.state.selectedTemplateId, onChange: this.onChangeTemplate })
          ),
          React.createElement(
            'div',
            { className: 'col l6 m6 s12' },
            React.createElement(
              'div',
              { className: 'header2' },
              '\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u0430\u043A...'
            ),
            React.createElement('a', { id: 'exportSVG', className: 'figure figure-export-svg', href: '#', download: 'card.svg', onClick: this.onSVGExportClick, disabled: this.checkDisabled() }),
            React.createElement('a', { id: 'exportPNG', className: 'figure figure-export-png', href: '#', download: 'card.png', onClick: this.onPNGExportClick, disabled: this.checkDisabled() }),
            React.createElement('a', { id: 'exportPDF', className: 'figure figure-export-pdf', href: '#', target: '_blank', onClick: this.onPDFExportClick, disabled: this.checkDisabled() }),
            React.createElement('a', { id: 'exportTmp', hidden: true })
          )
        ),
        React.createElement('br', null),
        React.createElement(
          'div',
          { className: 'header2' },
          '\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440'
        ),
        React.createElement(
          'div',
          { id: 'cardDesigner', className: 'block-card-designer' },
          React.createElement(
            'div',
            { className: 'halign' },
            '\u0428\u0430\u0431\u043B\u043E\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D'
          )
        ),
        React.createElement('div', { id: 'cardDesignerMult', style: { display: 'none' } })
      );
    }
  });
});