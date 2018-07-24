angular
  .module('fidelisa')
  .controller('DevModeCtrl', function($scope, AppConfig, $localStorage, $window, Customers) {

    $scope.app = {
      host: AppConfig.app.host
    }

    $scope.valideDevMode = function() {
      $localStorage.host = $scope.app.host;
      $window.location = '/';
    }

    $scope.closeDevMode = function() {
      $scope.devModeModal.remove();
    }

    $scope.removeHost = function() {
      delete $localStorage.host;
      $window.location = '/';
    }

    $scope.testGeofence = function(transition) {
      var shop = $localStorage.shops[0];
      var geo =  {
          'id': shop.uuid,
          'latitude': shop.latitude,
          'longitude': shop.longitude,
          'radius': shop.radius,
          'transitionType': transition
      };

      Customers.geofence({
        geofence: geo
      }, function() {
        console.info("Geofence send");
      }, function(error) {
        console.info("Geofence failed " + error);
      });

    }

  });
