'use strict';

angular.module('fidelisa').controller('SignUpCtrl', function($rootScope,
  $scope, authService, $stateParams, User, $ionicModal, AppConfig,
  fidelisaToast, $cordovaDatePicker, $state, $ionicHistory, fdFB4,
  gettextCatalog, $window, FdTools) {

  $scope.user = {};
  $scope.showPassword = false;

  $scope.signUp = function() {
    User.check($scope.user).then(function() {
      //do nothing
    }, function(status) {
      var msg;
      if (status === 403) {
        if ($scope.showPassword) {
          msg = gettextCatalog.getString('Le mot de passe incorrect');
        } else {
          msg = gettextCatalog.getString('Veuillez indiquer votre mot de passe');
        }
        $scope.showPassword = true;
      } else {
        $scope.showPassword = false;
        msg = gettextCatalog.getString("L'identification n'a pas été possible,\
          veuillez vérifier votre saisie");
      }
      fidelisaToast.showShortBottom(msg);
    });
  };

  $scope.showFacebook = function() {
    if (FdTools.feature("facebookConnect").active) {
      return true;
    } else {
      return false;
    }
  }

  $scope.signWithFaceBook = function() {
    var realCnx = !!$window.cordova && $window.cordova.platformId.platformId !== 'browser'

    if (realCnx) {
      var fbToken;
      fdFB4.logout()
        .then(function() {
          return fdFB4.login(["public_profile", "email"]);
        })
        .then(function(userData) {
          var userId = userData.authResponse.userID;
          fbToken = userData.authResponse.accessToken;

          return fdFB4.getEmail(userId)
        })
        .then(function(result) {
          var data = {
            fb: fbToken,
            email: result.email,
            "facebook_id": result.id,
            "first_name": result.first_name,
            "last_name": result.last_name
          }
          return User.register(data);
        })
        .catch(function() {
          fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue.'));
        })
    } else {
      fidelisaToast.showLongBottom(gettextCatalog.getString('Non disponible sur un navigateur'));
    }
  }

  $scope.openForgottenPassword = function() {
    var login = $scope.user.login;
    if (login && login.contains('@')) {
      User.forgetPass($scope.user).then(function() {
        fidelisaToast.showShortBottom(
          gettextCatalog.getString('Un message vous a été envoyé à votre adresse email.'));
      }, function() {
        fidelisaToast.showShortBottom(
          gettextCatalog.getString('Une erreur est survenue veuillez vérifier votre saisie'));
      });
    } else {
      fidelisaToast.showShortBottom(
        gettextCatalog.getString("Vous devez renseigner l'email de votre compte ou nous contacter."));
    }
  }

  $scope.nextPass = function() {
    angular.element("#pass").focus();
  }

  $scope.openModal = function() {
    $ionicModal.fromTemplateUrl('templates/registration.html', {
      scope: $scope,
      animation: 'none'
    }).then(function(modal) {
      $scope.RegistrationModal = modal;
      $scope.RegistrationModal.show();
    });
  }


  if (angular.isDefined($stateParams.code)) {
    $scope.codePromo = $stateParams.code;
    $scope.openModal();
  }

  $scope.$on('event:auth-loginConfirmed', function() {
    if ($state.current.name.match(/(.*)\.profile/)) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go(AppConfig.homeState);
    }
  });

  $scope.$on('event:auth-logoutCanceled', function() {
    $scope.user = {};
  });


});
