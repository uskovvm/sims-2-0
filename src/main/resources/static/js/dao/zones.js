'use strict';

define(['core/rest', 'objects'], function (Rest, Objects) {
  let self = {};

  self = {
    getAll: function (params, onSuccess, onError) {
      function onSuccessHook(responseData) {
        let data = responseData.rows.map(function (el, idx) {
          return Objects.compile(Objects.Zone, el);
        });

        responseData.rows = data;
        onSuccess ? onSuccess(responseData) : 0;
      }

      Rest.getJSON('/zones/api/zones', params, onSuccessHook, onError);
    },
    set: function (params, onSuccess, onError) {
      Rest.postJSON('/zones/api/zone', JSON.stringify(params), onSuccess, onError);
    },
    del: function (params, onSuccess, onError) {
      Rest.deleteJSON('/zones/api/zone', JSON.stringify(params), onSuccess, onError);
    },
    getACL: function (params, onSuccess, onError) {
      Rest.getJSON('/zones/api/acl', params, onSuccess, onError);
    },
    setACL: function (params, onSuccess, onError) {
      Rest.postJSON('/zones/api/acl', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});