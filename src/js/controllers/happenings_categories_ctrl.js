angular.module('fidelisa').controller('HappeningsCategoriesCtrl', function ($scope,
    $rootScope, AppConfig, HappeningsCategories, $state, $localStorage, $ionicModal,
    FdTools, loginService) {

    $rootScope.categories = [];

    if (angular.isUndefined($localStorage.categories)) {
        $localStorage.categories = {};
    }

    $scope.onRefresh = function () {
        update();
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.showCategories = true;

    var update = function () {
        HappeningsCategories.query(function (data) {
            if ($localStorage.categories) {
                data.forEach(function (category) {
                    category.favorite = !!$localStorage.categories[category.uuid];
                })
            }
            $scope.categories = data;

            if ($scope.categories.length !== 1) {
                $scope.title = $scope.getTitleString('happenings');
                $scope.showCategories = true;
            } else {
                var category = $scope.categories[0];
                $rootScope.activeCategory = category;
                $rootScope.happeningsCategory = category.uuid;
                $scope.title = category.title;
                $scope.showCategories = false;
            }

        });
    };

    var chooseShop = function () {
        $ionicModal.fromTemplateUrl('templates/shops/modal.html', {
            scope: $scope,
            animation: 'none'
        }).then(function (modal) {
            $scope.ShopModal = modal;
            $scope.ShopModal.show();
        });
    }

    $scope.$on('event:auth-loginConfirmed', function () {
        update();
    });

    $scope.$on('event:auth-loginCancelled', function () {
        update();
    });

    $scope.$on('$ionicView.enter', function () {
        if ($rootScope.logged && FdTools.featureOptions("happenings").isolationVendor) {
            if (!loginService.getFavoriteShop()) {
                chooseShop();
            }
        }
        update();
    });


    $scope.favoriteToggle = function (category) {
        category.follow = !category.follow;
        if (category.follow) {
            HappeningsCategories.follow({
                happeningsCategoriesId: category.uuid
            });
        } else {
            HappeningsCategories.unfollow({
                happeningsCategoriesId: category.uuid
            });
        }
    }

    $scope.showDetail = function (category) {
        $rootScope.activeCategory = category;
        $state.go(AppConfig.subState('happenings_list'), {
            id: category.uuid
        });
    }

});
