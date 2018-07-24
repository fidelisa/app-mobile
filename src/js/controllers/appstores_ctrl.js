angular.module('fidelisa')

.controller('AppstoreCtrl', function($scope, $rootScope, AppConfig, Stores, $window) {

  $scope.android = false;
  $scope.ios = false;

  $scope.closeAppstoresModal = function() {
    $scope.appstoresModal.hide();
    AppConfig.showStore = false;
  };

  $rootScope.$on('$ionicView.enter', function() {
    var browser = $window.cordova && $window.cordova.platformId === "browser";

    $scope.withClose = AppConfig.app.allowHtml5;

    if (AppConfig.showStore && browser && angular.isUndefined($rootScope.codePromo)) {

      Stores.get({}, function(stores) {
        $scope.iosUrl     = stores.apple;
        $scope.androidUrl = stores.google;

        if ( $window.ionic.Platform.isAndroid() &&  $scope.androidUrl ) {
          $scope.android = true;
          if ($scope.appstoresModal) {
            $scope.appstoresModal.show();
          }
        } else if ( $window.ionic.Platform.isIOS() &&  $scope.iosUrl  ) {
          $scope.ios = true;
          if ($scope.appstoresModal) {
            $scope.appstoresModal.show();
          }
        }

      })

    }
  });

});
