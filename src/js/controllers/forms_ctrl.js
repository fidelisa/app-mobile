angular
  .module('fidelisa')
  .controller('FormsCtrl', function($scope, $rootScope, AppConfig, Forms, $state) {

    $rootScope.forms = [];

    $scope.onRefresh = function() {
      update();
      $scope.$broadcast('scroll.refreshComplete');
    };

    var update = function() {
      Forms.query(function(data) {
        $rootScope.forms = data;
      }, function(error) {
        console.error(error)
      });
    };

    update();

    $scope.showDetail = function(idx) {
      $state.go(AppConfig.subState('forms_detail'), {
        id: idx
      });
    }

  });
