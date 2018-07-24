angular.module('fidelisa')

.directive('fdApplink', function($window, AppConfig, $rootScope, Stores, $localStorage){

  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {      
    },
    templateUrl: 'templates/components/fd/app_link.html',

    controller: function($scope, $location) {
      var browser = $window.cordova && $window.cordova.platformId === "browser";
      var path = $location.path();
      
      var showStore = !$localStorage.hideStore && path != '/registration';
      var urlStore;

      $scope.title = AppConfig.app.name;
      $scope.subtitle= AppConfig.app.description;

      $scope.withClose = AppConfig.app.allowHtml5;
  
      if (showStore && browser && angular.isUndefined($rootScope.codePromo)) {
  
        Stores.get({}, function(stores) {
          if ( $window.ionic.Platform.isAndroid()) {
            $scope.baseline= "Obtenir - sur Google Play"
            urlStore=stores.google;
          } else if ( $window.ionic.Platform.isIOS() ) {
            $scope.baseline= "Obtenir - sur Apple Store"
            urlStore=stores.apple;
          }

          $scope.showApplink = urlStore;
          
        })        
      }

      $scope.close = function close() {
        $localStorage.hideStore = true;
        $scope.showApplink = false;
      }

      $scope.open = function open() {
        $localStorage.hideStore = true;
        $scope.showApplink = false;
        $window.open(urlStore, "_system");
      }

    }

  }
});
