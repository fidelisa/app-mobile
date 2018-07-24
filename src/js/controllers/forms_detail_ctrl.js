angular
  .module('fidelisa')
  .controller('FormsDetailCtrl', function($scope, $rootScope,
    $stateParams, AppConfig, Forms, fidelisaToast,
    CustomersForms, $ionicPopup, gettextCatalog) {

    var formID;
    $scope.customersForm = {};
    $scope.isModal = true;

    $scope.$watch('detail', function(newvalue) {
      if (newvalue) {
        formID = newvalue.uuid;
        $scope.data = newvalue.description;
        $scope.customersForm = CustomersForms.getCustomersForm(formID);
      }
    })

    var popupMsg = function(title, msg) {

      var confirmPopup = $ionicPopup.confirm({
        title: title,
        template: msg,
        buttons: [{
          text: gettextCatalog.getString('OK')
        }]
      });

      confirmPopup.then(function() {
        $scope.close();
      });
    };

    var update = function() {

      if ($stateParams.id) {
        $scope.isModal = false;
        $scope.message = '';
        $scope.detail = $rootScope.forms[$stateParams.id];
        $scope.formsID = $scope.detail.uuid;
      } else if ($scope.formsID) {
        Forms.get({
          formId: $scope.formsID
        }, function(data) {
          if (data.customersForm.validated_at) {
            $scope.popupView = true;
            popupMsg(data.title, data.description.message_done);
          } else {
            $scope.detail = data;
          }
        }, function() {
          $scope.popupView = true;
          popupMsg(gettextCatalog.getString('Formulaire'),
            gettextCatalog.getString('Le formulaire est introuvable'));
        });
      }
    }

    update();

    $scope.validChange = function() {
      CustomersForms.setCustomersForm(formID, $scope.customersForm);
      $scope.showValid = true;
      $scope.data.fields.forEach(function(field) {
        var data = $scope.customersForm.answer[field.code];
        if (angular.isUndefined(data) || data === "") {
          $scope.showValid = false;
        }
      });
    }

    var deregistration = $rootScope.$on('$ionicView.enter', function() {
      update();
    });

    $scope.isShowDescription = false;

    $scope.showDescription = function() {
      $scope.isShowDescription = !$scope.isShowDescription;
    }

    $scope.close = function() {
      deregistration();
      if ($scope.isModal) {
        $scope.formsModal.remove();
      }
    }

    $scope.send = function() {
      CustomersForms.removeCustomersForm(formID);

      Forms.answer({
        accountId: AppConfig.accountId,
        formId: $scope.detail.uuid
      }, {
        customersForm: $scope.customersForm
      }, function() {
        fidelisaToast.showShortBottom(gettextCatalog.getString('Votre demande a été enregistrée.'));
      }, function() {
        fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue.'));
      });

      $scope.close();
    }



  });
