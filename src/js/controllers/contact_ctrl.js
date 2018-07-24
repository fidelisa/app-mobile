angular
  .module('fidelisa')
  .controller('ContactCtrl', function($scope, gettextCatalog, $state, AppConfig, $stateParams, loginService,
    User, Feedbacks, fidelisaToast) {

    $scope.feedback = {
      subject: AppConfig.app.name,
      body: ""
    };

    var update = function() {
      $scope.user = loginService.getUser();
      $scope.appName = AppConfig.app.name;
    };

    $scope.doSend = function() {

      var success = function() {
          fidelisaToast.showShortBottom(gettextCatalog.getString('Merci pour votre message.'));
          $state.go(AppConfig.goHome());
      }

      var error = function() {
          fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue.'));
      }

      Feedbacks.create({}, $scope.feedback, success, error);

    };

  update();

  });
