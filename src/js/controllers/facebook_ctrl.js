angular
  .module('fidelisa')
  .controller('FacebookCtrl', function($scope, AppConfig, fdFB, $window) {

    $scope.host = AppConfig.host;
    $scope.fbId = AppConfig.app.facebook_id;
    $scope.page = "https://www.facebook.com/" + $scope.fbId;

    document.addEventListener("deviceready", function() {
      $scope.canShare = $window.plugin && $window.plugins.socialsharing;
    });

    $scope.onRefresh = function() {
      update();
      $scope.$broadcast('scroll.refreshComplete');
    };

    var update = function() {

      if (angular.isDefined($scope.fbId)) {
        fdFB.search($scope.fbId).then(function(data) {
          $scope.profile = data;
          $scope.fbUrl = data.link;
        });


        fdFB.feeds($scope.fbId).then(function(data) {
          $scope.data = data;
        });
      }

    };

    $scope.showLike = function(number) {
      return number > 1;
    }

    $scope.share = function(url) {
      if ($scope.canShare) {
        $window.plugins.socialsharing.share(null, null, null, url);
      }
    }

    $scope.countLikes = function(msg) {
      if (msg && msg.likes && msg.likes.data) {
        return msg.likes.data.length
      } else {
        return 0;
      }
    }

    $scope.countComments = function(msg) {
      if (msg && msg.comments && msg.comments.data) {
        return msg.comments.data.length
      } else {
        return 0;
      }
    }

    $scope.convertFB = function(data) {
      var st;
      if (data) {
        st = $window.linkifyStr(data);
        st = st.replace(/\n/g, "<br />");
      }
      return st;
    }


    $scope.$on('$ionicView.enter', function() {
      update();
    });

  });
