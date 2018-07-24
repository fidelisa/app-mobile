angular
  .module('fidelisa')
  .factory('FDModals', function($ionicModal) {

    var languageModal;

    return {
      openLanguage: function() {
        if (angular.isUndefined(languageModal)) {
          $ionicModal.fromTemplateUrl('templates/language.html', {})
            .then(function(modal) {
              languageModal = modal;
              languageModal.show();
            });
        } else {
          languageModal.show();
        }
      },

      closeLanguage: function() {
        if (angular.isDefined(languageModal)) {
          languageModal.remove();
          languageModal = undefined;          
        }
      }
    }

  });
