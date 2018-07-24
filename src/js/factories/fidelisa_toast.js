angular
  .module('fidelisa')
  .factory('fidelisaToast', function($q, $window) {

    $window.toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-bottom-full-width",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

    return {
      showShortBottom: function(message) {
        var q = $q.defer();
        if ($window.plugins && $window.plugins.toast) {
          $window.plugins.toast.showShortBottom(message, function(response) {
            q.resolve(response);
          }, function(error) {
            q.reject(error);
          });
        } else {
          $window.toastr["info"](message);
        }

        return q.promise;
      },

      showLongBottom: function(message) {
        var q = $q.defer();
        if ($window.plugins && $window.plugins.toast) {
          $window.plugins.toast.showLongBottom(message, function(response) {
            q.resolve(response);
          }, function(error) {
            q.reject(error);
          });
        } else {
          $window.toastr["info"](message);
        }

        return q.promise;
      },

      showLongCenter: function(message) {
        var q = $q.defer();
        if ($window.plugins && $window.plugins.toast) {
          $window.plugins.toast.showLongCenter(message, function(response) {
            q.resolve(response);
          }, function(error) {
            q.reject(error);
          });
        } else {
          $window.toastr["info"](message);
        }

        return q.promise;
      },

    };

  });
