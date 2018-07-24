angular
  .module('fidelisa')
  .controller('ItemsCartCtrl', function($scope, $rootScope, FdTools,
    $stateParams, Items, AppConfig, $state, gettextCatalog, $ionicHistory) {

    $scope.itemEmpty = false;

    $rootScope.myItems = [];

    $scope.UserList = FdTools.feature("items").user_list;
    $scope.UserManaged = FdTools.feature("items").user_managed;

    $scope.onRefresh = function() {
      update();
      $scope.$broadcast('scroll.refreshComplete');
    };

    var update = function() {
      Items.query({
        "items_category": "my"
      }, function(data) {
        $scope.itemEmpty = (data.length === 0);
        $rootScope.myItems = data;
        data.forEach(function(item) {
          item.fullDesc = false;
          item.descEncode = item.description;
        });
      });
    };

    update();

    $scope.toggleDesc = function(item) {
      item.fullDesc = !item.fullDesc;
      if (item.fullDesc) {
        item.descEncode = item.description.textEncode();
      } else {
        item.descEncode = item.description;
      }
    }

    $scope.removeItem = function(idx) {
      Items.update({
        accountId: AppConfig.accountId,
        itemsId: $rootScope.myItems[idx].uuid
      }, {
        item: {
          confirmed: false
        }
      }, function() {
          $scope.myItems.splice(idx,1); // remove cell from list
      }, function(error) {
          console.error(error);
      });
    }

    $scope.showPlanning = function() {
      $ionicHistory.nextViewOptions({disableBack: true});
      $state.go(AppConfig.subState('appointment'));
    }

  });
