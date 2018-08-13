'use strict';

define(['core/rest'], function (Rest) {
  let self = {};

  self = {
    get: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/modules', params, onSuccess, onError);
    },
    enable: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/modules/enabled', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});