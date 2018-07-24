angular.module('fidelisa')

.directive('fdDatePicker', function(FDI18n){
  return {
    require: 'ngModel',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      model: "=ngModel",
      customLabel: "@label"
    },

    link: function(scope, element, attrs, ngModel) {

      scope.$watch(function () {
        return ngModel.$modelValue;
      }, function(newValue) {
        if (newValue && newValue !== scope.date) {
          scope.date = newValue;
          scope.dateOK = true;
        }
      });
    },

    templateUrl: function() {
      return 'templates/pickers/date.html';
    },

    controller: function($scope, ionicDatePicker, loginService, Shops, gettextCatalog) {
      var disabledDates = [];

      $scope.date = new Date();
      $scope.date.setHours(12);
      $scope.date.setMinutes(0);

      $scope.dateOK = false;

      var datePickerCallback = function(val) {
        if (angular.isDefined(val)) {
          var dd = new Date(val);
          //conserve hours
          var dModel = $scope.model || $scope.date;
          dModel.setMonth(dd.getMonth()); //months from 1-12
          dModel.setDate(dd.getDate());
          dModel.setFullYear(dd.getFullYear());
          $scope.model = dModel;

          $scope.dateOK = true;
          $scope.date = dModel;

        }
      };

      $scope.openPicker = function() {

        var datePickerObj = {
          titleLabel: gettextCatalog.getString('Date'), //Optional
          todayLabel: '_', //Optional
          closeLabel: gettextCatalog.getString('Annuler'), //Optional
          setLabel: gettextCatalog.getString('OK'), //Optional
          setButtonType: 'button-block', //Optional
          todayButtonType: 'button-hide', //Optional
          closeButtonType: 'button-block', //Optional
          inputDate: $scope.date, //Optional
          mondayFirst: FDI18n.mondayFirst(), //Optional
          disabledDates: disabledDates, //Optional
          weeksList: FDI18n.weeksList(), //Optional
          monthsList: FDI18n.monthsList(), //Optional
          templateType: 'popup', //Optional
          showTodayButton: false, //Optional
          modalHeaderColor: 'bar-positive', //Optional
          modalFooterColor: 'bar-positive', //Optional
          // from: new Date(2012, 8, 2), //Optional
          // to: new Date(2018, 8, 25),  //Optional
          callback: datePickerCallback,
          dateFormat: FDI18n.shortDateFormat(), //Optional
          closeOnSelect: false, //Optional
        };

        ionicDatePicker.openDatePicker(datePickerObj);
      }
    }
  }
})

.directive('fdTimePicker', function(){

  return {
    require: 'ngModel',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      model: "=ngModel",
      customLabel: "@label",
      duration: '@'
    },

    link: function(scope, element, attrs, ngModel) {
      if (angular.isDefined(attrs.duration)) {
        scope.date = 60;
      } else {
        scope.date = new Date();
        scope.date.setHours(12);
        scope.date.setMinutes(0);
      }
      scope.dateOK = false;
      scope.showMin = angular.isDefined(attrs.duration);


      scope.$watch(function () {
        return ngModel.$modelValue;
      }, function(newValue) {
        if (newValue && newValue !== scope.date) {
          scope.date = newValue;
          scope.dateOK = true;
        }
      });
    },

    templateUrl: function() {
      return 'templates/pickers/time.html';
    },

    controller: function($scope, ionicTimePicker, gettextCatalog) {

      var timePickerCallback = function(val) {
        if (angular.isDefined(val)) {
          if (angular.isDefined($scope.duration)) {
            $scope.model = val / 60;
            $scope.date = val / 60;

          } else {
            var dd = new Date(val * 1000);
            var dModel = $scope.model || new Date();
            dModel.setHours(dd.getUTCHours());
            dModel.setMinutes(dd.getUTCMinutes());

            $scope.model = dModel;
            $scope.date = dModel;
          }

          $scope.dateOK = true;
        }
      };

      $scope.openPicker = function() {
        var date;
        if (angular.isDefined($scope.duration)) {
          date = $scope.date * 60;
        } else {
          date = ($scope.date.getHours() * 60 + $scope.date.getMinutes()) * 60;
        }


        var ipObj1 = {
          titleLabel: gettextCatalog.getString('Date'), //Optional
          callback: timePickerCallback,
          inputTime: date,
          format: 24,
          step: 15,
          closeLabel: gettextCatalog.getString('Annuler'),
          setLabel: gettextCatalog.getString('OK')
        };

        ionicTimePicker.openTimePicker(ipObj1);
      }
    }
  }


});
