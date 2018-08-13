'use strict';

define(['core/rest', 'objects'], function (Rest, Objects) {
  let self = {};

  self = {
    getAll: function (params, onSuccess, onError) {
      function onSuccessHook(res) {
        let data = res.rows.map(function (el, idx) {
          return Objects.compile(Objects.Card, el);
        });

        res.rows = data;

        onSuccess ? onSuccess(res) : 0;
      }

      Rest.getJSON('/personnel/api/cards', params, onSuccessHook, onError);
    },
    set: function (params, onSuccess, onError) {
      Rest.postJSON('/personnel/api/card', JSON.stringify(params), onSuccess, onError);
    },
    del: function (params, onSuccess, onError) {
      Rest.deleteJSON('/personnel/api/card', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});