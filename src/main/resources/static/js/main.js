'use strict';

require(['jquery', 'react', 'react-dom', 'ui/ui_navigation_panel', 'react-router', 'js/login', 'core/auth', 'core/history', 'core/events', 'core/logger', 'utils/utils', 'dao/modules', 'ui/ui_console', 'materialize'], function ($, React, ReactDOM, NavigationPanel, Router, Login, Auth, History, Events, Log, Utils, ModulesDao, Console) {
		let MainComponent = React.createClass({
				displayName: 'MainComponent',

				getInitialState: function () {
						return {
								modules: [{
										id: 1,
										name: 'СКУД',
										description: 'Управление турникетами',
										enabled: false,
										icon: '<i class="fa fa-exchange"></i>',
										path: 'acs',
										pages: [{
												id: 11,
												name: 'Управление',
												path: 'control',
												icon: '<i class="fa fa-desktop"></i>'
										}, {
												id: 12,
												name: 'Настройки',
												path: 'settings',
												icon: '<i class="fa fa-cog"></i>'
										}, {
												id: 13,
												name: 'Соединения',
												path: 'connection',
												icon: '<i class="fa fa-plug"></i>'
										}]
								}, {
										id: 2,
										name: 'Персонал',
										description: 'Настройка аккаунтов, пользователей и разрешений',
										enabled: false,
										icon: '<i class="material-icons">people</i>',
										path: 'personnel',
										pages: [{
												id: 21,
												name: 'Учётные записи',
												path: 'accounts',
												icon: '<i class="fa fa-user"></i>'
										}, {
												id: 22,
												name: 'Отделы',
												path: 'departments',
												icon: '<i class="fa fa-sitemap"></i>'
										}, {
												id: 23,
												name: 'Организации',
												path: 'organizations',
												icon: '<i class="fa fa-university"></i>'
										}, {
												id: 24,
												name: 'Дизайнер пропусков',
												path: 'card_designer',
												icon: '<i class="fa fa-picture-o"></i>'
										}, {
												id: 25,
												name: 'Временные пропуска',
												path: 'tmp_cards',
												icon: '<i class="fa fa-list-alt"></i>'
										}]
								}, {
										id: 3,
										name: 'Отчёты',
										description: 'Отчёты по проходам, рабочему времени и другое',
										enabled: false,
										icon: '<i class="fa fa-file-text-o"></i>',
										path: 'reports',
										pages: [{
												id: 32,
												name: 'События',
												path: 'events',
												icon: '<i class="fa fa-commenting-o"></i>'
										}, {
												id: 33,
												name: 'Учёт рабочего времени',
												path: 'work_time',
												icon: '<i class="fa fa-clock-o"></i>' /*,
                                                  {
                                                   id: 34,
                                                   name: 'Статистика',
                                                   path: 'stats',
                                                   icon: '<i class="fa fa-line-chart"></i>'
                                                  }*/
										}]
								}, {
										id: 5,
										name: 'Конфигурация',
										description: 'Настройка глобальной конфигурации',
										enabled: false,
										icon: '<i class="fa fa-cogs"></i>',
										path: 'configuration',
										pages: [{
												id: 1,
												name: 'Роли',
												path: 'roles',
												icon: '<i class="fa fa-user-plus"></i>'
										}, {
												id: 2,
												name: 'Пользователи',
												path: 'users',
												icon: '<i class="fa fa-group"></i>'
										}, {
												id: 3,
												name: 'Модули',
												path: 'modules',
												icon: '<i class="fa fa-sitemap"></i>'
										}, {
												id: 4,
												name: 'База данных',
												path: 'db',
												icon: '<i class="fa fa-database"></i>'
										},
										/*{
            id: 5,
            name: 'Владелец ПО',
            path: 'owner',
            icon: '<i class="fa fa-eye"></i>'
          },*/
										{
												id: 6,
												name: 'Настройка',
												path: 'settings',
												icon: '<i class="fa fa-cog"></i>'
										}]
								}, {
										id: 4,
										name: 'Зоны доступа',
										description: 'Создание, настройка и редактирования зон доступа',
										enabled: false,
										icon: '<i class="fa fa-cubes"></i>',
										path: 'zones',
										pages: [{
												id: 41,
												name: 'Просмотр',
												path: 'zones',
												icon: '<i class="fa fa-building-o"></i>'
										}]
								}, {
										id: 6,
										name: 'Календарь',
										description: 'Создание и настройка календарей',
										enabled: false,
										icon: '<i class="fa fa-calendar"></i>',
										path: 'calendar',
										pages: [{
												id: 61,
												name: 'Производственный календарь',
												path: 'calendar',
												icon: '<i class="fa fa-clock-o"></i>'
										}]
								}],
								selection: null,
								showConsole: false,
								fullscreen: false
						};
				},
				componentDidMount: function () {
						let self = this;

						function makeModules(data) {
								let modules = self.state.modules;

								// Получаем список модулей в системе
								for (let i = 0; i < modules.length; i++) {
										let module = Utils.findById(data, modules[i].id);
										if (module !== null) {
												modules[i].enabled = module.enabled;
										}
								}

								return modules;
						}

						Events.addCallback(Events.EVENT_MODULES_UPDATED, function (data) {
								self.setState({ modules: makeModules(data) });
						});

						Events.addCallback(Events.EVENT_PAGE_NAVIGATED, function (data) {
								self.setState({ selection: data }, function () {
										ReactDOM.render(React.createElement('div', { className: 'loading' }), $('main')[0]);

										let module = Utils.findById(self.state.modules, self.state.selection.moduleId);
										if (!module) {
												return;
										}

										let page = Utils.findById(module.pages, self.state.selection.pageId);
										if (!page) {
												return;
										}

										require(['modules/' + module.path + '/' + page.path + '/index'], function (Page) {
												ReactDOM.render(React.createElement(Page, null), $('main')[0]);
										});
								});
						});

						ModulesDao.get({}, function (res) {
								self.setState({
										modules: makeModules(res)
								});

								let module = $('#modulesList li').first();

								let selection = {
										moduleId: +module.attr('data-id'),
										pageId: +module.find('li').first().attr('data-id')
								};

								Log.info('Модули успешно загружены');
								Events.dispatchEvent(Events.EVENT_PAGE_NAVIGATED, selection);
						}, function () {
								Log.error('Ошибка загрузки модулей');
						});

						$('.button-collapse').sideNav({
								menuWidth: 300
						});

						$('html').on('keyup', function (e) {
								switch (e.keyCode) {
										case 13:
												Events.dispatchEvent(Events.EVENT_KEY_ENTER);
												return;
										case 27:
												Events.dispatchEvent(Events.EVENT_KEY_ESC);
												return;
								}
						});
				},
				onChangeConsole: function () {
						this.setState({ showConsole: !this.state.showConsole });
				},
				onChangeFullscreen: function () {
						this.setState({ fullscreen: !this.state.fullscreen });
				},
				render: function () {
						let currentModule = Utils.findById(this.state.modules, this.state.selection ? this.state.selection.moduleId : null),
						    moduleName = currentModule ? currentModule.name : '',
						    currentPage = currentModule ? Utils.findById(currentModule.pages, this.state.selection ? this.state.selection.pageId : null) : null,
						    pageName = currentPage ? currentPage.name : '';

						let consoleConfig = {
								show: this.state.showConsole,
								onChange: this.onChangeConsole
						};

						return React.createElement(
								'div',
								{ id: '__main__', className: this.state.fullscreen ? 'full-screen' : '' },
								React.createElement(
										'header',
										null,
										React.createElement(
												'div',
												{ className: 'header-wrapper' },
												React.createElement(
														'span',
														{ className: 'nav-panel-collapse-button' },
														React.createElement(
																'i',
																{ className: 'small material-icons with-white-color button-expand-fix', onClick: this.onChangeFullscreen },
																'toc'
														)
												),
												React.createElement(
														'a',
														{ href: '#', 'data-activates': 'slide-out', className: 'button-collapse top-nav full hide-on-large-only' },
														React.createElement(
																'i',
																{ className: 'small material-icons with-white-color button-expand-fix' },
																'toc'
														)
												),
												React.createElement(
														'div',
														{ className: 'caption' },
														moduleName,
														' > ',
														React.createElement(
																'span',
																{ className: 'page' },
																pageName
														)
												),
												React.createElement('div', { className: 'logout', onClick: Auth.logout })
										),
										React.createElement(
												'div',
												{ id: 'slide-out', className: 'side-nav fixed' },
												React.createElement('div', { className: 'logo' }),
												React.createElement(NavigationPanel, { data: this.state }),
												React.createElement(
														'div',
														{ className: 'copyright-info-panel' },
														'Carddex (c) 2010-2016'
												)
										)
								),
								React.createElement('main', null),
								React.createElement(Console, { config: consoleConfig })
						);
				}
		});

		function checkAuthorization(nextState, replaceState, callback) {
				Auth.isAuthorized(function (res) {
						if (!res) {
								replaceState({ nextPathname: nextState.location.pathname }, '/login');
						}
						callback();
				});
		}

		ReactDOM.render(React.createElement(
				Router.Router,
				{ history: History },
				React.createElement(Router.Route, { path: '/', component: MainComponent, onEnter: checkAuthorization }),
				React.createElement(Router.Route, { path: '/login', component: Login })
		), $('body')[0]);
});