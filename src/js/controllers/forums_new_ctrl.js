angular.module('fidelisa').controller('ForumsNewCtrl', function($scope, $rootScope,
    $stateParams, Forums, AppConfig, $state, fidelisaToast, $ionicHistory,
    gettextCatalog, $window, ImagesUpload) {

    document.addEventListener("deviceready", function() {
        $scope.withCamera = true;
    });

    var forumCategoryID = $stateParams.id;
    var forumsPostID = $stateParams.detail;

    $scope.withTitle = angular.isUndefined(forumsPostID);

    $scope.title = gettextCatalog.getString('Nouveau message');
    $scope.forum = {
        "forums_category_id": forumCategoryID,
        "forum_id": forumsPostID
    };

    $scope.doSend = function() {
      ImagesUpload.create($scope.forum.imageUri, 'Forum')
      .then(function(image) {
        $scope.forum.imageUri = undefined;
        $scope.forum["image_id"] = image.uuid;
        return Forums.create({}, { forum: $scope.forum })
      })
      .then(function() {
        fidelisaToast.showShortBottom(gettextCatalog.getString('Votre demande a été enregistrée.'));
        $ionicHistory.goBack();
      })
      .catch(function(error) {
        if (error.data && error.data.scheduled_at) {
            fidelisaToast.showShortBottom(error.data.scheduled_at[0]);
        } else {
            fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue.'));
        }
      })
    }
    
});
