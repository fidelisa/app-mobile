angular.module('fidelisa').controller('HomeCtrl', homeCtrl);

function homeCtrl($scope, AppConfig,
  Showcase, $state, $localStorage, $rootScope, $window, $ionicHistory,
  loginService, User, $timeout, $ionicScrollDelegate) {

  var updated;
  $scope.host = AppConfig.host;

  var update = function () {
    if ($rootScope.loggedPending) {
      User.check(loginService.getUser());
    }

    Showcase.get({
      accountId: AppConfig.accountId,
      updated: true
    }, function (res) {
      if (updated !== res.date) {
        updated = res.date;

        var params = {
          accountId: AppConfig.accountId
        };
        if ($rootScope.loggedPending) {
          params.identified = 'Pending';
        } else if ($rootScope.logged) {
          params.identified = 'Private';
        } else {
          params.identified = 'Public';
        }
        Showcase.get(params, function (res) {
          $scope.images = res.images;
        });
      }
    });
    $rootScope.superCustomer = loginService.isSuperCustomer();
  };

  $scope.onRefresh = function () {
    updated = undefined;
    update();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.imageStyle = function (image) {
    var maxWidth = $window.innerWidth;
    var width = image.width || 100;
    var height = image.height || 100;

    var destHeight = maxWidth * height / width;
    return {
      height: destHeight
    };
  }

  $scope.imageToUrl = function (imageId) {
    return AppConfig.host + '/api/images/' + imageId;
  };

  update();

  $rootScope.$watchGroup(['logged', 'loggedPending'], function (newValue, oldValue) {
    if (!newValue[1] && oldValue[1]) {
      $state.go(AppConfig.goHome());
    }

    updated = undefined;
    update();
  });

  $scope.showAdmin = function () {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go(AppConfig.subState('admin'));
  }

  $scope.$on('$ionicView.enter', function () {
    $ionicScrollDelegate.freezeScroll(false);

    $rootScope.superCustomer = loginService.isSuperCustomer();
    $timeout(function () {
      var c = angular.element('.title.title-center.header-item');
      c.each(function (idx, el) {
        el.style.left = '15px';
        el.style.right = '15px';
      })
    }, 20);
  })


  document.addEventListener("resume", onResume, false);

  function onResume() {
    update();
  }

}