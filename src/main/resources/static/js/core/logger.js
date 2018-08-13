'use strict';

define(
  ['core/events'],
  function(Events) {
    let self = {};
    
    self.ALL = 0;
    self.INFO = 1;
    self.DEBUG = 2;
    self.ERROR = 3;
    
    self.log = function() {
      let obj = {
        level: arguments[0],
        message: arguments[1]
      };
      
      Events.dispatchEvent(Events.EVENT_CONSOLE_MESSAGE, obj);
    };
    
    self.info = function(message) {
      self.log(self.INFO, message);
    };
    
    self.debug = function(message) {
      self.log(self.DEBUG, message);
    };

    self.error = function(message) {
      self.log(self.ERROR, message);
    };
    
    return self;
  }
);
