angular
  .module('fidelisa')
  .factory('Beacon', function(Beacons, $rootScope, $localStorage,
    fidelisaToast, $document, $window) {

    var beaconsRegion = [];
    var beaconsRanging = [];

    function showDemo(pluginResult, name) {
      var text = 'event : ' + name +
        '\n' + pluginResult.region.uuid +
        '\nmajor : ' + pluginResult.region.major +
        '\nminor : ' + pluginResult.region.minor;

      fidelisaToast.showLongCenter(text);
    }


    function _createDelegate() {
      var delegate = new $window.cordova.plugins.locationManager.Delegate();

      function sendEvent(pluginResult, name) {
        var user = $localStorage.user;
        var customerId = user ? user.uuid : "";

        if (user.email == 'demo@demo.com') {
          showDemo(pluginResult, name);
        } else {
          Beacons.events({
            "beaconId": pluginResult.region.identifier,
            "customer_id": customerId,
            "name": name
          }, function() {});
        }

      }

      delegate.didDetermineStateForRegion = function(pluginResult) {
        console.info('didDetermineStateForRegion: '+ angular.toJson(pluginResult));
        if (pluginResult && pluginResult.state === 'CLRegionStateInside') {
          sendEvent(pluginResult, "enter"); // same as enter
        }
      };

      delegate.didEnterRegion = function(pluginResult) {
        console.info('didEnterRegion: '+ angular.toJson(pluginResult));
        sendEvent(pluginResult, "enter");
      };

      delegate.didExitRegion = function(pluginResult) {
        console.info('didExitRegion: '+ angular.toJson(pluginResult));
        sendEvent(pluginResult, "exit");
      };

      delegate.didStartMonitoringForRegion = function(pluginResult) {
        console.info('didStartMonitoringForRegion:'+ angular.toJson(pluginResult));
      };

      delegate.didRangeBeaconsInRegion = function(pluginResult) {
        console.info('didRangeBeaconsInRegion: '+ angular.toJson(pluginResult));
      };

      delegate.peripheralManagerDidStartAdvertising = function(pluginResult) {
        console.info('peripheralManagerDidStartAdvertising: '+ angular.toJson(pluginResult));
      };

      delegate.peripheralManagerDidUpdateState = function(pluginResult) {
        console.info('peripheralManagerDidUpdateState: '+ angular.toJson(pluginResult));
      };

      return delegate;
    }

    function _initDelegate(beacons) {
      console.info("_initDelegate");
      if (beacons) {
        beaconsRegion = [];
        beaconsRanging = [];

        beacons.forEach(function(beacon) {

          if (beacon.major == null) {
            beacon.major = undefined;
          }
          if (beacon.minor == null) {
            beacon.minor = undefined;
          }

          var beaconRegion = new $window.cordova.plugins.locationManager.BeaconRegion(beacon.uuid, beacon.account_id.toUuidString(), beacon.major, beacon.minor);

          if (beacon.listener === "Monitoring") {
            beaconsRegion.push(beaconRegion);
            $window.cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
              .fail(console.error)
              .done();
          } else if (beacon.listener === "Ranging") {
            beaconsRanging.push(beaconsRanging);
            $window.cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
              .fail(console.error)
              .done();
          }

        });
      } else {
        beaconsRegion.forEach(function(beaconRegion) {
          $window.cordova.plugins.locationManager.stopMonitoringForRegion(beaconRegion)
            .fail(console.error)
            .done();
        });

        beaconsRanging.forEach(function(beaconRegion) {
          $window.cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
            .fail(console.error)
            .done();
        });
      }

      $window.cordova.plugins.locationManager.setDelegate(_createDelegate());

      // required in iOS 8+
      // cordova.plugins.locationManager.requestWhenInUseAuthorization();
      $window.cordova.plugins.locationManager.requestAlwaysAuthorization()

    }

    function onResume() {
      var realCnx = !!$window.cordova && $window.cordova.platformId !== 'browser'
      if (realCnx) {
        Beacons.query({}, function(data) {
          _initDelegate(data);
        }, function() {
          _initDelegate();
        });  
      }
    }

    return {
      start: function() {
        //TODO: PWA beacons
        document.addEventListener("deviceready", function() {
          document.addEventListener('Resume', onResume, false);
          onResume();
        });
      }
    }

  });
