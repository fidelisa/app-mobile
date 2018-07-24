angular.module('fidelisa')

.factory('fdFB', function($http, $q) {

  var appId = "145953435571965";
  var appSecret = "58431c09785c4acb30737bb6f884fe0c";
  var FBHost = "https://graph.facebook.com/v2.6/";
  var fbAccessToken ;

  return {
    getToken: function() {
      var d = $q.defer();

      if (angular.isDefined(fbAccessToken)) {
        d.resolve(fbAccessToken);
      } else {
        $http({
          method: 'GET',
          url: FBHost+'oauth/access_token',
          params: {
            "grant_type" : 'client_credentials',
            "client_id" : appId,
            "client_secret" : appSecret
          }
        }).success(function(data) {
          // fbAccessToken = data.split('=')[1];
          fbAccessToken = data.access_token;
          d.resolve(data);
        })
        .error(function(data) {
          var error = "Une erreur est survenue";
          if (data && data.error && data.error.message) {
            error = data.error.message;
          }
          d.reject(error);
        });
      }

      return d.promise;

    },
    search: function(fbId) {
      var d = $q.defer();

      this.getToken().then(function() {

        var options = {
          limit: 10,
          q: fbId,
          locale: "fr_FR",
          type:'page',
          fields:'name,category,username,picture,likes,cover,link',
          "access_token": fbAccessToken
        };

        $http({method: 'GET', url: FBHost + fbId, params: options})
        .success(function(data) {
          d.resolve(data);
        })
        .error(function(data) {
          var error = "Une erreur est survenue";
          if (data && data.error && data.error.message) {
            error = data.error.message;
          }
          d.reject(error);
        });
      });
      return d.promise;

    },
    feeds: function (fbId) {

      var d = $q.defer();

      this.getToken().then(function() {

        var options = {
          limit: 10,
          locale: "fr_FR",
          fields:'story, message, full_picture, link, name, likes, comments, created_time',
          "access_token": fbAccessToken
        };

        $http({method: 'GET', url: FBHost + fbId + "/feed", params: options})
        .success(function(data) {
          d.resolve(data.data);
        })
        .error(function(data) {
          var error = "Une erreur est survenue";
          if (data && data.error && data.error.message) {
            error = data.error.message;
          }
          d.reject(error);
        });
      });

      return d.promise;
    }
  };

});
