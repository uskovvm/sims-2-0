'use strict';

define(['core/rest', 'objects'], function (Rest, Objects) {
  let self = {};

  self = {
    getAll: function (params, onSuccess, onError) {
      function onSuccessHook(data) {
        let users = data.rows.map(function (el, idx) {
          return Objects.compile(Objects.User, el);
        });

        data.rows = users;

        onSuccess ? onSuccess(data) : 0;
      }

      Rest.getJSON('/core/api/users', params, onSuccessHook, onError);
    },
    setPassword: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/user/password', JSON.stringify(params), onSuccess, onError);
    },
    set: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/user', JSON.stringify(params), onSuccess, onError);
    },
    del: function (params, onSuccess, onError) {
      Rest.deleteJSON('/core/api/user', JSON.stringify(params), onSuccess, onError);
    },
    isUsernameAvailable: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/user/username/available', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});