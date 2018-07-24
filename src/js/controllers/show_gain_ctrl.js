angular.module('fidelisa')

.controller('showGainCtrl', function($scope, $rootScope) {

  $scope.closeModalBurn = function() {
    $rootScope.$broadcast('$fidelisa:reloadGifts');
    $scope.modalBurnGift.remove();
  };

})
