
angular.module('fidelisa')

.factory('apiHttpInterceptor', function($q, AppConfig, loginService) {

  var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
  var railsDate =    /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:[T\s](\d{2}):(\d{2}):(\d{2})?)?)?)?$/;


  function parseDateWithTz(date) {
    if ( angular.isString(date) ) {
      var re = /([0-9]{4}).([0-9]{2}).([0-9]{2}).([0-9]{2}).([0-9]{2}).([0-9]{2})/gm
      var ta = re.exec(date)
      if (ta) {
        date = Date.UTC(ta[1], ta[2]-1, ta[3], ta[4], ta[5], ta[6]);
      }
    }
    return new Date(date);
  }

  function convertDateStringsToDates(input) {
    if (!angular.isObject(input)) {
      return input;
    }

    for (var key in input) {
      if (!input.hasOwnProperty(key)) {
        continue;
      }

      var value = input[key];
      var match;
      if (angular.isObject(value)) {
        // Recurse into object
        convertDateStringsToDates(value);
      } else if (angular.isString(value) && value.length >= 6 ) { 
        // Check for string properties which look like dates.
        if ( (match = value.match(regexIso8601)) ) {
          var milliseconds = Date.parse(match[0])
          if (!isNaN(milliseconds)) {
            input[key] = new Date(milliseconds);
          }
        } else if ( (match = value.match(railsDate)) ) {
          input[key] = parseDateWithTz(value);
        } 
      }        
    }

    return input;
  }

  return {
    // optional method
    'request': function(config) {

      if ( config.url.match(AppConfig.host) ) {
        var poweredHeaders = loginService.headers();
        config.headers = angular.merge(poweredHeaders, config.headers);
      }

      if ( config.headers['Content-Type'] === 'none' ) {
        config.headers['Content-Type'] = undefined;
      }

      // do something on success
      return config;
    },

    // optional method
    'response': function(response) {
      if ( response.config.url.match(AppConfig.host) ) {
        convertDateStringsToDates(response.data);
      }
      // do something on success
      return response;
    },

    'responseError': function(rejection) {
      if ( rejection.config.url.match(AppConfig.host) ) {
        if (rejection.status === 403) {
          loginService.delUser();
        }
      }
      return $q.reject(rejection);
    }
  };
});
