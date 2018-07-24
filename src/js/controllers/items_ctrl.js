angular
  .module('fidelisa')
  .controller('ItemsCtrl', function($scope, $rootScope, FdTools, $ionicHistory,
    $stateParams, Items, AppConfig, $state, gettextCatalog, fidelisaToast) {

    $scope.itemEmpty = false;

    var categoryID = $stateParams.id || 'none',
        page = 1,
        pagesCount = 1;

    $rootScope.listItems = [];

    $scope.UserList = FdTools.feature("items").user_list;
    $scope.UserManaged = FdTools.feature("items").user_managed;
    $scope.itemCtrl = { searchText : "" } ;

    $scope.onRefresh = function() {
      update();
      $scope.$broadcast('scroll.refreshComplete');
    };

    var update = function() {

      Items.query({
        "items_category": categoryID,
        search: $scope.itemCtrl.searchText
      }, function(data) {
        $scope.itemEmpty = (data.length === 0);
        $rootScope.listItems = data;
        data.forEach(function(item) {
          item.fullDesc = false;
          item.descEncode = item.description;
        });
      });

      Items.get({
        "items_category": categoryID,
        search: $scope.itemCtrl.searchText,
        "pages": "t"
      }, function(data) {
        pagesCount = data.pages;
      });
      
      page = 1;

    };

    update();

    $rootScope.$watch('itemsCategory', function(newValue) {
      if (newValue) {
        categoryID = newValue;
        update()
      }
    });

    $scope.toggleDesc = function(item) {
      item.fullDesc = !item.fullDesc;
      if (item.fullDesc) {
        item.descEncode = item.description.textEncode();
      } else {
        item.descEncode = item.description;
      }
    }

    $scope.addItem = function(idx) {
      Items.update({
        accountId: AppConfig.accountId,
        itemsId: $rootScope.listItems[idx].uuid
      }, {
        item: {
          confirmed: true
        }
      }, function() {
        $rootScope.listItems[idx].added = true;
        fidelisaToast.showShortBottom(gettextCatalog.getString('Ajouté dans votre liste.'));
      }, function(error) {
        console.error(error);
      });
    }

    $scope.showButtons = function(item) {
      return ($scope.UserManaged && !item.added) || item.with_planning ;
    }

    $scope.showPlanning = function() {
      $ionicHistory.nextViewOptions({disableBack: true});
      $state.go(AppConfig.subState('appointment'));
    }

    $scope.$on('$ionicView.enter', function() {
      update();
    });

    $scope.showMore = function showMore() {
      return page !== pagesCount;
    }

    $scope.$watch("itemCtrl.searchText", function(newVal, oldVal) {
      if (newVal !== oldVal) {
        update();
      }
    });

    $scope.moreItem = function moreItem() {
      page = page + 1;
      Items.query({
        "items_category": categoryID,
        search: $scope.itemCtrl.searchText,
        "page": page
      }, function(data) {
        data.forEach(function(item) {
          item.fullDesc = false;
          item.descEncode = item.description;
          $rootScope.listItems.push(item);
        });

      });
    }


  });
