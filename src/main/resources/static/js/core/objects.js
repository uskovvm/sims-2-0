'use strict';

define(
  ['jquery'],
  function($) {
    let objects = {};
  
    // FIXME - по хорошему, надо сделать объекты результатом работы функции, чтобы было невозможно переопределить поля (случайно)

    // Объекты
    objects.Event = {
      datetime: 0,
      type: {
        id: 0,
        name: ''
      },
      moduleId: 0,
      deviceId: 0
    };
  
    objects.Config = {
      owner: {
        fullName: '',
        description: '',
        organizationId: 0
      }  
    };
  
    objects.Account = {
      id: 0,
      firstName: '',
      lastName: '',
      middleName: '',
      avatar: '/images/oth/avatar.png',
      position: '',
      cardNumber: 0,
      departmentId: 0,
      organizationId: 0,
      deleted: false,
      fired: false,
      blocked: false,
      dayScheduleTypeId: 1
    };
  
    objects.Card = {
      number: 0,
      validTo: 0,
      validFrom: 0,
      blocked: false,
      type: 0
    };
    
    objects.VerificationDocument = {
      id: 0,
      type: 'Паспорт',
      number: '',
      issueDate: 0,
      issuerName: '',
      body: '',
      ownerName: ''
    };
    
    objects.AccountResponse = {
      status: 'error',
      response: {
        id: 0
      }  
    };
  
    objects.Version = {
      version: ''  
    };

    objects.User = {
      id: 0,
      username: '',
      registerDate: 0,
      roles: [],
      blocked: 0
    };
  
    objects.AuthenticatedUser = {
      id: 0,
      username: '',
      registerDate: 0,
      roles: [],
      permissions: [],
      blocked: 0
    };
  
    objects.Status = {
      status: 'error',
      description: ''
    };
  
    objects.Response = {
      status: 'error',
      description: '',
      response: null
    };
  
    objects.LoginResponse = {
      status: 'error',
      response: objects.User
    };
  
    objects.Module = {
      id: 0,
      name: '',
      description: '',
      enabled: false
    };
  
    objects.Permission = {
      id: 0,
      name: ''
    };
  
    objects.Role = {
      id: 0,
      name: '',
      description: '',
      permissions: []
    };
  
    objects.Port = {
      id: 0,
      name: '',
      vid: '',
      pid: '',
      serialNumber: '',
      pnpId: '',
      sysName: '',
      status: 0
    };
  
    objects.ProtocolType = {
      id: 0,
      name: ''
    };
  
    objects.ConnectionType = {
      id: 0,
      name: '',
      ip: false,
      protocols: []
    };

    objects.IdentificationType = {
      id: 0,
      name: ''
    };
  
    objects.DeviceType = {
      id: 0,
      name: '',
      description: ''
    };
  
    objects.Device = {
      id: 0,
      name: '',
      description: '',
      enabled: false,
      serialNumber: '',
      connection: {
        typeId: 0,
        connectionId: 0,
        protocolId: 0,
        addr: 0
      },
      device: {
        identificationTypeId: 0
      }
    };
  
    objects.DeviceResponse = {
      status: 'error',
      response: {
        ids: []
      }
    };
  
    objects.Department = {
      id: 0,
      name: '',
      description: '',
      organizationId: 0,
      dayScheduleTypeId: 1,
      blocked: false
    };
    
    objects.Connection = {
      id: 0,
      typeId: 0,
      name: '',
      sysName: '',
      baudrate: 9600,
      host: '',
      port: 0
    };
    
    objects.Organization = {
      id: 0,
      name: '',
      fullName: '',
      description: '',
      departments: [],
      blocked: false
    };
  
    objects.DepartmentResponse = {
      status: 'error',
      response: {
        id: 0
      }
    };
  
    objects.Gate = {
      id: 0,
      name: '',
      wdtChannelId: 0,
      broken: false  
    };
  
    objects.InOutEvent = {
      event: objects.Event,
      data: {
        account: objects.Account,
        direction: 0
      }
    };
  
    objects.InOutTimeoutEvent = {
      event: objects.Event
    };
  
    objects.DeviceStateChangeEvent = {
      event: objects.Event,
      data: {}
    };
  
    objects.DeviceErrorEvent = {
      event: objects.Event,
      data: {
        description: ''
      }
    };
  
    objects.WebsocketResponse = {
      event: {
        type: {
          name: '',
        }
      },
      data: null 
    };
  
    objects.AccessGroup = {
      id: 0,
      name: '',
      description: '',
      zones: []
    };
  
    objects.Zone = {
      id: 0,
      name: '',
      description: '',
      singlePass: false,
      singlePassTimeout: 0
    };
  
    objects.Schedule = {
      id: 0,
      startTime: 0,
      finishTime: 0,
      lunchStartTime: 0,
      lunchFinishTime: 0,
      halfHolidayFinishTime: 0,
      earlyArrivalTime: 0,
      latenessTime: 0,
      earlyDepartureTime: 0,
      lateDepartureTime: 0,
      absenceTime: 0   
    };
  
    objects.WeekSchedule = {
      id: 0,
      startTime: 0,
      endTime: 0,
      days: [ 0, 0, 0, 0, 0, 0, 0 ]
    };
  
    objects.ACL = {
      aclTypeId: 0,
      accessTypeId: 1,
      zones: []
    };
  
    objects.ZoneACL = {
      zoneId: 0,
      isWorkZone: false,
      accessTypeId: 0,
      weekSchedules: []
    };
  
    objects.BadgeAccount = {
      account: {
        id: 0,
        firstName: '',
        lastName: '',
        middleName: '',
        name: '',
        position: '',
        cardNumber: 0,
        cardValidTo: 0,
        avatar: '/images/oth/avatar.png'
      },
      department: {
        id: 0,
        name: ''
      },
      organization: {
        id: 0,
        name: '',
        fullName: '',
        description: ''
      }
    };
  
    // Функции
    objects.compile = function(obj1, obj2, f) {
      return restoreObject(obj1, obj2, f);
    };
    
    objects.clone = function(obj) {
      if (obj instanceof Array) {
        return $.extend(true, [], obj);
      } else {
        return $.extend(true, {}, obj);
      }
    };
    
    // FIXME - по сути то же самое, что и compile, но надо прорить аналогичность работы
    objects.merge = function(obj1, obj2) {
      return $.extend(true, obj1, obj2);
    };
  
    function restoreObject(obj1, obj2, f) {
      let obj = {};
    
      for (let key in obj1) {
        if ((typeof obj1[key] === 'object') && !(obj1[key] instanceof Array)) {
          obj[key] = obj2[key] ? restoreObject(obj1[key], obj2[key]) : obj1[key];
        } else {
          obj[key] = obj2[key] ? obj2[key] : obj1[key];
        }
      }
    
      if (!f) {
        obj = completeObject(obj, obj2);
      }
    
      return obj;
    }

    function completeObject(obj1, obj2) {
      for (let key in obj2) {
        if (obj1[key] === undefined) {
          obj1[key] = obj2[key];
          continue;
        }
      
        if ((typeof obj2[key] === 'object') && !(obj2[key] instanceof Array)) {
          obj1[key] = completeObject(obj1[key], obj2[key]);
        }
      }
    
      return obj1;
    }
  
    return objects;
  }
);
