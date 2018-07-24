angular
  .module('fidelisa')
  .controller('AppointmentScheduleCtrl', function($scope, $rootScope, Plannings, ionicDatePicker,
    FDI18n, gettextCatalog) {

    $scope.$watch('datepicker', function() {
      if (angular.isDefined($scope.appointment.planning_id)) {
        Plannings.available({
          planningId: $scope.appointment.planning_id,
          date: $scope.datepicker,
          period: "Day"
        }, function(data) {
          $scope.availables = data;
        })
      }
    });

    $scope.$on('$fidelisa:reloadSchedule', function() {
      $scope.appointment["scheduled_at"] = undefined;
      $scope.datepicker = new Date();
    });

    $scope.select = function(value) {
      $scope.appointment["scheduled_at"] = value.date;
      $scope.appointment.timezone = value.timezone;
      $scope.modalSchedule.hide();
    }

    $scope.closeSchedule = function() {
      $scope.modalSchedule.hide();
    }

    var datePickerScheduleCallback = function(val) {
      if ( angular.isDefined(val) ) {
        $scope.datepicker = val;
      }
    };

    $scope.nextDate = function() {
      $scope.datepicker = $scope.datepicker.addDays(1);
    };

    $scope.previousDate = function() {
      $scope.datepicker = $scope.datepicker.addDays(-1);
    };

    var disabledDates = [];

    $scope.openPicker = function() {

      var datePickerObj = {
        titleLabel: gettextCatalog.getString('Date'), //Optional
        todayLabel: '_', //Optional
        closeLabel: gettextCatalog.getString('Annuler'), //Optional
        setLabel: gettextCatalog.getString('OK'), //Optional
        setButtonType: 'button-block', //Optional
        todayButtonType: 'button-hide', //Optional
        closeButtonType: 'button-block', //Optional
        inputDate: new Date(), //Optional
        mondayFirst: FDI18n.mondayFirst(), //Optional
        disabledDates: disabledDates, //Optional
        weeksList: FDI18n.weeksList(), //Optional
        monthsList: FDI18n.monthsList()  , //Optional
        templateType: 'popup', //Optional
        showTodayButton: false, //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        from: new Date(2012, 8, 2), //Optional
        to: new Date(2018, 8, 25), //Optional
        callback: function(val) { //Mandatory
          datePickerScheduleCallback(val);
        },
        dateFormat: FDI18n.shortDateFormat(), //Optional
        closeOnSelect: false, //Optional
      };

      ionicDatePicker.openDatePicker(datePickerObj);
    }




  });
