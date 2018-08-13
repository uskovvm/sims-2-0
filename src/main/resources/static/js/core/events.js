'use strict';

define(function() {
  return new function() {
    let callbacks = [];
    
    this.EVENT_PAGE_NAVIGATED = 'EVENT_PAGE_NAVIGATED';
    this.EVENT_MODULES_UPDATED = 'EVENT_MODULES_UPDATED';
    this.EVENT_PAGER_CLICK = 'EVENT_PAGER_CLICK';
    this.EVENT_CONSOLE_MESSAGE = 'EVENT_CONSOLE_MESSAGE';
    this.EVENT_REPORT_DATA_RECEIVED = 'EVENT_REPORT_DATA_RECEIVED';
    this.EVENT_REPORT_METADATA_UPDATE = 'EVENT_REPORT_METADATA_UPDATE';
    this.EVENT_REPORT_MAKE = 'EVENT_REPORT_MAKE';
    this.EVENT_REPORT_ELEMENTS_SET_CHANGED = 'EVENT_REPORT_ELEMENTS_SET_CHANGED';
    this.EVENT_KEY_ESC = 27;
    this.EVENT_KEY_ENTER = 13;
    
    this.addCallback = function(eventType, callback) {
      let clb = callbacks[eventType];
      if (!clb) {
        callbacks[eventType] = [];
      } else {
        for (let i = 0; i < clb.length; i++) {
          if (clb[i] === callback) {
            return false;
          }
        }
      }
      
      callbacks[eventType].push(callback);
    };
    
    this.removeCallback = function(eventType, callback) {
      let clb = callbacks[eventType];
      if (!clb) {
        return;
      }
      callbacks[eventType].splice(clb.indexOf(callback), 1);
    };
    
    this.dispatchEvent = function(eventType, eventData) {
      if (!callbacks[eventType]) {
        return;
      }
      
      for (let i = 0; i < callbacks[eventType].length; i++) {
        callbacks[eventType][i](eventData);
      }
    };
  };
});
