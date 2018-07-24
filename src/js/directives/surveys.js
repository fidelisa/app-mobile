angular.module('fidelisa')

.directive('surveyTabs', function() {
  return {
     require: 'ngModel',
     restrict: 'C',
     transclude: true,
     scope: {},
     link: function(scope, element, attrs, ngModel) {
       scope.$watch('level', function(newValue) {
         ngModel.$setViewValue(newValue);
       });

       scope.$watch(function () {
         return ngModel.$modelValue;
       }, function(newValue) {
         if (scope.level !== newValue) {
           scope.setLevelStar(newValue);
         }
       });
     },
     controller: function($scope) {
       var choices = $scope.choices = [];

       $scope.setLevelStar = function(level) {
         angular.forEach(choices, function(choice) {
           if (choice.level === level) {
             $scope.select(choice);
           }
         });
       }

       $scope.select = function(choice) {
         $scope.level = choice.level;
         angular.forEach(choices, function(choice) {
           choice.selected = false;
         });
         choice.selected = true;
       };

       this.select = function(choice) {
         $scope.select(choice);
       };

       this.addchoice = function(choice) {
         choices.push(choice);
       };
     },
     template:
        '<div class="row">'
       +'  <survey-tab level="1" name="Très insatisfait" on-click="clickLevel(level)"></survey-tab>'
       +'  <survey-tab level="2" name="Insatisfait" on-click="clickLevel(level)"></survey-tab>'
       +'</div>'
       +'<div class="row">'
       +'  <survey-tab level="3" name="Assez satisfait" on-click="clickLevel(level)"></survey-tab>'
       +'  <survey-tab level="4" name="Satisfait" on-click="clickLevel(level)"></survey-tab>'
       +'</div>'
  }
})

.directive('surveyTab', function(){
  return {
    require: '^^surveyTabs',
    restrict: 'E',
    replace: true,
    scope: {
      level: "@",
      name: "@",
      parentClass: '@',
      click2: '&onClick'
    },
    template: function(element, attrs) {
      return '<div class="col" ng-click="click({level: level})">'
            +'  <button ng-class="{\'ion-checkmark\':selected}" class="icon-left button button-block button-color'+attrs.level+'">'
            +     attrs.name
            +'  </button>'
            +'</div>';
    },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addchoice(scope);
      scope.click = function() {
        tabsCtrl.select(scope);
      }
    }
  }
})

.directive('surveyStars', function(){
  return {
    require: 'ngModel',
    restrict: 'C',
    scope: {
      name: "@"
    },
    template: function(element, attrs) {
      return '<div class="row">'
            +'  <div class="col col-50">'+attrs.name+'</div>'
            +'  <div class="col">'
            +'    <survey-star level=1></survey-star>'
            +'    <survey-star level=2></survey-star>'
            +'    <survey-star level=3></survey-star>'
            +'    <survey-star level=4></survey-star>'
            +'    <survey-star level=5></survey-star>'
            +'  </div>'
            +'</div>';
    },
    link: function(scope, element, attrs, ngModel) {
      scope.$watch('level', function(newValue) {
        ngModel.$setViewValue(newValue);
      });

      scope.$watch(function () {
        return ngModel.$modelValue;
      }, function(newValue) {
        if (scope.level !== newValue) {
          scope.setLevelStar(newValue);
        }
      });

    },
    controller: function($scope) {
      var stars = $scope.stars = [];

      $scope.setLevelStar = function(level) {
        angular.forEach(stars, function(star) {
          if (star.level === level) {
            $scope.select(star);
          }
        });
      }

      $scope.select = function(star) {
        $scope.level = star.level;

        angular.forEach(stars, function(star) {
          star.selected = star.level <= $scope.level;
        });
      };

      this.select = function(star) {
        $scope.select(star);
      };

      this.addStar = function(star) {
        stars.push(star);
      };
    }
  }
})

.directive('surveyStar', function(){
  return {
    require: '^^surveyStars',
    restrict: 'E',
    replace: true,
    scope: {
      level: "@"
    },
    template: function() {
      return '<i class="icon survey-star" ng-class="starclass" ng-click="click({level: level})"></i>';
    },
    link: function(scope, element, attrs, tabsCtrl) {
      scope.starclass='ion-ios-star-outline';
      tabsCtrl.addStar(scope);
      scope.click = function() {
        tabsCtrl.select(scope);
      }
      scope.$watch('selected', function(newValue) {
        if (newValue) {
          scope.starclass='ion-ios-star';
        } else {
          scope.starclass='ion-ios-star-outline';
        }
      })
    }
  }
})

.directive('surveyRanges', function(){
  return {
    require: 'ngModel',
    restrict: 'C',
    scope: {
      name: "@"
    },
    template: function() {
      return '<i class="icon ion-sad-outline"></i>'
            +'<survey-range level= 1></survey-range>'
            +'<survey-range level= 2></survey-range>'
            +'<survey-range level= 3></survey-range>'
            +'<survey-range level= 4></survey-range>'
            +'<survey-range level= 5></survey-range>'
            +'<survey-range level= 6></survey-range>'
            +'<survey-range level= 7></survey-range>'
            +'<survey-range level= 8></survey-range>'
            +'<survey-range level= 9></survey-range>'
            +'<survey-range level=10></survey-range>'
            +'<i class="icon ion-sad-outline"></i>';
    },
    link: function(scope, element, attrs, ngModel) {
      scope.$watch('level', function(newValue) {
        ngModel.$setViewValue(newValue);
      });

      scope.$watch(function () {
        return ngModel.$modelValue;
      }, function(newValue) {
        if (scope.level !== newValue) {
          scope.setLevelStar(newValue);
        }
      });

    },
    controller: function($scope) {
      var ranges = $scope.ranges = [];

      $scope.setLevelStar = function(level) {
        angular.forEach(ranges, function(range) {
          if (range.level === level) {
            $scope.select(range);
          }
        });
      }

      $scope.select = function(range) {
        $scope.level = range.level;

        angular.forEach(ranges, function(range) {
          range.selected = false;
        });
        range.selected = true;
      };

      this.select = function(range) {
        $scope.select(range);
      };

      this.addrange = function(range) {
        ranges.push(range);
      };
    }
  }
})

.directive('surveyRange', function(){
  return {
    require: '^^surveyRanges',
    restrict: 'E',
    replace: true,
    scope: {
      level: "@"
    },
    template: function(element, attrs) {
      return '<span ng-click="click({level: level})" ng-class="{active:selected}">'+attrs.level+'</i>';
    },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addrange(scope);
      scope.click = function() {
        tabsCtrl.select(scope);
      }
    }
  }
})
;
