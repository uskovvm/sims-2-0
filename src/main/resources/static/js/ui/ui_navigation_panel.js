'use strict';

define(['jquery', 'react', 'react-dom', 'utils/utils', 'core/events', 'core/auth'], function ($, React, ReactDOM, Utils, Events, Auth) {
		let ModulePage = React.createClass({
				displayName: 'ModulePage',

				onClick: function () {
						this.props.onClick(this.props.data.id);
				},
				render: function () {
						let isActive = this.props.selection.pageId === this.props.data.id;

						let pageClassName = 'nav-panel-module-page-name' + (isActive ? ' item-active' : '');

						return React.createElement(
								'li',
								{ 'data-id': this.props.data.id, className: pageClassName, onClick: this.onClick },
								React.createElement('div', { className: 'nav-panel-module-page-icon', dangerouslySetInnerHTML: Utils.injectHTML(this.props.data.icon) }),
								React.createElement(
										'a',
										{ className: 'nav-panel-module-page-content', href: '#' },
										this.props.data.name
								)
						);
				}
		});

		let Module = React.createClass({
				displayName: 'Module',

				onClick: function (ev) {
						this.onPageClick(this.props.data.pages ? +$(this.refs.droplist.children).first().attr('data-id') : 0);
				},
				componentWillReceiveProps: function (newProps) {
						let isActive = newProps.selection.moduleId === newProps.data.id;
						let dom = $(this.refs.droplist);
						if (!isActive) {
								dom.slideUp(200);
						} else {
								dom.slideDown(200);
						}
				},
				onPageClick: function (pageId) {
						let params = {
								moduleId: this.props.data.id,
								pageId: pageId
						};

						Events.dispatchEvent(Events.EVENT_PAGE_NAVIGATED, params);
				},
				render: function () {
						let self = this;

						let isActive = self.props.selection.moduleId === self.props.data.id;

						let moduleClassName = 'collapsible-header nav-panel-module-name' + (isActive ? ' item-active active' : '');

						let pages = [];

						$.each(self.props.data.pages, function (idx, el) {
								if (!Auth.canViewPage(el.id)) {
										return;
								}

								if (el.path === 'settings' && !Auth.canManageModule(self.props.data.id)) {
										return;
								}

								pages.push(React.createElement(ModulePage, { key: idx, data: el, selection: self.props.selection, onClick: self.onPageClick }));
						});

						if (pages.length === 0) {
								return null;
						}

						return React.createElement(
								'li',
								{ 'data-id': self.props.data.id },
								React.createElement(
										'div',
										{ className: moduleClassName, onClick: self.onClick },
										React.createElement('div', { className: 'nav-panel-module-icon', dangerouslySetInnerHTML: Utils.injectHTML(self.props.data.icon) }),
										self.props.data.name
								),
								React.createElement(
										'ul',
										{ className: 'collapsible-body nav-panel-module-content', ref: 'droplist' },
										pages
								)
						);
				}
		});

		return React.createClass({
				componentWillReceiveProps: function () {
						$(this.refs.navPanel).find('.collapsible').collapsible({
								accordion: false
						});
				},
				render: function () {
						let self = this;

						let selection = self.props.data.selection || {
								moduleId: 0,
								pageId: 0
						};

						let modules = [];
						$.each(self.props.data.modules, function (idx, el) {
								if (!el.enabled) {
										return;
								}

								if (!Auth.canViewModule(el.id)) {
										return;
								}

								modules.push(React.createElement(Module, { key: idx, data: el, selection: selection }));
						});

						return React.createElement(
								'ul',
								{ id: 'modulesList', className: 'collapsible nav-panel', 'data-collapsible': 'accordion', ref: 'navPanel' },
								modules
						);
				}
		});
});