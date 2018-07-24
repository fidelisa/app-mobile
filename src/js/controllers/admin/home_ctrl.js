angular
  .module('fidelisa')
  .controller('AdminHomeCtrl', function ($scope, gettextCatalog, $state, AppConfig,
    $ionicHistory, AdminMenus) {

    $scope.headtitle = gettextCatalog.getString("Administration");

    function update() {
      AdminMenus.query()
        .then(function (menus) {
          $scope.adminViews = menus;
        });
    }

    $scope.onMenuAdminClick = function (tab) {
      $state.go(AppConfig.subState(tab.link));
    }

    $scope.showHome = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go(AppConfig.goHome());
    }

    $scope.$on('$ionicView.enter', function () {
      update();
    });


  });