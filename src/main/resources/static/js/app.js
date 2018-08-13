'use strict';

// Установить функции для работы вебкамеры
// navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
// window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;

if (!Array.prototype.find) {
  Array.prototype.find = function(clb) {
    if (!clb) {
      return;
    }
    
    for (let i = 0; i < this.length; i++) {
      if (clb(this[i], i)) {
        return this[i];
      }
    }
    
    return null;
  }
}

require.config({
  baseUrl: 'libs',
  paths: {
    'js': '../js',
    'jquery': 'jquery/jquery.min',
    'react': 'react/react.min',
    'react-dom': 'react/react-dom.min',
    'react-draggable': 'react/react-draggable.min',
    'react-router': 'react/ReactRouter.min',
    'react-modal': 'react/react-modal.min',
    'react-day-picker': 'react/DayPicker',
    'react-webcam': 'react/react-webcam',
    'history': 'history/history.min',
    'cookie': 'js-cookie/js.cookie',
    'ui': '../js/ui',
    'objects': '../js/core/objects',
    'modules': '../js/modules',
    'dao': '../js/dao',
    'core': '../js/core',
    'utils': '../js/utils',
    'hammerjs': 'hammerjs/hammer.min',
    'picker': 'picker/picker',
    'pickerdate': 'picker/picker.date',
    'pickertime': 'picker/picker.time',
    'picker-localization': 'picker/lib/translations/ru_RU',
    'materialize': 'materialize/js/materialize',
    'svg': 'svgjs/svg.min',
    'svg-draggable': 'svgjs/svg.draggable.min',
    'svg-resize': 'svgjs/svg.resize.min',
    'svg-select': 'svgjs/svg.select.min',
    'draggable': 'draggable/draggable.min'
  },
  shim: {
    'pickerdate': ['picker'],
    'picker-localization': ['pickerdate', 'pickertime'],
    'materialize': ['hammerjs', 'picker-localization'],
    'svg-draggable': ['svg'],
    'svg-select': ['svg'],
    'svg-resize': ['svg-select']
  }
});

// Хук для корректной работы React DayPicker
define(
  'libs_hook',
  ['react'],
  function(React) {
    window.React = React;
  }
);

require(['libs_hook', 'js/main']);
