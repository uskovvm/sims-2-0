'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'utils/utils', 'svg', 'svg-draggable', 'svg-select', 'svg-resize'], function (React, ReactDOM, Elements, Utils, SVG) {
  return React.createClass({
    getInitialState: function () {
      return {
        isColorSelectorDialogOpen: false,
        colorSelectionCallback: null
      };
    },
    onModalClose: function (ev) {
      this.setState({ isColorSelectorDialogOpen: false, colorSelectionCallback: null });
    },
    onChangeText: function (ev) {
      this.props.data.selectedElement.text(ev.currentTarget.value);
      this.props.updateElement();
    },
    onChangeX: function (ev) {
      this.props.data.selectedElement.attr({ x: +ev.currentTarget.value });
      this.props.updateElement();

      if (this.props.data.selectedElement.type === 'text') {
        for (let i = 0; i < this.props.data.selectedElement.node.children.length; i++) {
          SVG.get(this.props.data.selectedElement.node.children[i].id).attr('x', +ev.currentTarget.value);
        }
      }
    },
    onChangeX1: function (ev) {
      this.props.data.selectedElement.attr({ x1: +ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeX2: function (ev) {
      this.props.data.selectedElement.attr({ x2: +ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeY: function (ev) {
      this.props.data.selectedElement.attr({ y: +ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeY1: function (ev) {
      this.props.data.selectedElement.attr({ y1: +ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeY2: function (ev) {
      this.props.data.selectedElement.attr({ y2: +ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeColor: function (ev) {
      let self = this;
      this.setState({ isColorSelectorDialogOpen: true, colorSelectionCallback: this.onColorSelected });
    },
    onChangeStrokeColor: function (ev) {
      let self = this;
      this.setState({ isColorSelectorDialogOpen: true, colorSelectionCallback: this.onStrokeColorSelected });
    },
    onColorSelected: function (color) {
      this.props.data.selectedElement.attr({ fill: color });
      this.props.updateElement();
    },
    onStrokeColorSelected: function (color) {
      this.props.data.selectedElement.attr({ 'stroke': color });
      this.props.updateElement();
    },
    onChangeFontSize: function (ev) {
      this.props.data.selectedElement.attr({ 'font-size': ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeFontParam: function (ev) {
      this.props.data.selectedElement.attr({ 'font-weight': ev.currentTarget.checked ? 800 : 0 });
      this.props.updateElement();
    },
    onChangeFontFamily: function (ev) {
      this.props.data.selectedElement.attr({ 'font-family': ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeOpacity: function (ev) {
      this.props.data.selectedElement.attr({ 'fill-opacity': ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeStroke: function (ev) {
      this.props.data.selectedElement.attr({ 'stroke-width': +ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeWidth: function (ev) {
      this.props.data.selectedElement.attr({ width: +ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeHeight: function (ev) {
      this.props.data.selectedElement.attr({ height: +ev.currentTarget.value });
      this.props.updateElement();
    },
    onChangeRound: function (ev) {
      this.props.data.selectedElement.attr({ rx: +ev.currentTarget.value, ry: +ev.currentTarget.value });
      this.props.updateElement();
    },
    onLoadImage: function (ev) {
      let self = this;

      let input = ev.currentTarget;

      if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
          self.props.data.selectedElement.load(e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
      }
    },
    getTextParam: function () {
      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u0422\u0435\u043A\u0441\u0442'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'text', className: 'with-element-width', onChange: this.onChangeText, value: this.props.data.selectedElement.node.textContent })
        )
      );
    },
    getXParam: function () {
      let x = Math.floor(+this.props.data.selectedElement.attr('x'));

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          'X'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', className: 'with-element-width', onChange: this.onChangeX, value: x })
        )
      );
    },
    getX1Param: function () {
      let x1 = Math.floor(+this.props.data.selectedElement.attr('x1'));

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          'X1'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', className: 'with-element-width', onChange: this.onChangeX1, value: x1 })
        )
      );
    },
    getX2Param: function () {
      let x2 = Math.floor(+this.props.data.selectedElement.attr('x2'));

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          'X2'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', className: 'with-element-width', onChange: this.onChangeX2, value: x2 })
        )
      );
    },
    getYParam: function () {
      let y = Math.floor(+this.props.data.selectedElement.attr('y'));

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          'Y'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', className: 'with-element-width', onChange: this.onChangeY, value: y })
        )
      );
    },
    getY1Param: function () {
      let y1 = Math.floor(+this.props.data.selectedElement.attr('y1'));

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          'Y1'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', className: 'with-element-width', onChange: this.onChangeY1, value: y1 })
        )
      );
    },
    getY2Param: function () {
      let y2 = Math.floor(+this.props.data.selectedElement.attr('y2'));

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          'Y2'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', className: 'with-element-width', onChange: this.onChangeY2, value: y2 })
        )
      );
    },
    getWidthParam: function () {
      let width = Math.floor(+this.props.data.selectedElement.attr('width'));

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u0428\u0438\u0440\u0438\u043D\u0430'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', min: '0', className: 'with-element-width', onChange: this.onChangeWidth, value: width })
        )
      );
    },
    getHeightParam: function () {
      let height = Math.floor(+this.props.data.selectedElement.attr('height'));

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u0412\u044B\u0441\u043E\u0442\u0430'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', min: '0', className: 'with-element-width', onChange: this.onChangeHeight, value: height })
        )
      );
    },
    getRoundParam: function () {
      let round = +this.props.data.selectedElement.attr('rx');

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u0417\u0430\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', min: '0', className: 'with-element-width', onChange: this.onChangeRound, value: round })
        )
      );
    },
    getColorParam: function () {
      let colorHex = this.props.data.selectedElement.attr('fill');
      if (colorHex === 'black') {
        colorHex = '#000000';
      }

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u0426\u0432\u0435\u0442'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'text', className: 'with-element-width', onClick: this.onChangeColor, value: colorHex })
        )
      );
    },
    getFontSizeParam: function () {
      let fontSize = Math.floor(this.props.data.selectedElement.attr('font-size'));

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', step: '1', min: '0', max: '128', className: 'with-element-width', onChange: this.onChangeFontSize, value: fontSize }),
          ' pt'
        )
      );
    },
    getFontParam: function () {
      let fontWeight = +this.props.data.selectedElement.attr('font-weight');

      let isBold = fontWeight === 800;

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0448\u0440\u0438\u0444\u0442\u0430'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { id: 'fontBold', type: 'checkbox', className: 'filled-in', onChange: this.onChangeFontParam, checked: isBold }),
          React.createElement(
            'label',
            { htmlFor: 'fontBold' },
            '\u0416\u0438\u0440\u043D\u044B\u0439'
          )
        )
      );
    },
    getFontFamilyParam: function () {
      let fontFamily = this.props.data.selectedElement.attr('font-family');

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u0428\u0440\u0438\u0444\u0442'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'text', className: 'with-element-width', onChange: this.onChangeFontFamily, value: fontFamily })
        )
      );
    },
    getOpacityParam: function () {
      let opacity = +this.props.data.selectedElement.attr('fill-opacity');

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', step: '0.01', min: '0', max: '1', className: 'with-element-width', onChange: this.onChangeOpacity, value: opacity })
        )
      );
    },
    getStrokeColorParam: function (name) {
      let colorHex = this.props.data.selectedElement.attr('stroke');
      if (colorHex === 'black') {
        colorHex = '#000000';
      }

      !name ? name = 'Цвет границы' : 0;
      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          name
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'text', className: 'with-element-width', onClick: this.onChangeStrokeColor, value: colorHex })
        )
      );
    },
    getStrokeWidthParam: function () {
      let stroke = +this.props.data.selectedElement.attr('stroke-width');

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u0422\u043E\u043B\u0449\u0438\u043D\u0430 \u0433\u0440\u0430\u043D\u0438\u0446\u044B'
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', { type: 'number', step: '0.01', min: '0', className: 'with-element-width', onChange: this.onChangeStroke, value: stroke })
        )
      );
    },
    getImageParam: function () {
      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435'
        ),
        React.createElement(
          'td',
          null,
          React.createElement(
            'label',
            null,
            React.createElement('input', { type: 'file', accept: 'image/*', onChange: this.onLoadImage }),
            React.createElement(
              'span',
              { className: 'waves-effect waves-light btn btn-file-fix with-element-width' },
              '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C'
            )
          )
        )
      );
    },
    getBindParam: function () {
      let self = this;

      let param = Utils.findById(this.props.data.selectedTemplate.params, this.props.data.selectedElement.attr('id')),
          value = param ? param.value : '';

      function onChange(value) {
        param.value = value;
        self.props.onChangeBindValue(param);
      }

      let values = [{
        id: 'account.id',
        name: 'ИД'
      }, {
        id: 'account.lastName',
        name: 'Фамилия'
      }, {
        id: 'account.firstName',
        name: 'Имя'
      }, {
        id: 'account.middleName',
        name: 'Отчество'
      }, {
        id: 'account.avatar',
        name: 'Фотография'
      }, {
        id: 'account.position',
        name: 'Должность'
      }, {
        id: '#account.name',
        name: 'ФИО'
      }, {
        id: '#account.name2',
        name: 'Имя Отчество'
      }, {
        id: '#account.name3',
        name: 'Фамилия И.О.'
      }, {
        id: 'organization.name',
        name: 'Организация'
      }, {
        id: 'department.name',
        name: 'Отдел'
      }, {
        id: 'account.cardNumber',
        name: 'Номер карты'
      }, {
        id: 'account.cardValidTo',
        name: 'Время действия карты'
      }, {
        id: 'account.cardIssueDate',
        name: 'Дата выдачи карты'
      }, {
        id: 'account.id',
        name: 'Табельный номер'
      }];

      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          null,
          '\u041F\u043E\u043B\u0435 \u0431\u0430\u0437\u044B \u0434\u0430\u043D\u043D\u044B\u0445'
        ),
        React.createElement(
          'td',
          null,
          React.createElement(Elements.Select, { className: 'with-element-width', values: values, selectedValue: value, onChange: onChange, disabled: !param })
        )
      );
    },
    render: function () {
      let el = this.props.data.selectedElement;

      if (!el) {
        return React.createElement(
          'div',
          { className: 'halign' },
          '\u041D\u0435\u0442 \u043F\u043E\u043B\u0435\u0439 \u0434\u043B\u044F \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F'
        );
      }

      let params = [];

      switch (el.type) {
        case 'text':
          params.push(this.getBindParam());
          params.push(this.getTextParam());
          params.push(this.getXParam());
          params.push(this.getYParam());
          params.push(this.getFontSizeParam());
          params.push(this.getFontFamilyParam());
          params.push(this.getFontParam());
          params.push(this.getColorParam());
          params.push(this.getOpacityParam());
          break;
        case 'image':
          params.push(this.getBindParam());
          params.push(this.getImageParam());
          params.push(this.getXParam());
          params.push(this.getYParam());
          params.push(this.getWidthParam());
          params.push(this.getHeightParam());
          params.push(this.getColorParam());
          params.push(this.getOpacityParam());
          break;
        case 'line':
          params.push(this.getX1Param());
          params.push(this.getY1Param());
          params.push(this.getX2Param());
          params.push(this.getY2Param());
          params.push(this.getStrokeColorParam('Цвет'));
          params.push(this.getOpacityParam());
          params.push(this.getStrokeWidthParam());
          break;
        case 'rect':
          params.push(this.getXParam());
          params.push(this.getYParam());
          params.push(this.getWidthParam());
          params.push(this.getHeightParam());
          params.push(this.getRoundParam());
          params.push(this.getColorParam());
          params.push(this.getOpacityParam());
          params.push(this.getStrokeWidthParam());
          params.push(this.getStrokeColorParam());
          break;
      }

      return React.createElement(
        'div',
        null,
        React.createElement(
          'table',
          null,
          React.createElement(
            'tbody',
            null,
            params
          )
        ),
        React.createElement(Elements.ColorSelector, { isOpen: this.state.isColorSelectorDialogOpen, onRequestClose: this.onModalClose, onRequestOk: this.state.colorSelectionCallback })
      );
    }
  });
});