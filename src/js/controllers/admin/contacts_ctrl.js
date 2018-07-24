angular
  .module('fidelisa')
  .controller('AdminContactsCtrl', function($scope, gettextCatalog, $state, AppConfig, AdminCustomers) {
    $scope.headtitle = gettextCatalog.getString("Contacts");

  $scope.contacts = [];
  $scope.closecontacts = [];

  $scope.onRefresh = function() {
    getCustomers();
    $scope.$broadcast('scroll.refreshComplete');
  }

  function getCustomers() {
    var options = {
      customerId: "list",
      search: $scope.searchText
    };

    AdminCustomers.query(options,function(adminCustomers){
      $scope.contacts = adminCustomers;
    });
  }

  $scope.onContactClick = function(contact)  {
    $state.go(AppConfig.subState('admin_contact'), {
      id: contact.uuid
    });
  }

  $scope.$watch('searchText', function() {
    getCustomers();
  })

  getCustomers();

});
