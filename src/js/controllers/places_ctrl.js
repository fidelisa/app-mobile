angular.module('fidelisa').controller('PlacesCtrl',
  function($scope, $ionicScrollDelegate, Places) {

    if (angular.isUndefined($scope.places)) {
      Places.query({}, function(places) {
        $scope.places = places;
      });
    }

    if (angular.isUndefined($scope.selectedPlaces)) {
      $scope.selectedPlaces = [];
    }

    // $scope.$watch('searchText', function() {
    //     $ionicScrollDelegate.$getByHandle('placesScroll').scrollTo(0, 0);
    // });

    var isSelected = function(idx) {
      if (idx) {
        return $scope.selectedPlaces.indexOf(idx);
      } else {
        return -1
      }
    }

    $scope.buttonStyle = function(place) {
      if (isSelected(place.uuid) > -1) {
        return 'ion-ios-circle-filled';
      } else {
        return 'ion-ios-circle-outline';
      }
    }


    $scope.pickPlace = function(placeId) {

      if (!$scope.multi) {
        $scope.selectedPlaces = [];
      }
      if (angular.isDefined(placeId)) {
        var index = isSelected(placeId)
        if (index > -1) {
            $scope.selectedPlaces.splice(index, 1);
        } else {
            $scope.selectedPlaces.push(placeId);
        }
      }

      if (angular.isDefined($scope.pick)) {
        $scope.pick($scope.selectedPlaces);
      }

      var closeModal = !$scope.multi || angular.isUndefined(placeId);

      if (closeModal) {
        $scope.localModal.remove();
      }
    }

});
