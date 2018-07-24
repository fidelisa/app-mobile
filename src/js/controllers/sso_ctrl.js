'use strict';

angular.module('fidelisa').controller('SsoCtrl', function($scope, User, authService,
  $stateParams, $state, AppConfig, $localStorage,  $window, FdTools) {

  console.info('SsoCtrl', $state);
  if (angular.isDefined($stateParams.user)) {
    User.check({ login: $stateParams.user});
  }

  var okState = false;

  if (!$window.cordova) {
    if (angular.isUndefined($localStorage.page)) {
      $localStorage.page = AppConfig.homeState;
    }

    if ( $localStorage.page.startsWith('app') || $localStorage.page.startsWith('tab') ) {
      var newPage = AppConfig.subStateReplace($localStorage.page);
      if (FdTools.pageAvailable(newPage)) {
        okState = true;
        $state.transitionTo(newPage);
      }
    }
  }

  if (!okState) {
    $state.go(AppConfig.homeState);
  }



});
