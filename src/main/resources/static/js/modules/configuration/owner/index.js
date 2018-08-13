'use strict';

define(['react', 'react-dom', 'objects', 'ui/ui_elements', './ui_control_panel', 'dao/core', 'dao/organizations', 'core/logger'], function (React, ReactDOM, Objects, Elements, ControlPanel, CoreDao, OrganizationsDao, Log) {
  return React.createClass({
    getInitialState: function () {
      return {
        config: Objects.clone(Objects.Config),
        organizations: [],
        autosave: null
      };
    },
    componentDidMount: function () {
      let self = this;

      CoreDao.getConfig({}, function (data) {
        self.setState({ config: data });
      });

      OrganizationsDao.getAll({}, function (data) {
        self.setState({ organizations: data.rows });
      });
    },
    onNameChange: function (ev) {
      let config = this.state.config;
      config.owner.name = ev.currentTarget.value;
      this.setState({ config: config }, this.updateTimeout);
    },
    onFullNameChange: function (ev) {
      let config = this.state.config;
      config.owner.fullName = ev.currentTarget.value;
      this.setState({ config: config }, this.updateTimeout);
    },
    onDescriptionChange: function (ev) {
      let config = this.state.config;
      config.owner.description = ev.currentTarget.value;
      this.setState({ config: config }, this.updateTimeout);
    },
    onEmailChange: function (ev) {
      let config = this.state.config;
      config.owner.email = ev.currentTarget.value;
      this.setState({ config: config }, this.updateTimeout);
    },
    onOrganizationChange: function (id) {
      let config = this.state.config;
      config.owner.organizationId = +id;
      this.setState({ config: config }, this.updateTimeout);
    },
    updateTimeout: function () {
      if (this.state.autosave !== null) {
        clearTimeout(this.state.autosave);
      }

      this.setState({ autosave: setTimeout(this.onSave, 3000) });
    },
    deleteTimeout: function () {
      clearTimeout(this.state.autosave);
      this.setState({ autosave: null });
    },
    onSave: function () {
      CoreDao.setConfig(this.state.config, function () {
        Log.info('Данные успешно сохранены');
      }, function () {
        Log.error('Ошибка сохранения данных');
      });
      this.deleteTimeout();
    },
    render: function () {
      let data = {
        onClick: this.onSave
      };

      return React.createElement(
        'div',
        { className: 'content-with-control-panel' },
        React.createElement(ControlPanel, { data: data }),
        React.createElement(
          'div',
          { className: 'content-wrapper' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'panel' },
              React.createElement(
                'div',
                { className: 'header2' },
                '\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0432\u043B\u0430\u0434\u0435\u043B\u044C\u0446\u0435:'
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
                      '\u0418\u043C\u044F'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { type: 'text', value: this.state.config.owner.name, onChange: this.onNameChange })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041F\u043E\u043B\u043D\u043E\u0435 \u0438\u043C\u044F'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { type: 'text', value: this.state.config.owner.fullName, onChange: this.onFullNameChange })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      '\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { type: 'text', value: this.state.config.owner.description, onChange: this.onDescriptionChange })
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      'Email'
                    ),
                    React.createElement(
                      'td',
                      null,
                      React.createElement('input', { type: 'email', value: this.state.config.owner.email, onChange: this.onEmailChange })
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
                      React.createElement(
                        'div',
                        { className: 'input-field' },
                        React.createElement(Elements.Select, { values: this.state.organizations, title: '\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044E', selectedValue: this.state.config.owner.organizationId, onChange: this.onOrganizationChange })
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  });
});