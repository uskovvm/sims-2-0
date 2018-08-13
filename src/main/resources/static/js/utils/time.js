'use strict';

define(function() {
  let self = {};
  
  self = {
    TIME_REGEXP: '^(:?[0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$',
    format: function(str, _time) {
      if (!_time && (_time !== 0)) {
        return '';
      }
      
      let time = self.split(_time);
      
      switch (str) {
      case 'HHMMSSDDMMYYYY':
        return self.toString(time[3]) + ':' + self.toString(time[4]) + ':' + self.toString(time[5]) + ' ' + self.toString(time[2]) + '.' + self.toString(time[1]) + '.' + self.toString(time[0]);
      case 'DDMMYYYY':
        return self.toString(time[2]) + '.' + self.toString(time[1]) + '.' + self.toString(time[0]);
      case 'HHMM':
        return self.toString(time[3]) + ':' + self.toString(time[4]);
      case 'MMDDHHMM':
        return self.toString(time[2]) + '.' + self.toString(time[1]) + ' ' + self.toString(time[3]) + ':' + self.toString(time[4]);
      case 'DDMMYYYYHHMMSS':
        return self.toString(time[0]) + '.' + self.toString(time[1]) + '.' + self.toString(time[2]) + ' ' + self.toString(time[3]) + ':' + self.toString(time[4]) + ':' + self.toString(time[5]);
      default: 
        return '';
      }
    },
    split: function(time) {
      let date = new Date(time);
      return [ date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() ];
    },
    toString: function(val) {
      return (val < 10 ? '0' : '') + val; 
    },
    getWorkTime: function(time) {
       return Math.floor(time / 3600000);
    },
    parseTime: function(str) {
      let parts = str.split(':');
      let hours = +parts[0], minutes = +parts[1];
      return hours * 60 + minutes;
    },
    formatTime: function(_minutes) {
      let minutes = Math.floor(_minutes % 60), hours = Math.floor(_minutes / 60);
      return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
      
    },
    formatTimestamp: function(msec) {
      msec = Math.floor(msec / 1000);
      let sec = msec % 60;
      msec = Math.floor(msec / 60);
      let minutes = msec % 60;
      msec = Math.floor(msec / 60);
      let hours = msec % 24;
      msec = Math.floor(msec / 24);
      return (msec !== 0 ? (msec + ':') : '') + (hours !== 0 ? (hours + ':') : '') + minutes + ':' + sec;  
    },
    rollDays: function(date, days) {
      let time = date.getTime() + days * 24 * 3600 * 1000;
      return new Date(time);
    }
  };
  
  return self;
});
