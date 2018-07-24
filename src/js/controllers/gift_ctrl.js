angular.module('fidelisa')

  .controller('GiftCtrl', function ($scope) {

    $scope.closeModal = function () {
      $scope.modal.remove();
    };

  })

  .controller('GiftsCtrl', function ($scope, $rootScope, gettextCatalog, $cordovaPinDialog, Gains,
    fidelisaToast, AppConfig, FdTools, FDI18n, $ionicPopup, $ionicModal, $q) {

    var burnOption = FdTools.featureOptions('general', 'burn_gift_mobile');
    $scope.burnAlone = burnOption.active;


    var burnOptionLabel = burnOption['button_label'] || {};
    $scope.buttonBurnLabel = FDI18n.translateEntity(burnOptionLabel);

    var burnOptionText = burnOption['message_text'] || {};
    var MessageBurnText = FDI18n.translateEntity(burnOptionText);

    var deviceready = false;

    document.addEventListener("deviceready", function () {
      deviceready = true;
    });


    function AskUserBeforeBurnGift(alone) {
      if (alone) {
        var confirmPopup = $ionicPopup.confirm({
          title: gettextCatalog.getString('Gain'),
          template: MessageBurnText,
          cancelText: gettextCatalog.getString('Annuler'),
          cancelType: 'confirm-btn',
          okText: gettextCatalog.getString('OK'),
          okType: 'confirm-btn'
        });

        return confirmPopup.then(function (res) {
          var q = $q.defer();
          if (res) {
            q.resolve('myself');
          } else {
            q.reject('cancel')
          }
          return q.promise;
        });

      } else {
        if (deviceready) {
          var msg = gettextCatalog.getString('Veuillez donner votre téléphone à votre interlocuteur afin de valider votre demande');
          return $cordovaPinDialog.prompt(msg, 'Sécurité').then(function (result) {
            var q = $q.defer();
            if (result.buttonIndex == 1) {
              q.resolve(result.input1);
            } else {
              q.reject('cancel')
            }
            return q.promise;
          });
        } else {
          var q = $q.defer();
          q.reject(gettextCatalog.getString('Non disponible sur un navigateur'));
          return q.promise;
        }
      }
    }


    $scope.onConsume = function (gainId, alone) {

      if ($scope.gifts) {
        $scope.gifts.forEach(function (gift) {
          if (gift.uuid === gainId) {
            $scope.gain = angular.merge({}, gift);
          }
        });
      }

      AskUserBeforeBurnGift(alone)
        .then(function (pass) {
          var params = {
            accountId: AppConfig.accountId,
            gainId: gainId,
            secret: pass
          };
          var q = $q.defer();
          Gains.valid(params, {}, q.resolve, q.reject);
          return q.promise;
        })
        .then(function () {
          var q = $q.defer();
          $ionicModal.fromTemplateUrl('templates/gains/show.html', {
            scope: $scope
          }).then(function (modal) {
            $scope.consumedAt = new Date();
            $scope.modalBurnGift = modal;
            modal.show();
            q.resolve();
          });

          return q.promise;
        })
        .catch(function (error) {
          if (error !== 'cancel') {
            if (!angular.isString(error)) {
              error = gettextCatalog.getString('Une erreur est survenue.');
            }
            fidelisaToast.showShortBottom(error);
          }
        });
    }


  })