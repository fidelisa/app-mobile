angular.module('fidelisa').controller('InstagramCtrl', function($scope, $rootScope, AppConfig,
  InstagramData, $timeout, $state) {

  $rootScope.instagram = {};

  $scope.onRefresh = function() {
    update();
    $scope.$broadcast('scroll.refreshComplete');
  };

  var update = function() {
    InstagramData.profile(function(data) {
      $rootScope.instagram.profile = data;
    });

    InstagramData.media(function(data) {
      $rootScope.instagram.media = data;
    });


  };

  update();

  $scope.showDetail = function(idx) {
    $state.go(AppConfig.subState('instagram_detail'), { id: idx });
  }

});
