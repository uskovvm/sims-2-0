'use strict';

define(['core/rest', 'objects'], function (Rest, Objects) {
  let self = {};

  self = {
    getCards: function (params, onSuccess, onError) {
      Rest.getJSON('/personnel/api/cards', params, onSuccess, onError);
    },
    getCard: function (params, onSuccess, onError) {
      Rest.getJSON('/personnel/api/card', params, onSuccess, onError);
    },
    setCard: function (params, onSuccess, onError) {
      Rest.postJSON('/personnel/api/card', JSON.stringify(params), onSuccess, onError);
    },
    deleteCard: function (params, onSuccess, onError) {
      Rest.deleteJSON('/personnel/api/card', JSON.stringify(params), onSuccess, onError);
    },
    setAvatar: function (params, onSuccess, onError) {
      Rest.postJSON('/personnel/api/account/avatar', JSON.stringify(params), onSuccess, onError);
    },
    getAll: function (params, onSuccess, onError) {
      function onSuccessHook(res) {
        let data = res.rows.map(function (el, idx) {
          return Objects.compile(Objects.Account, el);
        });

        res.rows = data;

        onSuccess ? onSuccess(res) : 0;
      }

      Rest.getJSON('/personnel/api/accounts', params, onSuccessHook, onError);
    },
    set: function (params, onSuccess, onError) {
      Rest.postJSON('/personnel/api/account', JSON.stringify(params), onSuccess, onError);
    },
    del: function (params, onSuccess, onError) {
      Rest.deleteJSON('/personnel/api/account', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});