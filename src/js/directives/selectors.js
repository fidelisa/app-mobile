angular.module('fidelisa')

.directive('fdSelectorsList', function(){
  return {
    require: 'ngModel',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      model: "=ngModel",
      list: "=",
      mono: "@",
      autoclose: "@",
      label: "@",
      title: "@"
    },

    link: function(scope, element, attrs, ngModel) {

      scope.$watch(function () {
        return ngModel.$modelValue;
      }, function(newValue) {
        if (newValue !== scope.listValue) {
          scope.listValue = newValue;
          if (angular.isDefined(newValue) || newValue === 0) {
            scope.selected = true;
          }
        }
      });
    },

    templateUrl: function() {
      return 'templates/selectors/list.html';
    },

    controller: function($scope, gettextCatalog, fidelisaSelector) {

      if (angular.isUndefined($scope.title)) {
        $scope.title = $scope.label;
      }

      $scope.selectList = function() {
          var selectorObj = {
            titleLabel: $scope.title,
            setLabel: gettextCatalog.getString('OK'),
            closeLabel: gettextCatalog.getString('Annuler'),
            multi: angular.isUndefined($scope.mono),
            selectedElements: $scope.listValue,
            closeOnSelect: angular.isDefined($scope.autoclose),
            elements: $scope.list,
            callback: function(data) {
              $scope.model = data[0];
            },
            popupCss: 'fd-popup'
          };

          fidelisaSelector.openFidelisaSelector(selectorObj);
      }
    }
  }
});
