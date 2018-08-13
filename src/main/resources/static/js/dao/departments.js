'use strict';

define(['core/rest', 'objects'], function (Rest, Objects) {
  let self = {};

  self = {
    getAll: function (params, onSuccess, onError) {
      function onSuccessHook(responseData) {
        let data = responseData.rows.map(function (el, idx) {
          return Objects.compile(Objects.Department, el);
        });

        responseData.rows = data;
        onSuccess ? onSuccess(responseData) : 0;
      }

      Rest.getJSON('/personnel/api/departments', params, onSuccessHook, onError);
    },
    set: function (params, onSuccess, onError) {
      Rest.postJSON('/personnel/api/department', JSON.stringify(params), onSuccess, onError);
    },
    del: function (params, onSuccess, onError) {
      Rest.deleteJSON('/personnel/api/department', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});