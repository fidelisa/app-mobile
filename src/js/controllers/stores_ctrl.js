angular.module('fidelisa').controller('StoresCtrl', function($scope, $rootScope,
  AppConfig, Stores, $state, $window) {

  $scope.android = false;
  $scope.ios = false;

  if (!$window.ionic.Platform.isAndroid() && !$window.ionic.Platform.isIOS()) {
    $state.transitionTo('show');
  }

  function update() {
    Stores.get({}, function(stores) {
      $scope.android = $window.ionic.Platform.isAndroid() && stores.google;
      $scope.ios = $window.ionic.Platform.isIOS() && stores.apple;
    });
  }

  $scope.$on('$ionicView.enter', function() {
    update();
  });

  $scope.onRefresh = function() {
    update();
    $scope.$broadcast('scroll.refreshComplete');
  };
});
