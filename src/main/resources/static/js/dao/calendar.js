'use strict';

define(['core/rest', 'objects'], function (Rest, Objects) {
  let self = {};

  self = {
    getDay: function (params, onSuccess, onError) {
      function onSuccessHook(responseData) {
        let data = Objects.compile(Objects.Schedule, responseData);
        onSuccess ? onSuccess(data) : 0;
      }

      Rest.getJSON('/calendar/api/schedule/day', params, onSuccessHook, onError);
    },
    setDay: function (params, onSuccess, onError) {
      Rest.postJSON('/calendar/api/schedule/day', JSON.stringify(params), onSuccess, onError);
    },
    getWeek: function (params, onSuccess, onError) {
      function onSuccessHook(responseData) {
        let data = responseData.map(function (el, idx) {
          return Objects.compile(Objects.WeekSchedule, el);
        });

        onSuccess ? onSuccess(data) : 0;
      }

      Rest.getJSON('/calendar/api/schedule/week', params, onSuccessHook, onError);
    },
    setWeek: function (params, onSuccess, onError) {
      Rest.postJSON('/calendar/api/schedule/week', JSON.stringify(params), onSuccess, onError);
    },
    getBase: function (params, onSuccess, onError) {
      Rest.getJSON('/calendar/api/base', params, onSuccess, onError);
    },
    setBase: function (params, onSuccess, onError) {
      Rest.postJSON('/calendar/api/base', JSON.stringify(params), onSuccess, onError);
    }
  };

  return self;
});