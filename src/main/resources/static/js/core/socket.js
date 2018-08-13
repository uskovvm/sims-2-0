'use strict';

define(
  ['objects', 'core/logger'], 
  function (Objects, Log) {
    let Socket = function (address) {
      Log.info('Сокет инициализирован!');
      // События, которые могут приходить из сокета
      let events = {
        EVENT_DEVICE_STATE_CHANGE: 'DeviceStateChangeEvent',
        EVENT_DEVICE_ERROR: 'DeviceErrorEvent',
        EVENT_INOUT: 'InOutEvent',
        EVENT_INOUT_TIMEOUT: 'InOutTimeoutEvent'		    
      };
		
      let service = {},
          socket = {},
          connected = false;

      let currentMessageId = 0;
      // Используем объект, так будет быстрее
      let callbacks = {},
          preConnectionMessages = [],
          eventsCallbacks = [];

      // Конструктор
      function init() {
        connected = false;
        socket = new WebSocket(address);
        socket.onopen = function () {
          connected = true;

          /**
           * Если до установки соединения в очереди уже были запросы - выполняем их
           */
          if (!preConnectionMessages.length) {
            return;
          }

          for (let i = 0, c = preConnectionMessages.length; i < c; i++) {
            sendMessage(preConnectionMessages[i]);
          }

          preConnectionMessages = [];
        };
        socket.onclose = function () {
          connected = false;
          setTimeout(init, 5000);
        };
        socket.onmessage = function (message) {
          message = JSON.parse(message.data);
          
//          console.log(message);
          
          // Если найден колбэк с соответствующим ИД
          if (callbacks.hasOwnProperty(message.$id)) {
            let id = message.$id;
            delete message.$id;
            // Выполняем коллбэк
            callbacks[id](message);
            // Удаляем коллбэк из очереди
            delete callbacks[id];
          } else {
            prepareEvent(message, callSingleCallback);
          }
        };
      }

      /**
       * Отправка сообщения с занесением коллбэка в очередь
       */
      function send(message, clb) {
        // Генерируем уникальный ИД сообщения
        message.$id = generateMessageId();
			
        // Добавляем коллбэк в очередь
        callbacks[message.$id] = clb;

        if (connected) {
          sendMessage(message);
        } else {
          preConnectionMessages.push(message);
        }

        return message.$id;
      }

      /**
       * Посылает сообщение
       */
      function sendMessage(message) {
        socket.send(JSON.stringify(message));
      }

      /**
       * Удалить коллбэк из очереди
       */
      function cancel(messageId) {
        if (callbacks.hasOwnProperty(messageId)) {
          delete callbacks[messageId];
        }
      }
		
      function addCallback(eventType, callback) {
        let events = eventsCallbacks[eventType]; 
        if (!events) {
          eventsCallbacks[eventType] = [ callback ];
          return;
        }
		  
        for (let i = 0; i < events.length; i++) {
          if (events[i] === callback) {
            return;
          }
        }
		  
        events.push(callback);
      }
		
      function removeCallback(eventType, callback) {
        let events = eventsCallbacks[eventType];
		  
        if (!events) {
          return;
        }
		  
        let index = events.indexOf(callback);
        if (index < 0) {
          return;
        }
		  
        events.splice(index, 1);
		  
        if (!events.length) {
          delete eventsCallbacks[eventType];
        }
      }
		
      /**
       * Если пришла очередь событий - обработать её
       */
      function prepareEvent(event, callback) {
        if (event.event && event.event.type && event.event.type.name === 'EventsQueue') {
          for (let i = 0; i < event.data.length; i++) {
            callback(event.data[i]);
          }
          return;
        }
      
        callback(event);
      }
		
      function callSingleCallback(event) {
        if (!event.event || !event.event.type || !event.event.type.name) {
          return;
        }
		  
        let events = eventsCallbacks[event.event.type.name];
        if (!events) {
          return;
        }

        for (let i = 0; i < events.length; i++) {
          events[i](event);
        }
      }

      /**
       * Сброс всех настроек
       */
      function reset() {
        connected = false;
        socket.close();
        socket = {};
        currentMessageId = 0;
        callbacks = {};
        preConnectionMessages = [];
        init();
      }

      /**
       * Сгенерировать уникальный ИД
       */
      function generateMessageId() {
        if (currentMessageId > 10000) {
          currentMessageId = 0;
        }

        return new Date().getTime().toString() + '~' + currentMessageId++;
      }

      service.send = send;
      service.prepareEvent = prepareEvent;
      service.cancel = cancel;
      service.reset = reset;
      service.addCallback = addCallback;
      service.removeCallback = removeCallback;
      service = Objects.merge(service, events);

      init();

      return service;
    };
	
    let protocol = '';
	
    if (location.protocol === 'https:') {
      protocol = 'wss://';
    } else {
      protocol = 'ws://';
    }
	
    return new Socket(protocol + location.hostname + (location.port ? ':' + location.port : '') + '/socket');
  }
);
