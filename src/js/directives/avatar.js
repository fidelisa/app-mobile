angular.module('fidelisa')

.directive('fdAvatar', function($window, AppConfig){

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      fdImageUri: "=",
      fdImage: "=",
      fdInitial: "=",
      fdFirst: "=",
      fdLast: "="
    },

    template: '<img ng-src="{{componentImage}}">',

    controller: function($scope) {
      $scope.$watch('fdImage', function() {
        if ($scope.fdImage) {
          $scope.componentImage = AppConfig.host + '/api/images/'+$scope.fdImage+'?static=t';
        } else {
          $scope.componentImage = $scope.fdImageUri || 'img/avatarEmpty.png'
        }
      })
    }

  }
});
