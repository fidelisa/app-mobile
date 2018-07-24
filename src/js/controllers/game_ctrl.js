angular
  .module('fidelisa')
  .controller('GameCtrl', function($scope, $rootScope, loginService,
    AppConfig, Showcase, $state, $timeout, Games, gettextCatalog, $window) {

    $scope.showLegal = false;
    $scope.played = false;
    $scope.closeGameName = gettextCatalog.getString('Plus tard');

    $scope.toggleLegal = function() {
      $scope.showLegal = !$scope.showLegal;
    }

    $scope.closeGameModal = function() {
      $scope.gameModal.hide();
      $timeout(function() {
        $scope.played = false;
      }, 5 * 60 * 1000);
    };

    $scope.playGameModal = function() {
      $scope.play = true;
    }

    $scope.$watch('play', function(newValue) {
      if (newValue) {
        Games.put({
          customerGameId: $scope.customersGame.uuid
        }, {
          "customers_game": {
            confirmed: true
          }
        }, function() {
          $scope.played = false;
        });
      }
    });

    $rootScope.$on('fidelisa:endedGame', function() {
      $timeout(function() {
        if ($scope.win) {
          $scope.message = gettextCatalog.getString('Bravo, vous avez gagné !');
        } else {
          $scope.message = gettextCatalog.getString('Désolé, vous avez perdu.');
        }
        $scope.closeGameName = gettextCatalog.getString('Fermer');
      }, 800);
    });

    $rootScope.$on('$ionicView.enter', function() {
      var isGame = (!$window.cordova || $window.cordova.platformId !== "browser");

      if ($rootScope.logged && !$scope.played && isGame) {
        Games.query({}, function(data) {
          if (data && data.length > 0) {
            $scope.customersGame = data[0];
            $scope.game = data[0].game;

            data[0].game["legal_statement"] = data[0].game["legal_statement"].textEncode();
            $scope.win = data[0].winning;
            $scope.play = false;

            $scope.message = "";
            $scope.played = true;

            $scope.gameModal.show();
          }
        });

      }
    });

  });
