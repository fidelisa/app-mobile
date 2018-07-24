angular
  .module('fidelisa')
  .controller('AdminMessageCtrl', function($scope, gettextCatalog, $window, fidelisaToast,
    AdminMessages, $ionicHistory, ImagesUpload) {
    $scope.headtitle = gettextCatalog.getString("Envoyer un message");

    document.addEventListener("deviceready", function() {
      $scope.withCamera = true;
    });

    $scope.message = {
      "alert": "",
      "channel": "Notification,Mail"
    };

    $scope.doSend = function() {
      ImagesUpload.create($scope.message.imageUri, 'Message')
      .then(function(image) {
        $scope.message.imageUri = undefined;
        $scope.message["image_id"] = image.uuid;
        return AdminMessages.create({}, $scope.message)
      })
      .then(function() {
        fidelisaToast.showShortBottom(gettextCatalog.getString('Le message a été envoyé.'));
        $ionicHistory.goBack();
      })
      .catch(function() {
        fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue.'));
      })
    }
  });
