'use strict';

define(['jquery', 'react', 'react-dom', 'ui/ui_elements', 'utils/utils', './ui_control_panel', './ui_settings_panel', 'dao/badges', 'core/logger', 'svg', 'svg-draggable', 'svg-select', 'svg-resize'], function ($, React, ReactDOM, Elements, Utils, ControlPanel, SettingsPanel, BadgesDao, Log, SVG) {
  return React.createClass({
    getInitialState: function () {
      return {
        templates: [],
        svg: null,
        selectedTemplate: null,
        selectedElement: null,
        selectedElementPrototype: null,
        handler: null,
        dragMousePointOffset: null,
        autosave: null
      };
    },
    updateTimeout: function () {
      if (this.state.autosave !== null) {
        clearTimeout(this.state.autosave);
      }

      this.setState({ autosave: setTimeout(this.onSave, 3000) });
    },
    onSave: function () {
      let self = this;

      BadgesDao.setTemplate(self.state.selectedTemplate, function () {
        Log.info('Данные успешно сохранены');
      }, function () {
        Log.error('Ошибка сохранения данных');
      });
    },
    deleteTimeout: function () {
      clearTimeout(this.state.autosave);
      this.setState({ autosave: null });
    },
    componentDidMount: function () {
      let self = this;

      BadgesDao.getTemplates({}, function (res) {
        self.setState({
          templates: res,
          selectedTemplate: res ? res[0] : 0
        }, self.makePreview);
      });

      $('#templatePreview').on('click', 'svg', this.onSVGClick);

      let handler = $('html').on('keyup', function (e) {
        if (e.keyCode !== 46 || $('#badgeElementSettings *').is(":focus")) {
          return;
        }

        if (self.unbindSelectedElement()) {
          let id = self.state.selectedElement.id();
          let params = self.state.selectedTemplate.params;
          let idx = Utils.indexOfId(params, id);
          if (idx >= 0) {
            params.splice(idx, 1);
          }
          self.state.selectedTemplate.params = params;
          self.state.selectedElement.remove();
          self.setState({ selectedElement: null, selectedTemplate: self.state.selectedTemplate });
        }
      });
      this.setState({ handler: handler });
    },
    componentWillUnmount: function () {
      $('html').off('keyup');
      this.setState({ handler: null });
    },
    makePreview: function () {
      if (!this.state.selectedTemplate) {
        $('#templatePreview').html("<div className='halign'>Шаблон не найден</div>");
        return;
      }

      // Т.к. нормального импорта без вложенности нет, то делаем так
      $('#templatePreview').empty();
      let svgTmp = $(this.state.selectedTemplate.template);
      let svg = SVG('templatePreview').size(svgTmp.attr('width'), svgTmp.attr('height'));
      svg.svg(svgTmp.html());
      $('#templatePreview svg').on('click', '> *', this.onSVGElementClick);
      this.setState({ svg: svg });
    },
    bindSelectedElement: function (el) {
      let self = this;

      if (el) {
        el.draggable();
        el.selectize();
        if (el.type !== 'text') {
          el.resize();
        }
        el.on('dragstart.namespace', function (ev) {
          self.setState({
            dragMousePointOffset: {
              x: +self.state.selectedElement.attr('x') - ev.detail.p.x,
              y: +self.state.selectedElement.attr('y') - ev.detail.p.y
            }
          });
        });
        el.on('dragmove.namespace', function (ev) {
          if (self.state.selectedElement.type === 'text') {
            for (let i = 0; i < el.node.children.length; i++) {
              SVG.get(el.node.children[i].id).attr('x', ev.detail.p.x + self.state.dragMousePointOffset.x);
            }
          }
        });
      }
    },
    unbindSelectedElement: function () {
      if (this.state.selectedElement) {
        this.state.selectedElement.draggable(false);
        this.state.selectedElement.selectize(false);
        this.state.selectedElement.resize(false);
        this.state.selectedElement.off('dragstart.namespace');
        this.state.selectedElement.off('dragmove.namespace');
        this.setState({
          dragMousePointOffset: null
        });
        return true;
      }

      return false;
    },
    onTemplateChange: function (value) {
      let self = this;

      this.unbindSelectedElement();

      self.setState({
        selectedTemplate: Utils.findById(self.state.templates, +value),
        selectedElement: null,
        selectedElementPrototype: null
      }, self.makePreview);
    },
    onElementClick: function (ev) {
      if ($(ev.currentTarget).attr('data-id') === 'select') {
        this.unbindSelectedElement();
        this.setState({ selectedElement: null });
      }
      this.setState({ selectedElementPrototype: $(ev.currentTarget).attr('data-id') });
    },
    onControlPanelFunc: function (func, data) {
      let templates = this.state.templates;

      switch (func) {
        case 'del':
          if (!this.state.selectedTemplate) {
            return;
          }

          for (let i = 0; i < templates.length; i++) {
            if (templates[i].id === this.state.selectedTemplate.id) {
              templates.splice(i, 1);
              this.setState({ templates: templates, selectedTemplate: templates ? templates[0] : null }, this.makePreview);
              return;
            }
          }
          return;
        case 'save':
          if (!this.state.selectedTemplate) {
            return;
          }

          for (let i = 0; i < templates.length; i++) {
            if (templates[i].id === data.id) {
              templates[i] = data;
              this.setState({ templates: templates });
              return;
            }
          }
          return;
        case 'add':
          templates.push(data);
          this.setState({ templates: templates, selectedTemplate: data }, this.makePreview);
          return;
      }
    },
    onSVGElementClick: function (ev) {
      if (this.state.selectedElementPrototype && this.state.selectedElementPrototype !== 'select') {
        return;
      }

      this.unbindSelectedElement();

      let id = ev.currentTarget.id;
      if (!id) {
        return;
      }

      let el = SVG.get(id);
      this.bindSelectedElement(el);
      this.setState({ selectedElement: el });
    },
    onSVGClick: function (ev) {
      let self = this,
          el = null;

      if (!self.state.svg) {
        return;
      }

      let svg = self.state.svg;
      let x = ev.offsetX,
          y = ev.offsetY;

      switch (self.state.selectedElementPrototype) {
        case 'image':
          el = svg.image('/images/card_designer/image.png');
          el.attr({
            x: x,
            y: y - 20
          });

          self.unbindSelectedElement(el);
          self.setState({ selectedElementPrototype: 'select', selectedElement: el }, function () {
            self.bindSelectedElement(el);
            let param = {
              id: el.attr('id'),
              type: 'image',
              value: ''
            };
            let template = self.state.selectedTemplate;
            template.params.push(param);
            self.setState({ selectedTemplate: template });
          });
          break;
        case 'text':
          el = svg.text('Текст');
          el.attr({
            x: x,
            y: y - 20,
            'font-size': 16
          });

          self.unbindSelectedElement();
          self.setState({ selectedElementPrototype: 'select', selectedElement: el }, function () {
            self.bindSelectedElement(el);
            let param = {
              id: el.attr('id'),
              type: 'text',
              value: ''
            };
            let template = self.state.selectedTemplate;
            template.params.push(param);
            self.setState({ selectedTemplate: template });
          });
          break;
        case 'line':
          el = svg.line(x, y - 10, x + 100, y - 10).stroke({ width: 1 });
          el.attr({ fill: '#fafafa' });
          self.unbindSelectedElement();
          self.setState({ selectedElementPrototype: 'select', selectedElement: el }, function () {
            self.bindSelectedElement(el);
            let param = {
              id: el.attr('id'),
              type: 'line',
              value: ''
            };
            let template = self.state.selectedTemplate;
            template.params.push(param);
            self.setState({ selectedTemplate: template });
          });
          break;
        case 'rect':
          el = svg.rect(100, 100);
          el.attr({
            x: x,
            y: y - 20,
            fill: '#fafafa'
          });
          self.unbindSelectedElement();
          self.setState({ selectedElementPrototype: 'select', selectedElement: el }, function () {
            self.bindSelectedElement(el);
            let param = {
              id: el.attr('id'),
              type: 'rect',
              value: ''
            };
            let template = self.state.selectedTemplate;
            template.params.push(param);
            self.setState({ selectedTemplate: template });
          });
          break;
      }

      this.updateTimeout();
      ev.stopPropagation();
    },
    updateElement: function () {
      this.setState({ selectedElement: this.state.selectedElement }, this.updateTimeout);
    },
    onChangeBindValue: function (param) {
      let self = this;
      let template = this.state.selectedTemplate,
          params = template.params;

      let idx = Utils.indexOfId(params, param.id);
      if (idx >= 0) {
        params[idx].value = param.value;
        template.params = params;
        self.setState({ selectedTemplate: template });
      }
    },
    render: function () {
      let self = this;

      function makeClass(name) {
        let res = 'figure figure-' + name;
        if (self.state.selectedElementPrototype === name || self.state.selectedElementPrototype === null && name === 'select') {
          res += ' selected';
        }
        return res;
      }

      return React.createElement(
        'div',
        { className: 'content-with-control-panel' },
        React.createElement(ControlPanel, { selectedTemplate: this.state.selectedTemplate, onClick: this.onControlPanelFunc, funcUnbindSelectedElement: this.unbindSelectedElement }),
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'panel' },
              React.createElement(Elements.Select, { className: 'with-element-width', values: this.state.templates, selectedValue: this.state.selectedTemplate ? this.state.selectedTemplate.id : 0, onChange: this.onTemplateChange })
            ),
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'col l6 m6 s12' },
                React.createElement(
                  'div',
                  { className: 'panel' },
                  React.createElement(
                    'div',
                    { className: 'header2' },
                    '\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u0448\u0430\u0431\u043B\u043E\u043D\u0430'
                  ),
                  React.createElement(
                    'div',
                    { id: 'templatePreview', className: 'block-card-designer' },
                    React.createElement(
                      'div',
                      { className: 'halign' },
                      '\u0428\u0430\u0431\u043B\u043E\u043D \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D'
                    )
                  )
                )
              ),
              React.createElement(
                'div',
                { className: 'col l6 m6 s12' },
                React.createElement(
                  'div',
                  { className: 'panel' },
                  React.createElement(
                    'div',
                    { className: 'header2' },
                    '\u041F\u0430\u043D\u0435\u043B\u044C \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432'
                  ),
                  React.createElement('div', { className: makeClass('select'), 'data-id': 'select', onClick: this.onElementClick }),
                  React.createElement('div', { className: makeClass('text'), 'data-id': 'text', onClick: this.onElementClick }),
                  React.createElement('div', { className: makeClass('image'), 'data-id': 'image', onClick: this.onElementClick }),
                  React.createElement('div', { className: makeClass('line'), 'data-id': 'line', onClick: this.onElementClick }),
                  React.createElement('div', { className: makeClass('rect'), 'data-id': 'rect', onClick: this.onElementClick })
                ),
                React.createElement(
                  'div',
                  { id: 'badgeElementSettings', className: 'panel-badge-settings' },
                  React.createElement(
                    'div',
                    { className: 'header2' },
                    '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430'
                  ),
                  React.createElement(SettingsPanel, { data: this.state, updateElement: this.updateElement, onChangeBindValue: this.onChangeBindValue })
                )
              )
            )
          )
        )
      );
    }
  });
});