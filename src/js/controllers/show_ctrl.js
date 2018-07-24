angular.module('fidelisa')

.controller('ShowCtrl', function($scope, AppConfig,  $stateParams, Stores, $window) {

  var url =  "./";

  function updateMargin() {
    if ($window.innerHeight > height) {
      angular.element('.device-preview').css('margin-top', ($window.innerHeight - height) / 2);
    }
  }


  if (angular.isDefined($stateParams.user)) {
    url = url + '#/sso?user=' + $stateParams.user;
  }

  if ($window.screen.width < 1000) {
    $window.location.href = url
  } else {
    $scope.frameUrl = url;

    var height = 836;

    updateMargin();


    angular.element($window).bind('resize', function() {
       updateMargin();
    });

    angular.element('html').css('overflow', 'scroll');
    angular.element('body').css('overflow', 'scroll');
    angular.element('.pane').css('overflow', 'scroll');

    angular.element('.pane').css('background-image', 'none');

    Stores.get({}, function(stores) {
      $scope.appstore=stores.apple;
      $scope.andstore=stores.google;
    })

  }





});
