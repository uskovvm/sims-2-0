'use strict';

define(['core/rest', 'objects'], function (Rest, Objects) {
  let self = {};

  self = {
    getAll: function (params, onSuccess, onError) {
      function onSuccessHook(responseData) {
        let data = [];

        // FIXME - убираем фейковую организацию
        for (let i = 0; i < responseData.rows.length; i++) {
          if (responseData.rows[i].id !== 0) {
            data.push(Objects.compile(Objects.Organization, responseData.rows[i]));
          }
        }

        responseData.rows = data;
        onSuccess ? onSuccess(responseData) : 0;
      }

      Rest.getJSON('/personnel/api/organizations', params, onSuccessHook, onError);
    },
    set: function (params, onSuccess, onError) {
      Rest.postJSON('/personnel/api/organization', JSON.stringify(params), onSuccess, onError);
    },
    del: function (params, onSuccess, onError) {
      Rest.deleteJSON('/personnel/api/organization', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});