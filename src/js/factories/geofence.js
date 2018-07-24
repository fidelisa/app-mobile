'use strict';

angular
  .module('fidelisa')
  .factory('Geofence', function(Shops, $document,
    $window, Customers) {


    //
    // onResume
    //
    function onResume() {
      Shops.all({
        "with_geofence": true
      }, function(data) {
        if (data && data.length > 0) {
          initDelegate(data);
        }
      });
    }

    //
    // initDelegate
    //
    function initDelegate(shops) {
      $window.geofence.getWatched().then(function (geofencesJson) {
        console.info("Geofence "+geofencesJson);
      });

      shops.forEach(function(shop) {
        $window.geofence.addOrUpdate({
          id: shop.uuid, // A unique identifier of geofence
          latitude: parseFloat(shop.latitude), // Geo latitude of geofence
          longitude: parseFloat(shop.longitude), // Geo longitude of geofence
          radius: shop.radius, // Radius of geofence in meters
          transitionType: 3 // Type of transition 1 - Enter, 2 - Exit, 3 - Both
        }).then(function() {
          console.info('Geofence successfully added');
        }, function(reason) {
          console.info('Adding geofence failed '+angular.toJson(reason));
        });
      });

      // window.geofence.getWatched().then(function (geofencesJson) {
      //   var geofences = JSON.parse(geofencesJson);
      //   console.info("Geofence watch", geofencesJson);
      // });

      $window.geofence.onTransitionReceived = function(geofences) {
        console.info("Geofence transition "+angular.toJson(geofences));
        geofences.forEach(function(geo) {
          console.info('Geofence transition detected '+angular.toJson(geo));
          Customers.geofence( {
            geofence: geo
          }, function() {
            console.info("Geofence send ");
          }, function(error) {
            console.error("Geofence failed "+angular.toJson(error));
          });
        });
      };
    }



    return {
      start: function() {
        document.addEventListener('deviceready', function() {
          if ($window.geofence) {
            // window.geofence is now available
            $window.geofence.initialize().then(function() {
              document.addEventListener('Resume', onResume, false);
              onResume();
            }, function(error) {
              console.error("Error", error);
            });
          }
        });
      }
    }
  });
