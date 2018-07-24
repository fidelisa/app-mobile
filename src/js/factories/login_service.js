angular
  .module('fidelisa')

.factory('loginService', function($rootScope, $localStorage,
  authService, AppConfig) {


  function isLogged(user) {
    if ( angular.isUndefined(user) ){ //no user
      $rootScope.loggedPending = false;
      return false
    } else if ( angular.isUndefined(user.validated_at) ) { //legacy
      $rootScope.loggedPending = false;
      return true
    } else {
      $rootScope.loggedPending = (user.validated_at === null);
      return true;
    }
  }

  $rootScope.logged = isLogged($localStorage.user);

  $rootScope.$watchGroup(['logged','loggedPending'], function() {
    $rootScope.hidenavbar = (!$rootScope.logged || $rootScope.loggedPending) && AppConfig.menus["hidenavbar"];
  });

  return {
    setUser: function setUser(user) {
      if (angular.isUndefined(user)) {
        this.delUser();
      } else {
        $localStorage.user = user;
        isLogged(user);
        if (!$rootScope.logged) {
          $rootScope.logged = true;
          authService.loginConfirmed();
        }
      }
    },

    delUser: function delUser() {
      $localStorage.$reset();
      if ($rootScope.logged) {
        $rootScope.logged = false;
        $rootScope.loggedPending = false;
        authService.loginCancelled();
      }
    },

    getUser: function getUser() {
      return $localStorage.user;
    },

    updateUser: function updateUser(user) {
      var oldUser = $localStorage.user;
      angular.merge(oldUser, user);
      $localStorage.user = oldUser;
    },

    isDemo: function isDemo() {
      return $rootScope.logged && $localStorage.user.email === 'demo@demo.com';
    },

    isSuperCustomer: function isSuperCustomer() {
      var user = this.getUser();
      var ret = user && angular.isDefined(user.user_id) && user.user_id !== null;
      return ret;
    },

    setLogin: function setLogin(login) {
      $localStorage.login = login;
    },

    getLogin: function getLogin() {
      return $localStorage.login;
    },

    check: function check() {

    },

    setFavoriteShop: function setFavoriteShop(value) {
      $localStorage.favoriteShop = value;
    },
    
    getFavoriteShop: function getFavoriteShop() {
      return $localStorage.favoriteShop;
    },

    headers: function headers(data) {
      var device = 'mobil';
      if ( !AppConfig.isMobile ) {
        device = 'mobil-browser';
      }

      data = data || this.getLogin() || {};
      var ret = {
        'FIDELISA_PROVIDER': '2VrAL7jyGzxa11mr9f8y',
        'FIDELISA_PROVIDER_KEY': 'bJsc4y5Pq5xD3iFYwjGs',
        'FIDELISA_DEVICE': device,
        'FIDELISA_VERSION': '0.1',
        'FIDELISA_APIUSER': data.login,
        'Content-Type': 'application/json'
      }
      
      if (data.password) {
        ret['FIDELISA_APIUSER_KEY'] = data.password;        
      }

      return ret;
    }

  }

});
