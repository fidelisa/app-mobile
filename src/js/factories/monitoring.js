angular.module('fidelisa').factory('Monitoring', function(Statsmobile,
  $rootScope, $localStorage, $window) {

  function create(action, name) {
    if ($window.device) {
      var user = $localStorage.user;
      var customerId = user ? user.uuid : "";


      Statsmobile.create({}, {
        statsmobile: {
          action: action,
          name: name,
          os: $window.device.platform,
          versionos: $window.device.version,
          builder: $window.device.manufacturer,
          "device_id": $window.device.uuid,
          "customer_id": customerId
        }
      });
    }
  }

  function onResume() {
    create('Event', 'Resume')
  }

  function onPause() {
    create('Event', 'Pause')
  }


  return {
    create: function(action, name) {
      create(action, name);
    },

    start: function() {
      create('Event','Enter')
      document.addEventListener("pause", onPause, false);
      document.addEventListener("resume", onResume, false);
    }
  }

});
