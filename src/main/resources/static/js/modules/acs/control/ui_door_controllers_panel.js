/**
 * Панель с дверными контроллерами
 */

'use strict';

define(['react', 'react-dom', 'ui/ui_elements', 'core/events', 'utils/utils', './ui_door_controller'], function (React, ReactDOM, Elements, Events, Utils, UIDoorController) {
  let VIEW_MODE_LONG = 1,
      VIEW_MODE_SHORT = 2,
      VIEW_MODE_TABLE = 3;

  return React.createClass({
    getInitialState: function () {
      return {
        viewMode: VIEW_MODE_LONG
      };
    },
    componentDidMount: function () {
      let config = Utils.getSavedState(this.props.data.moduleName);
      this.setState({ viewMode: config ? config.doorControllersPanel : VIEW_MODE_LONG });
    },
    updateSavedState: function () {
      Utils.setSavedState(this.props.data.moduleName, { doorControllersPanel: this.state.viewMode });
    },
    render: function () {
      let self = this;

      let data = {
        id: 'doorControllersPanel',
        open: true,
        iconClassName: 'icon-panel-door-controllers',
        //title: 'Дверные контроллеры',
        menuData: {
          items: [{
            render: function () {
              return React.createElement(
                'div',
                { className: self.state.viewMode === VIEW_MODE_LONG ? 'checked' : '' },
                '\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u043E'
              );
            },
            onClick: function () {
              self.setState({ viewMode: VIEW_MODE_LONG }, self.updateSavedState);
              Events.dispatchEvent(Elements.EVENT_PANEL_EXPAND, { id: 'doorControllersPanel' });
            }
          }, {
            render: function () {
              return React.createElement(
                'div',
                { className: self.state.viewMode === VIEW_MODE_SHORT ? 'checked' : '' },
                '\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u043E'
              );
            },
            onClick: function () {
              self.setState({ viewMode: VIEW_MODE_SHORT }, self.updateSavedState);
              Events.dispatchEvent(Elements.EVENT_PANEL_EXPAND, { id: 'doorControllersPanel' });
            }
          }, {
            render: function () {
              return React.createElement(
                'div',
                { className: self.state.viewMode === VIEW_MODE_TABLE ? 'checked' : '' },
                '\u0422\u0430\u0431\u043B\u0438\u0446\u0430'
              );
            },
            onClick: function () {
              self.setState({ viewMode: VIEW_MODE_TABLE }, self.updateSavedState);
              Events.dispatchEvent(Elements.EVENT_PANEL_EXPAND, { id: 'doorControllersPanel' });
            }
          }]
        }
      };

      let doorControllers = self.props.data.devices.filter(function (el, idx) {
        return +el.connection.typeId === 7;
      }).map(function (el, idx) {
        return React.createElement(UIDoorController, {
          key: idx,
          data: el,
          zones: self.props.data.zones,
          onChange: self.props.data.onChange,
          event: self.props.event,
          mode: self.state.viewMode });
      });

      if (this.state.viewMode === VIEW_MODE_TABLE) {
        return React.createElement(
          Elements.Panel,
          { className: this.props.className, data: data },
          React.createElement(
            'table',
            null,
            React.createElement(
              'thead',
              null,
              React.createElement(
                'tr',
                null,
                React.createElement(
                  'th',
                  null,
                  '\u041F\u0440\u043E\u0445\u043E\u0434'
                ),
                React.createElement(
                  'th',
                  null,
                  '\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E'
                ),
                React.createElement(
                  'th',
                  null,
                  '\u0423\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E'
                ),
                React.createElement(
                  'th',
                  null,
                  '\u0417\u043E\u043D\u0430 A'
                ),
                React.createElement(
                  'th',
                  null,
                  '\u0417\u043E\u043D\u0430 B'
                ),
                React.createElement(
                  'th',
                  null,
                  '\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435'
                )
              )
            ),
            React.createElement(
              'tbody',
              null,
              doorControllers
            )
          )
        );
      }

      return React.createElement(
        Elements.Panel,
        { className: this.props.className, data: data },
        doorControllers
      );
    }
  });
});