angular.module('fidelisa').controller('ForumsDetailCtrl', function($scope, $rootScope,
    $stateParams, Forums, AppConfig, $state, loginService, $window) {

    var forumCategoryID = $stateParams.id;
    var forumsPostID = $stateParams.detail;

    var user = loginService.getUser();
    $scope.listForums = [];

    $scope.onRefresh = function() {
        update();
        $scope.$broadcast('scroll.refreshComplete');
    };

    var update = function() {
        Forums.query({
            forum: forumsPostID,
            order: 'created_at asc'
        }, function(data) {
            $scope.listForums = data;
            if (data.length === 0) {
                $window.history.back();
            }
        });
    };

    update();

    $scope.toggleMsg = function(post) {
        post.longMsg = !post.longMsg;
    }

    $scope.newPost = function() {
        $state.go(AppConfig.subState('forums_detail_new'), {
            id: forumCategoryID,
            detail: forumsPostID
        });
    }

    $scope.canDeletePost = function(post) {
        var last = $scope.listForums[$scope.listForums.length - 1];
        return (post.uuid === last.uuid) && (post.customer.uuid === user.uuid);
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

    $scope.$on('$ionicView.enter', function() {
        update();
    });


});
