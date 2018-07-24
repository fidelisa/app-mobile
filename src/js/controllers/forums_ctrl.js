angular
  .module('fidelisa')
  .controller('ForumsCtrl', function($scope, $rootScope,
    $stateParams, Forums, AppConfig, $state, $localStorage, loginService,
    gettextCatalog) {

    if (angular.isUndefined($localStorage.post)) {
      $localStorage.post = {};
    }

    var user = loginService.getUser();

    var categoryID = $stateParams.id;
    $scope.listForums = [];

    $scope.onRefresh = function() {
      update();
      $scope.$broadcast('scroll.refreshComplete');
    };


    $rootScope.wrapRep = function(nb) {
      if (nb > 0) {
        return gettextCatalog.getString('{{nb}} rép.', {
          nb: nb
        });
      } else {
        return gettextCatalog.getString('Nouveau');
      }
    }

    $scope.canDeletePost = function(post) {
      return (post.customer.uuid === user.uuid);
    }

    $scope.deletePost = function(post) {
      Forums.delete({
        forumsId: post.uuid
      }, function() {
        update();
      }, function() {
        update();
      });
    }

    var update = function() {
      Forums.query({
        "forums_category": categoryID,
        "first_post": true
      }, function(data) {
        $scope.listForums = data;
      });
    };

    update();

    $rootScope.$watch('forumsCategory', function(newValue) {
      if (newValue) {
        categoryID = newValue;
        update()
      }
    });

    $scope.followToggle = function(post) {
      post.follow = !post.follow;
      if (post.follow) {
        Forums.follow({
          forumsId: post.uuid
        });
      } else {
        Forums.unfollow({
          forumsId: post.uuid
        });
      }
    }

    $scope.showDetail = function(post) {
      $rootScope.postTitle = post.title;
      $state.go(AppConfig.subState('forums_detail'), {
        id: categoryID,
        detail: post.uuid
      });
    }

    $scope.newPost = function() {
      $state.go(AppConfig.subState('forums_new'), {
        id: categoryID
      });
    }

    $scope.$on('$ionicView.enter', function() {
      update();
    });


  });
