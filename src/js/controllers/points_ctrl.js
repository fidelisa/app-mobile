angular.module('fidelisa').controller('PointsCtrl', function ($scope, $rootScope,
  AppConfig, Cards, $cordovaPinDialog, fidelisaToast, $q) {

  $scope.pointsSens = '+';
  $scope.pointsTotal = 0;

  $scope.calc = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
    ["+/-", 0, '\uf3be'],
  ]
  $scope.buttonColors = AppConfig.colors.button;


  $scope.changeSens = function () {
    if ($scope.pointsSens === '+') {
      $scope.pointsSens = '-';
      $scope.pointsSensString = '-';
    } else {
      $scope.pointsSens = '+';
      $scope.pointsSensString = '';
    }
  };

  $scope.closePointsModal = function () {
    $scope.modal.remove();
  };

  $scope.addPoints = function (points) {
    if (points === '\uf3be') {
      $scope.pointsTotal = Math.floor($scope.pointsTotal / 10);
    } else if (points === '+/-') {
      $scope.changeSens();
    } else {
      $scope.pointsTotal = $scope.pointsTotal * 10 + points;
    }

  }

  $scope.sendPoints = function () {
    var card = $scope.cardActive;
    var points = $scope.pointsTotal;

    var ajout = 'd\'ajout';
    if ($scope.pointsSens !== '+') {
      ajout = 'de suppression';
    }
    var msg = 'Veuillez donner votre téléphone à votre interlocuteur afin de valider votre demande ' + ajout + ' de ' + points + ' point' + (points > 1 ? 's' : '');

    if ($scope.pointsSens !== '+') {
      points = points * -1;
    }

    document.addEventListener("deviceready", function () {
      $cordovaPinDialog.prompt(msg, 'Sécurité').then(function (result) {
        if (result.buttonIndex == 1) {
          _sendPoints(card, $scope.pointsSens, points, result.input1).then(function () {
            fidelisaToast.showShortBottom("Les points ont été enregistrés.");
            $rootScope.$broadcast('$fidelisa:refreshCards');
          }, function () {
            fidelisaToast.showShortBottom("Une erreur est survenue dans l'enregistrement des points.");
          });
        }
      });
    });

    $scope.closePointsModal();
  }


  function _sendPoints(card, sens, points, pass) {
    var q = $q.defer();

    Cards.points({
      accountId: AppConfig.accountId,
      cardId: card.uuid
    }, {
      sens: sens,
      points: points,
      secret: pass
    }, function () {
      q.resolve();
    }, function (error) {
      console.error(error);
      q.reject(error);
    });

    return q.promise;
  }

});