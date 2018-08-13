'use strict';

define(['core/rest'], function (Rest) {
  let self = {};

  self = {
    get: function (params, onSuccess, onError) {
      Rest.getJSON('/reports/api/report', params, onSuccess, onError);
    }
  };

  return self;
});