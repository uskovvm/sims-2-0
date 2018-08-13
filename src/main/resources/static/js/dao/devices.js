'use strict';

define(['core/rest'], function (Rest) {
  let self = {};

  self = {
    getAll: function (params, onSuccess, onError) {
      Rest.getJSON('/acs/api/devices', params, onSuccess, onError);
    },
    set: function (params, onSuccess, onError) {
      Rest.postJSON('/acs/api/device', JSON.stringify(params), onSuccess, onError);
    },
    del: function (params, onSuccess, onError) {
      Rest.deleteJSON('/acs/api/device', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});