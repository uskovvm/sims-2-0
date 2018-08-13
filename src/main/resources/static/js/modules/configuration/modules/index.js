'use strict';

define(['jquery', 'react', 'react-dom', 'core/events', 'utils/utils', 'dao/modules'], function ($, React, ReactDOM, Events, Utils, ModulesDao) {
	return React.createClass({
		getInitialState: function () {
			return {
				modules: []
			};
		},
		componentDidMount: function () {
			let self = this;

			ModulesDao.get({}, function (data) {
				self.setState({ modules: data });
			});
		},
		onChange: function (ev) {
			let self = this;
			let id = $(ev.currentTarget).attr('data-id'),
			    modules = this.state.modules;

			let idx = Utils.indexOfId(modules, +id);
			if (idx !== -1) {
				modules[idx].enabled = ev.currentTarget.checked;
				this.setState({ modules: modules });

				ModulesDao.enable([{
					id: +id,
					enabled: ev.currentTarget.checked
				}], function (data) {
					Events.dispatchEvent(Events.EVENT_MODULES_UPDATED, self.state.modules);
				});
			}
		},
		render: function () {
			let self = this;

			let modules = this.state.modules.map(function (el, idx) {
				let className = !el.enabled ? ' disabled' : '';
				let id = 'mch' + el.id;

				return React.createElement(
					'tr',
					{ key: idx, id: el.id, className: className },
					React.createElement(
						'td',
						null,
						el.name
					),
					React.createElement(
						'td',
						null,
						el.description
					),
					React.createElement(
						'td',
						null,
						React.createElement('input', { 'data-id': el.id, type: 'checkbox', className: 'filled-in', id: id, checked: el.enabled, onChange: self.onChange, disabled: el.id === 5 }),
						React.createElement('label', { htmlFor: id })
					)
				);
			});

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
							'table',
							{ className: 'modules-table' },
							React.createElement(
								'thead',
								null,
								React.createElement(
									'tr',
									null,
									React.createElement(
										'th',
										null,
										'\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435'
									),
									React.createElement(
										'th',
										null,
										'\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435'
									),
									React.createElement(
										'th',
										null,
										'\u0410\u043A\u0442\u0438\u0432\u0435\u043D'
									)
								)
							),
							React.createElement(
								'tbody',
								null,
								modules
							)
						)
					)
				)
			);
		}
	});
});