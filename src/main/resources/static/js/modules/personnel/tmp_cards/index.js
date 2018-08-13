'use strict';

define(['react', 'react-dom', './ui_control_panel', 'dao/cards', './ui_cards', 'ui/ui_pager', 'utils/utils', 'core/events', 'core/logger', './ui_add_card', './ui_edit_card', 'dao/zones'], function (React, ReactDOM, ControlPanel, CardsDao, Cards, Pager, Utils, Events, Log, CardAdd, CardEdit, ZonesDao) {
  return React.createClass({
    getInitialState: function () {
      return {
        view: 'browse',
        cards: [],
        zones: [],
        selectedCard: null,
        pagerLimit: 10
      };
    },
    componentDidMount: function () {
      let self = this;

      ZonesDao.getAll({}, function (res) {
        self.setState({ zones: res.rows });
      });
    },
    onPagerLimitChange: function (ev) {
      let el = $(ev.currentTarget);
      this.setState({
        pagerLimit: +el.attr('data-size')
      });
    },
    onSelect: function (ev) {
      let res = Utils.findById(this.state.cards, +ev.currentTarget.id, 'number');
      this.setState({ selectedCard: res });
    },
    load: function (_params, clb) {
      let self = this;

      let params = 'type=4';

      if (_params) {
        params += '&offset=' + _params.offset;
        params += '&limit=' + _params.limit;
      }

      CardsDao.getAll(params, function (res) {
        if (clb) {
          clb(res);
        }

        self.setState({
          cards: res.rows,
          selectedCard: res ? res.rows[0] : null
        });
      });
    },
    onControlButtonClick: function (command, clb) {
      let self = this;

      if (command === 'delete') {
        CardsDao.del({ number: +self.state.selectedCard.number }, function (res) {
          Log.info('Временная карта успешно удалёна');
          clb ? clb() : 0;
          Events.dispatchEvent(Events.EVENT_PAGER_CLICK, { id: 13 });
        }, function () {
          Log.error('Ошибка удаления временной карты');
          clb ? clb() : 0;
        });

        command = 'browse';
      }

      self.setState({
        view: command
      });
    },
    renderAdd: function () {
      let self = this;

      let data = {
        card: self.state.card,
        zones: self.state.zones,
        onOk: function (data) {
          self.setState({
            view: 'browse'
          });
        },
        onCancel: function () {
          self.setState({
            view: 'browse'
          });
        }
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(CardAdd, { data: data })
        )
      );
    },
    renderEdit: function () {
      let self = this;

      let data = {
        card: self.state.selectedCard,
        zones: self.state.zones,
        onOk: function (data) {
          self.setState({
            view: 'browse'
          });
        },
        onCancel: function () {
          self.setState({
            view: 'browse'
          });
        }
      };

      return React.createElement(
        'div',
        { className: 'content-wrapper' },
        React.createElement(
          'div',
          { className: 'content' },
          React.createElement(CardEdit, { data: data })
        )
      );
    },
    renderBrowse: function () {
      let class10 = 'pager-item' + (this.state.pagerLimit === 10 ? ' selected' : ''),
          class25 = 'pager-item' + (this.state.pagerLimit === 25 ? ' selected' : ''),
          class50 = 'pager-item' + (this.state.pagerLimit === 50 ? ' selected' : '');

      return React.createElement(
        'div',
        { className: 'content-with-control-panel' },
        React.createElement(ControlPanel, { onClick: this.onControlButtonClick, selectedCard: this.state.selectedCard }),
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'panel' },
              React.createElement(Cards, { data: this.state.cards, onSelect: this.onSelect, selectedCard: this.state.selectedCard }),
              React.createElement(
                'div',
                { className: 'halign' },
                React.createElement(Pager, { config: { id: 13 }, onLoad: this.load, limit: this.state.pagerLimit })
              ),
              React.createElement(
                'div',
                { className: 'ralign' },
                '\u042D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435:',
                React.createElement(
                  'span',
                  { className: class10, 'data-size': '10', onClick: this.onPagerLimitChange },
                  '10'
                ),
                React.createElement(
                  'span',
                  { className: class25, 'data-size': '25', onClick: this.onPagerLimitChange },
                  '25'
                ),
                React.createElement(
                  'span',
                  { className: class50, 'data-size': '50', onClick: this.onPagerLimitChange },
                  '50'
                )
              )
            )
          )
        )
      );
    },
    render: function () {
      switch (this.state.view) {
        case 'browse':
          return this.renderBrowse();
        case 'add':
          return this.renderAdd();
        case 'edit':
          return this.renderEdit();
      }
    }
  });
});