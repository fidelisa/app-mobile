angular
  .module('fidelisa')
  .controller('TagsCtrl', function($scope, $rootScope, FdTools,
    $timeout, Wordpress, $state, AppConfig,  $window, Tags, FDI18n) {

      if (angular.isUndefined($scope.tags)) {
        Tags.query({}, function(tags) { $scope.tags = tags.fdTranslateArray(); });
      }

      if (angular.isUndefined($scope.selectedTags)) {
        $scope.selectedTags = [];
      }

      $scope.name = FDI18n.getFeatureOptionsTitle('tags');

      if ($scope.multi) {
        $scope.tagLimit = undefined;
      } else {
        $scope.tagLimit = 1;
      }

      var isSelected = function(idx) {
        if (idx) {
          return $scope.selectedTags.indexOf(idx);
        } else {
          return -1
        }
      }

      $scope.buttonStyle = function(tag) {
        if ($scope.multi) {
          if (isSelected(tag.uuid) > -1) {
            return 'ion-ios-circle-filled';
          } else {
            return 'ion-ios-circle-outline';
          }
        } else {
          if (isSelected(tag.uuid) > -1) {
            return 'ion-ios-checkmark-outline';
          } else {
            return '';
          }
        }
      }

      $scope.pickTag = function(tagId) {

        if (!$scope.multi) {
          $scope.selectedTags = [];
        }
        if (angular.isDefined(tagId)) {
          var index = isSelected(tagId)
          if (index > -1) {
              $scope.selectedTags.splice(index, 1);
          } else {
              $scope.selectedTags.push(tagId);
          }
        }

        if (angular.isDefined($scope.pick)) {
          $scope.pick($scope.selectedTags);
        }

      }



    });
