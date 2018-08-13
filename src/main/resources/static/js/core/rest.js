/**
 * Библиотека для работы с запросами
 */

'use strict';

define(
  ['jquery', 'core/logger'],
  function($, Log) {
    let TIMEOUT = 10000;
    
    function onSuccessDef(data) {
      Log.info('Операция прошла успешно');
    }
    
    function onErrorDef(data) {
      Log.error('Ошибка выполнения операции');
    }

    function onComplete(onSuccess, onError, isJSON) {
      return function(request, status) {
        if (status === 'success') {
          switch (request.status) {
          case 200:
            (onSuccess ? onSuccess : onSuccessDef)(isJSON ? request.responseJSON : request.responseText);
            return;
          }
        }
          
        (onError ? onError : onErrorDef)(request);
      };
    }
    
    let self = {};
    
    self = {
      /**
       * Кастомный вызов
       */
      call: function(params) {
        $.ajax(params);
      },
      /**
       * GET-запрос
       */
      get: function(url, params, onSuccess, onError) {
        let obj = {
          async: true,
          complete: onComplete(onSuccess, onError),
          data: params ? params : {},
          timeout: TIMEOUT,
          type: 'get',
          url: url
        };
        
        self.call(obj);
      },
      /**
       * POST-запрос
       */
      post: function(url, params, onSuccess, onError) {
        let obj = {
          async: true,
          complete: onComplete(onSuccess, onError),
          data: params ? params : {},
          timeout: TIMEOUT,
          type: 'post',
          url: url
        };
          
        self.call(obj);        
      },
      /**
       * Запросить JSON-объект
       */
      getJSON: function(url, params, onSuccess, onError) {
        let obj = {
          async: true,
          complete: onComplete(onSuccess, onError, true),
          data: params ? params : {},
          dataType: 'json',
          timeout: TIMEOUT,
          type: 'get',
          url: url
        };
        
        self.call(obj);
      },
      /**
       * Запостить JSON-объект
       */
      postJSON: function(url, params, onSuccess, onError) {
        let obj = {
          async: true,
          complete: onComplete(onSuccess, onError, true),
          contentType: 'application/json; charset=utf-8',
          data: params,
          dataType: 'json',
          timeout: TIMEOUT,
          type: 'post',
          url: url
        };
          
        self.call(obj);        
      },
      deleteJSON: function(url, params, onSuccess, onError) {
        let obj = {
          async: true,
          complete: onComplete(onSuccess, onError, true),
          contentType: 'application/json; charset=utf-8',
          data: params,
          dataType: 'json',
          timeout: TIMEOUT,
          type: 'delete',
          url: url
        };
          
        self.call(obj);        
      }
    };
    
    return self;
  }
);
