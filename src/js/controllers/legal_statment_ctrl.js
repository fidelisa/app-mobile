angular.module('fidelisa').controller('LegalStatementCtrl', function($scope) {

  $scope.closeModal = function() {
    $scope.modal.remove();
  };


});
