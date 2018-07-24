angular.module('fidelisa').controller('InstagramDetailCtrl', function($scope, $rootScope,
  $stateParams) {
  $scope.detail = $rootScope.instagram.media[$stateParams.id];
});
