
angular.module('fidelisa')

.factory('CustomersForms', function( $rootScope, $localStorage ) {

  if (angular.isUndefined($localStorage.customersForms)) {
    $localStorage.customersForms = {};
  }

  return {
      setCustomersForm: function(formId, customersForm) {
        $localStorage.customersForms[formId] = customersForm;
      },

      getCustomersForm: function(formId) {
        return $localStorage.customersForms[formId] || {};
      },

      removeCustomersForm: function(formId) {
        delete $localStorage.customersForms[formId];
      }
  }


});
