'use strict';

define(['core/rest'], function (Rest) {
  let self = {};

  self = {
    get: function (params, onSuccess, onError) {
      Rest.getJSON('/scheduler/api/db', params, onSuccess, onError);
    },
    set: function (params, onSuccess, onError) {
      Rest.postJSON('/scheduler/api/db', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});