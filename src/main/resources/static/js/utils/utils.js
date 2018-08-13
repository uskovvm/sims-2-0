'use strict';

define(
  ['cookie', 'objects'],
  function(Cookie, Objects) {
    let Module = {};
    
    Module = {
      fetchBlob: function(uri, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', uri, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(e) {
          if (this.status == 200) {
            let blob = this.response;
            if (callback) {
              callback(blob);
            }
          }
        };
        xhr.send();
      },
      findById: function(arr, id, paramName) {
        if (!arr) {
          return null;
        }
      
        let idName = paramName ? paramName : 'id';
        
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][idName] === id) {
            return Objects.clone(arr[i]);
          }
        }
      
        return null;
      },
      indexOfId: function(arr, id, paramName) {
        if (!arr) {
          return -1;
        }
        
        let idName = paramName ? paramName : 'id';
      
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][idName] === id) {
            return i;
          }
        }
      
        return -1;
      },
      nvl: function(value, replace) {
        if (!value && (value !== '') && (value !== 0) && (value !== '0')) {
          return replace;
        }
      
        return value;
      },
      prepareCardNumber: function (isDec, _cardNumber) {
        let SZ = (isDec ? 20 : 16);
        
        let cardNumber = _cardNumber && (+_cardNumber) ? _cardNumber.toString(isDec ? 10 : 16) : '';
      
        if (cardNumber.length < SZ) {
          let len = SZ - cardNumber.length;
          for (let i = 0; i < len; i++) {
            cardNumber = '0' + cardNumber; 
          }
        }
      
        return cardNumber;
      },
      setSavedState: function(name, value) {
        let oldValue = Module.getSavedState(name) || {};
        Objects.merge(oldValue, value);
        Cookie.set(name, oldValue);
      },
      getSavedState: function(name) {
        return Cookie.getJSON(name);
      },
      /**
       * Функция используется совместно с dangerouslySetInnerHTML, например: 
       * <div dangerouslySetInnerHTML={ Utils.injectHTML(html) } />
       */
      injectHTML: function(html) {
        return { __html: html };
      },
      jsonToUrl: function(json) {
        let res = '', begin = true;
        for (let property in json) {
          if (begin) {
            begin = false;
          } else {
            res += '&';
          }
          res += property + '=' + json[property];
        }
        return res;
      }
    };
    
    return Module;
  }
);
