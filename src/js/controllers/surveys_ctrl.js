angular.module('fidelisa')

.controller('SurveysNewCtrl', function($scope, $rootScope, Surveys, AppConfig,
    fidelisaToast, gettextCatalog) {



    function update(force) {
      if ($rootScope.logged) {
        Surveys.query({}, function(data) {
          if ( data && data.length>0 && (force || angular.isUndefined(data[0].send_at) ) ) {
            $scope.survey = data[0].data || { satisfaction: '', home: '', relation: '',
              quality: '', recommand: '', notes: '' };
          }
        });
      } else {
        $scope.survey = { satisfaction: '', home: '', relation: '',
          quality: '', recommand: '', notes: '' }
      }

    }

    update(true);

    $scope.sendSurvey = function() {
      Surveys.create({
        accountId: AppConfig.accountId
      }, {
        survey: { data: $scope.survey }
      }, function() {
        fidelisaToast.showShortBottom(gettextCatalog.getString('Votre demande a été enregistrée.'));
        $scope.surveyModal.remove();
      }, function(error) {
        if (error.data && error.data.scheduled_at) {
          fidelisaToast.showShortBottom(error.data.scheduled_at[0]);
        } else {
          fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue.'));
        }
      });
    }

    $scope.closeSurvey = function() {
      $scope.surveyModal.remove();
    }


});
