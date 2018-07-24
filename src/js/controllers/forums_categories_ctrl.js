angular.module('fidelisa').controller('ForumsCategoriesCtrl', function($scope, $rootScope,
  AppConfig, ForumsCategories, $timeout, $state, $localStorage, gettextCatalog, FdTools) {

  $rootScope.categories = [];

  $scope.myForums = {
    uuid: 'my',
    title: gettextCatalog.getString('Mes posts'),
    "image_id": FdTools.feature("forums").image_id
  };

  $scope.onRefresh = function() {
    update();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.showCategories = true;

  var update = function() {
    ForumsCategories.query(function(data) {
      $scope.categories = data;

      if ($scope.categories.length !== 1) {
        $scope.title = $scope.getTitleString('forums');
        $scope.showCategories = true;
      } else {
        $rootScope.forumsCategory = $scope.categories[0].uuid;
        $scope.title = $scope.categories[0].title;
        $scope.showCategories = false;
      }
    });
  };

  $scope.$on('event:auth-loginConfirmed', function() {
    update();
  });

  $scope.$on('event:auth-loginCancelled', function() {
    update();
  });

  $scope.showDetail = function(forum) {
    $rootScope.activeForum = forum.title;
    $state.go(AppConfig.subState('forums_list'), {
      id: forum.uuid
    });
  }

  $rootScope.wrapMes = function(nb) {
    if (nb > 1) {
      return gettextCatalog.getString('{{nb}} messages', {
        nb: nb
      });
    } else if (nb > 0) {
      return gettextCatalog.getString('{{nb}} message', {
        nb: nb
      });
    } else {
      return gettextCatalog.getString('Aucun');
    }
  }



  $scope.$on('$ionicView.enter', function() {
    update();
  });

});
