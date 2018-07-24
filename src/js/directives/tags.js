angular.module('fidelisa')

.directive('fdTag', function(){

  return {
    require: 'ngModel',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      name: "=?",
      multi: '=?',
      pick: '=onPickTag',
      model: "=ngModel"
    },

    link: function(scope, element, attrs, ngModel) {

      scope.chevron = angular.isDefined(attrs.chevron);
      scope.disableClick = angular.isDefined(attrs.disableClick);

      if (angular.isDefined(attrs.showNone)) {
        scope.showNone = true;
      } else {
        scope.showNone = angular.isUndefined(attrs.multi);
      }


      scope.$watch(function () {
        return ngModel.$modelValue;
      }, function(newValue) {
        if (newValue && newValue !== scope.selectedTags) {
          scope.selectedTags = newValue;
        }
      });
    },

    templateUrl: function() {
      return 'templates/tag/tag.html';
    },

    controller: function($scope, $ionicModal, gettextCatalog, Tags,
      $ionicPopup, FdTools, fidelisaSelector, FDI18n) {

      $scope.selectedTags = [];
      $scope.tags = [];

      var wrapSelectedTags = function() {
        $scope.wrapSelectedTags = $scope.selectedTags.map(function(idx) {
          var tag = $scope.tags.findByUUID(idx);
          return tag || {};
        });
      }

      Tags.query({}, function(tags) {
        $scope.tags = tags.fdTranslateArray();
        wrapSelectedTags();
      });

      $scope.showTagLabel = !$scope.disableClick;

      this.updateName = function(name) {
        $scope.name = name;
      }

      this.updateShow = function(value) {
        $scope.showTags = value;
      }

      this.updateMulti = function(value) {
        $scope.multi = value;
      }

      $scope.labelName = function() {
        return $scope.name;
        // if ($scope.multi) { return 'Choisissez vos '+$scope.name } else {  return 'Choisissez un des '+$scope.name }
      }


      $scope.$watch('selectedTags', function() {
        $scope.showElement = $scope.selectedTags.length > 0;
        $scope.showLabel = !$scope.showElement && !$scope.disableClick;
        wrapSelectedTags();
      })

      var pickTags = function(tags) {
        $scope.selectedTags = tags;
        $scope.model = tags;
      }

      $scope.selectTag = function() {
        if ($scope.disableClick) {
          return
        }

        if (!$scope.multi) {
          $scope.selectedTags = $scope.selectedTags.slice(0,1);
        }

          var selectorObj = {
            titleLabel: FDI18n.getFeatureOptionsTitle('tags'),
            setLabel: gettextCatalog.getString('OK'),
            closeLabel: gettextCatalog.getString('Annuler'),
            multi: $scope.multi,
            selectedElements: $scope.selectedTags,
            elements: $scope.tags,
            callback: pickTags,
            popupCss: 'fd-popup'
          };

          fidelisaSelector.openFidelisaSelector(selectorObj);
      }


    }

  }
})

.directive('fdTagsOptions', function(FdTools, FDI18n) {
  return {
    restrict: 'A',
    require: '^fdTag',
    link: function(scope, element, attrs, fdTagsCtrl) {
      var tagsOptions = FdTools.feature("tags")
      var tags = tagsOptions.tags || {};

      var show = tagsOptions.active && (tags[attrs.fdTagsOptions] !== '');
      var multi = tags[attrs.fdTagsOptions] == 'Multi';
      var name = FDI18n.translateEntity(tags); //  tags['title'];
      fdTagsCtrl.updateName(name);
      fdTagsCtrl.updateShow(show);
      fdTagsCtrl.updateMulti(multi);
    }
  }
})

.directive('fdShowTags', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl:  'templates/tag/tag_show.html'
  }
})
