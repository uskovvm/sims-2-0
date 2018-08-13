'use strict';

define(['core/rest', 'objects'], function (Rest, Objects) {
  let self = {};

  self = {
    getAll: function (params, onSuccess, onError) {
      function onSuccessHook(responseData) {
        let data = responseData.map(function (el, idx) {
          return Objects.compile(Objects.BadgeAccount, el);
        });

        onSuccess ? onSuccess(data) : 0;
      }

      Rest.getJSON('/personnel/api/badges', params, onSuccessHook, onError);
    },
    get: function (params, onSuccess, onError) {
      Rest.getJSON('/personnel/api/badge', params, onSuccess, onError);
    },
    getTemplates: function (params, onSuccess, onError) {
      Rest.getJSON('/personnel/api/badge/templates', params, onSuccess, onError);
    },
    setTemplate: function (params, onSuccess, onError) {
      Rest.postJSON('/personnel/api/badge/template', JSON.stringify(params), onSuccess, onError);
    },
    delTemplate: function (params, onSuccess, onError) {
      Rest.deleteJSON('/personnel/api/badge/template', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});