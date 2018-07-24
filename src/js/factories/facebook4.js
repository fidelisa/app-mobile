angular.module('fidelisa')

.factory('fdFB4', function($http, $q,  $window) {

  return {

    logout: function() {
      var d = $q.defer();
      $window.facebookConnectPlugin.getLoginStatus(function(response) {
        console.info("fb4", response);
        if (response.status === 'connected') {
          $window.facebookConnectPlugin.logout(function() {
            d.resolve(true);
          }, function (error) {
            d.reject(error);
          });
        } else {
          d.resolve(true);
        }
      });

      return d.promise;
    },

    login: function(permissions) {
      var d = $q.defer();

      $window.facebookConnectPlugin.login(permissions,function (data) {
        d.resolve(data);
      }, function (error) {
        d.reject(error);
      });
      return d.promise;
    },

    getEmail: function(facebookId) {
      var d = $q.defer();
      var path = facebookId+"/?fields=id,email,first_name,last_name";

      $window.facebookConnectPlugin.api(path, ["public_profile"], function(result) {
        d.resolve(result);
      }, function(error) {
        d.reject(error);
      });

      return d.promise;
    }
  }

});
