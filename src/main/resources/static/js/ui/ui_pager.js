'use strict';

define(['jquery', 'react', 'react-dom', 'core/events'], function ($, React, ReactDOM, Events) {
  return React.createClass({
    getInitialState: function () {
      return {
        offset: 0,
        totalRows: 0,
        onLoad: false,
        handler: null,
        limit: this.props.limit
      };
    },
    componentDidMount: function () {
      if (!this.props.config || this.props.config.firstClick !== false) {
        this.loadData({ offset: this.state.offset, limit: this.props.limit });
      }
      this.setState({ handler: Events.addCallback(Events.EVENT_PAGER_CLICK, this.onClick) });
    },
    componentWillUnmount: function () {
      Events.removeCallback(Events.EVENT_PAGER_CLICK, this.state.handler);
    },
    componentWillReceiveProps: function (newProps) {
      let self = this;

      if (this.state.limit !== newProps.limit) {
        self.setState({ limit: newProps.limit }, self.onBegin);
      }
    },
    onClick: function (data) {
      if (this.props.config && this.props.config.id === data.id) {
        this.onBegin();
      }
    },
    onBegin: function () {
      this.loadData({ offset: 0, limit: this.props.limit });
    },
    onEnd: function () {
      let offset = this.getTotalPages() * this.props.limit;
      this.loadData({ offset: offset, limit: this.props.limit });
    },
    onLeft: function () {
      let offset = this.state.offset - this.props.limit;
      offset = offset >= 0 ? offset : 0;
      this.loadData({ offset: offset, limit: this.props.limit });
    },
    onDigit: function (ev) {
      let id = +$(ev.currentTarget).attr('data-page');
      this.loadData({ offset: id * this.props.limit, limit: this.props.limit });
    },
    onRight: function () {
      let offset = this.state.offset + this.props.limit;
      offset = offset >= this.state.totalRows ? this.state.offset : offset;
      this.loadData({ offset: offset, limit: this.props.limit });
    },
    getCurrentPageIdx: function () {
      return Math.floor(this.state.offset / this.props.limit);
    },
    getTotalPages: function () {
      return Math.floor(this.state.totalRows / this.props.limit) + (this.state.totalRows % this.props.limit ? 0 : -1);
    },
    loadData: function (params, clb) {
      let self = this;

      if (self.state.onLoad) {
        return;
      }

      self.setState({ onLoad: true }, function () {
        self.props.onLoad(params, function (data) {
          self.setState({ offset: params.offset, totalRows: data.pager.totalRows, onLoad: false });
        });
      });
    },
    render: function () {
      let params = [];
      params.push(React.createElement(
        'a',
        { className: 'pager-item', onClick: this.onBegin },
        '<<'
      ));
      params.push(React.createElement(
        'a',
        { className: 'pager-item', onClick: this.onLeft },
        '<'
      ));

      let currentPageIdx = this.getCurrentPageIdx(),
          totalPages = this.getTotalPages(),
          leftIdx = 0,
          rightIdx = 0;

      if (currentPageIdx < 3) {
        leftIdx = 0;
        if (totalPages <= 5) {
          rightIdx = totalPages + 1;
        } else {
          rightIdx = 5;
        }
      } else {
        if (currentPageIdx + 2 > totalPages) {
          rightIdx = totalPages + 1;
          leftIdx = totalPages - 4;
        } else {
          rightIdx = currentPageIdx + 3;
          leftIdx = currentPageIdx - 2;
        }
      }

      for (let i = leftIdx; i < rightIdx; i++) {
        let className = 'pager-item' + (currentPageIdx === i ? ' selected' : '');
        params.push(React.createElement(
          'a',
          { className: className, 'data-page': i, onClick: this.onDigit, key: i },
          i + 1
        ));
      }

      params.push(React.createElement(
        'a',
        { className: 'pager-item', onClick: this.onRight },
        '>'
      ));
      params.push(React.createElement(
        'a',
        { className: 'pager-item', onClick: this.onEnd },
        '>>'
      ));

      let style = {};
      if (totalPages <= 0 && currentPageIdx === 0) {
        style.display = 'none';
      }

      return React.createElement(
        'div',
        { className: 'pager', style: style },
        params
      );
    }
  });
});