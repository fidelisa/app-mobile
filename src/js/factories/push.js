angular
.module('fidelisa')
.factory('PushNotify', function ($rootScope, AppConfig, Device, $state,
  $localStorage, $window) {
  var push;
  var deviceToken = $localStorage.deviceToken;

  var allowFcm = true;

  var senderId, senderType;

  if (allowFcm) {
    senderId = AppConfig.app.fcm_product || '';
    if (senderId.indexOf(':') != -1) {
      senderId = senderId.split(':')[1];
    }  
    senderType = 'Fcm';
  } else {
    senderId = AppConfig.app.gcm_product || '';    
    senderType = 'Gcm';
  }

  
  function initPush() {
    //TODO: PWA push notifications
    if ($window.PushNotification) {

      push = $window.PushNotification.init({
        "android": {
          "senderID": senderId,
          "forceShow": true
        },
        "ios": {
          "alert": "true",
          "badge": "true",
          "sound": "true"
        },
        "windows": {}
      });

      push.on('registration', function (data) {
        console.info("registration event");
        deviceToken = data.registrationId;
        sendTokenToApi();
      });

      push.on('notification', function () {
        console.info("notification event");
        $state.go(AppConfig.menus.type + '.messages');
      });

      push.on('error', function (e) {
        console.error(e.message);
      });
    }
  }

  function sendTokenToApi() {  
    console.log("token :" + deviceToken);
    $localStorage.deviceToken = deviceToken;
    var userId = ($localStorage.user) ? $localStorage.user.uuid : undefined;

    var pushType;

    if ($window.ionic.Platform.isAndroid()) {
      pushType = senderType;
    } else if ($window.ionic.Platform.isIOS()) {
      pushType = 'Apn';
    }
  
    Device.create({
      'token': deviceToken,
      'type' : pushType,
      'customer_id': userId
    }, function () {
      console.log('Send device token to API');
    }, function (error) {
      console.error(error);
    });
  }

  function start() {
    document.addEventListener("deviceready", function() {
      
      initPush();

      // register device with user
      $rootScope.$on('event:auth-loginConfirmed', function() { sendTokenToApi(); });
    
      // un-register device with user
      $rootScope.$on('event:auth-loginCancelled', function() { sendTokenToApi(); });    
    });
  }

  function resetBadge() {
    if (push) {
      push.setApplicationIconBadgeNumber(function() {
        console.log('success');
      }, function() {
        console.log('error');
      }, 0);
    }
  }
  return {
    start: start,
    resetBadge: resetBadge
  }

});