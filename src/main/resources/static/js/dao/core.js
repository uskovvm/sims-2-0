'use strict';

define(['core/rest', 'objects'], function (Rest, Objects) {
  let self = {};

  self = {
    getVersions: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/versions', params, onSuccess, onError);
    },
    sendDBCommand: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/db/command', JSON.stringify(params), onSuccess, onError);
    },
    getConfig: function (params, onSuccess, onError) {
      function onSuccessHook(data) {
        return onSuccess(Objects.compile(Objects.Config, data));
      }

      Rest.getJSON('/core/api/config', params, onSuccessHook, onError);
    },
    setConfig: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/config', JSON.stringify(params), onSuccess, onError);
    },
    setRolePermissions: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/roles/permissions', JSON.stringify(params), onSuccess, onError);
    },
    getRoles: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/roles', params, onSuccess, onError);
    },
    getPermissions: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/permissions', params, onSuccess, onError);
    },
    getPorts: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/ports', params, onSuccess, onError);
    },
    getProtocols: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/protocols', params, onSuccess, onError);
    },
    getConnectionTypes: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/connection/types', params, onSuccess, onError);
    },
    getConnectionConfig: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/connection/config', params, onSuccess, onError);
    },
    getConnections: function (params, onSuccess, onError) {
      function onSuccessHook(responseData) {
        let data = responseData.map(function (el, idx) {
          return Objects.compile(Objects.BaseConnection, el);
        });

        onSuccess ? onSuccess(data) : 0;
      }

      Rest.getJSON('/core/api/connections', params, onSuccessHook, onError);
    },
    setConnection: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/connection', JSON.stringify(params), onSuccess, onError);
    },
    delConnection: function (params, onSuccess, onError) {
      Rest.deleteJSON('/core/api/connection', JSON.stringify(params), onSuccess, onError);
    },
    sendCommand: function (params, onSuccess, onError) {
      Rest.postJSON('/acs/api/command', JSON.stringify(params), onSuccess, onError);
    },
    getDeviceTypes: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/device/types', params, onSuccess, onError);
    },
    getIdentificationTypes: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/identification/types', params, onSuccess, onError);
    },
    getCluster: function (params, onSuccess, onError) {
      Rest.getJSON('/core/api/cluster', params, onSuccess, onError);
    },
    setCluster: function (params, onSuccess, onError) {
      Rest.postJSON('/core/api/cluster', JSON.stringify(params), onSuccess, onError);
    },
    getFrom1C: function (params, onSuccess, onError) {
      Rest.getJSON('/integration/api/1C', JSON.stringify(params), onSuccess, onError);
    },
    checkIntegration1C: function (params, onSuccess, onError) {
      Rest.getJSON('/integration/api/check', params, onSuccess, onError);
    },
    checkIntegrationBitrix: function (params, onSucces, onError) {
      Rest.getJSON('/integration/bitrix/check', params, onSucces, onError);
    },
    syncBitrix: function (params, onSucces, onError) {
      Rest.getJSON('/integration/bitrix/sync', params, onSucces, onError);
    }
  };

  return self;
});