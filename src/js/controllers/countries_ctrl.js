angular.module('fidelisa').controller('CountriesCtrl', function($scope, $ionicScrollDelegate) {
    $scope.$watch('searchText', function() {
        $ionicScrollDelegate.$getByHandle('countriesScroll').scrollTo(0, 0);
    });
});
