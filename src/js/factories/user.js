
angular.module('fidelisa')

.factory('User', function($http, $q, AppConfig, loginService,  FDI18n) {

  var urlBase = '/api/customers';

  FDI18n.addEventListener(function(locale) {
    var user = loginService.getUser();
    if (user) {
      user.locale = locale;
      self.update(user);
    }
  });

  var __register = function(user) {
    var deferred = $q.defer();

    user["account_id"] = AppConfig.app.accountId;
    $http.post(AppConfig.host+urlBase, { "customer" : user })
    .success(function(data) {
      deferred.resolve(data);
    }).
    error(function(data, status) {
      deferred.reject(status);
    });
    return deferred.promise;
  }

  var self = {
    check: function (customer) {

      var deferred = $q.defer();

      var options = {
        ignoreAuthModule: true,
        method: 'GET',
        url: AppConfig.host+'/m/accounts/'+AppConfig.app.accountId+'/customers/check'
      };

      customer["account_id"] = AppConfig.app.accountId;

      if (angular.isDefined(customer.facebook_id) && customer.facebook_id!==null ) {
        options.method = 'POST'
        options.data = customer;
        loginService.setLogin({ login: customer.email });
      } else {
        if (angular.isUndefined(customer.login)) {
          customer.login = customer.email || customer.phone ;
        }
        customer.login = customer.login.replace(/ /g, "");
        loginService.setLogin(customer);
      }

      $http(options)
      .success(function (data) {
        angular.merge(customer, data);
        loginService.setUser(customer);
        deferred.resolve(customer);
      })
      .error(function (data, status) {
        loginService.delUser();
        deferred.reject(status);
      });

      return deferred.promise;
    },

    promo: function(cardId) {
      var deferred = $q.defer();

      $http.get(AppConfig.host+urlBase+'/promo/'+cardId+'?url=t&account_id='+AppConfig.app.accountId)
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function (data, status) {
          deferred.reject(status);
        });

      return deferred.promise;
    },

    register: function(user) {
      var self = this;

      return __register(user)
      .then(function() {
        return self.check(user);
      })
      .catch(function(data) {
        console.error(data);
      });
    },

    update: function(customer) {
      var deferred = $q.defer();

      var user = loginService.getUser();

      $http.put(AppConfig.host+urlBase+'/'+user.uuid, {
        "customer" : customer
      })
      .success(function(data) {
        loginService.updateUser(customer);
        deferred.resolve(data);
      }).
      error(function(data, status) {
        deferred.reject(status);
      });
      return deferred.promise;
    },



    pass: function(user) {
      var deferred = $q.defer();

      user["account_id"] = AppConfig.app.accountId;
      $http.post(AppConfig.host+urlBase+'/newpass', { "customer" : user })
      .success(function(data) {
        deferred.resolve(data);
      }).
      error(function(data, status) {
        deferred.reject(status);
      });
      return deferred.promise;
    },

    location: function(data) {
      var deferred = $q.defer();

      data["account_id"] = AppConfig.app.accountId;
      $http.post(AppConfig.host+urlBase+'/location', { "customer" : data })
      .success(function(data) {
        deferred.resolve(data);
      }).
      error(function(data, status) {
        deferred.reject(status);
      });
      return deferred.promise;
    },

    forgetPass: function(user) {
      var deferred = $q.defer();

      $http.post(AppConfig.host+urlBase+'/resendsms', { "phone" : user.login, "account_id": AppConfig.app.accountId })
      .success(function(data) {
        deferred.resolve(data);
      }).
      error(function(data, status) {
        deferred.reject(status);
      });
      return deferred.promise;
    }
  };

  return self;
});
