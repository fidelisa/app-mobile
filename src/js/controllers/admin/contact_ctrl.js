angular
  .module('fidelisa')
  .controller('AdminContactCtrl', function($scope, gettextCatalog, $state, AppConfig,
    AdminCustomers, $stateParams) {

    $scope.headtitle = gettextCatalog.getString("Contact");
    $scope.contact = {
      uuid: $stateParams.id,
      "first_name": "",
      "last_name": ""
    };

    $scope.onRefresh = function() {
      getCustomer();
      $scope.$broadcast('scroll.refreshComplete');
    }

    function getCustomer() {
      var options = {
        customerId: $stateParams.id,
        "first_name": "",
        "last_name": ""
      };

      AdminCustomers.get(options,function(adminCustomer){
        $scope.contact = adminCustomer;
      });
    }

    getCustomer();

  });
