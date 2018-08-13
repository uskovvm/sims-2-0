'use strict';

define(['core/rest'], function (Rest) {
  let self = {};

  self = {
    login: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/login', JSON.stringify(params), onSuccess, onError);
    },
    logout: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/logout', params, onSuccess, onError);
    },
    getUser: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/sys/user', params, onSuccess, onError);
    },
    getPermissionObjects: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/permission/objects', params, onSuccess, onError);
    },
    setPermissionObjects: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/permission/objects', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});