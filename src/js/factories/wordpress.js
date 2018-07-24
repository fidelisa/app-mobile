"use strict";

angular
.module('fidelisa')
.factory('wpCache', function($cacheFactory) {
  return $cacheFactory('myData');
});

angular
.module('fidelisa')
.factory('Wordpress', function($http, $q, AppConfig, loginService,
  $rootScope, wpCache) {

  return {
    reset: function() {
      wpCache.removeAll();
    },
    get: function(url) {
      var self = this;

      var deferred = $q.defer();
      var cache = wpCache.get(url);
      if (cache) {
        deferred.resolve(cache);
      } else {
        $http({
            method: 'GET',
            url: url
          })
          .success(function(data) {
            console.log(data);
            if (angular.isArray(data)) {
               data.forEach(function(msg) {
                self.avatar(msg)
                  .then(function(avatar) {
                    msg.avatar = avatar;
                  });
                self.media(msg)
                  .then(function(media) {
                    msg.media = media;
                  });

                msg.commentsUrl = msg._links.replies[0].href
              });
            } 

            wpCache.put(url, data);

            deferred.resolve(data);
          })
          .error(function(data, status) {
            deferred.reject(status);
          });
      }


      return deferred.promise;
    },

    comments: function(url) {
      var deferred = $q.defer();

      var cache = wpCache.get(url);
      if (cache) {
        deferred.resolve(cache);
      } else {
        $http({
            method: 'GET',
            url: url
          })
          .success(function(data) {
            wpCache.put(url, data);
            deferred.resolve(data);
          })
          .error(function(data, status) {
            deferred.reject(status);
          });
      }


      return deferred.promise;
    },

    avatar: function(msg) {
      var deferred = $q.defer();

      $http({
          method: 'GET',
          url: msg._links.author[0].href
        })
        .success(function(data) {
          if (data.avatar_urls) {
            deferred.resolve(data.avatar_urls[48]);
          } else {
            deferred.resolve("");
          }
          
        })
        .error(function(data, status) {
          deferred.reject(status);
        });

      return deferred.promise;

    },

    media: function(msg) {
      var deferred = $q.defer();

      $http({
          method: 'GET',
          url: msg._links['wp:featuredmedia'][0].href
        })
        .success(function(data) {
          if (data.media_details && data.media_details.sizes) {
            if (data.media_details.sizes.medium_large) {
              deferred.resolve(data.media_details.sizes.medium_large.source_url);
            } else if (data.media_details.sizes.full) {
              deferred.resolve(data.media_details.sizes.full.source_url);
            }
          } else {
            deferred.resolve("");
          }
          
        })
        .error(function(data, status) {
          deferred.reject(status);
        });

      return deferred.promise;

    }

  };

});
