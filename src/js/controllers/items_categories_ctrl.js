angular.module('fidelisa').controller('ItemsCategoriesCtrl', function($scope,
    $rootScope, AppConfig, ItemsCategories, $timeout, $state,
    gettextCatalog, FdTools) {

    $scope.UserList = FdTools.feature("items").user_list;

    $scope.categories = [];

    $scope.onRefresh = function() {
        update();
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.showCategories = true;

    var update = function() {
        ItemsCategories.query(function(data) {
            $scope.categories = data;

            if ($scope.categories.length !== 1) {
              $scope.title = $scope.getTitleString('items');
              $scope.showCategories = true;
            } else {
              $rootScope.itemsCategory = $scope.categories[0].uuid;
              $scope.title = $scope.categories[0].title;
              $scope.showCategories = false;
            }

        });
    };

    update();

    $scope.$on('event:auth-loginConfirmed', function() {
      update();
    });

    $scope.$on('event:auth-loginCancelled', function() {
      update();
    });


    $scope.showDetail = function(category) {
      $rootScope.activeCategory = category;
      $state.go(AppConfig.subState('items_list'), {
          id: category.uuid
      });
    }

    $scope.showCart = function() {
        $state.go(AppConfig.subState('items_cart'), {});
    }

});
