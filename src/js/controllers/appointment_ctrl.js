angular
  .module('fidelisa')
  .controller('AppointmentCtrl', function($scope, $rootScope,
    $stateParams, $state, AppConfig, Appointments, fidelisaToast, $ionicModal,
    gettextCatalog, User, $window) {

    $scope.shops = [];
    $scope.plannings = [];

    if (angular.isDefined($stateParams.user)) {
      User.check({login: $stateParams.user});
    }

    var update = function() {
      $scope.appointments = {};
      Appointments.query({}, function(data) {
        $scope.appointments = data;
      });
    };

    $scope.onRefresh = function() {
      update();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.$on('$ionicView.enter', function() {
      update();
    });

    $scope.$on('event:auth-loginConfirmed', function() {
      update();
    });

    $scope.$on('event:auth-loginCancelled', function() {
      update();
    });

    $ionicModal.fromTemplateUrl('templates/appointment/new.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.new = function() {
      $scope.$broadcast('$fidelisa:reloadNew');
      $scope.modal.show();
    }

    $scope.$on('modal.hidden', function() {
      update();
    });

    $scope.cancelAppointment = function(appointmentId) {
      Appointments.update({
        accountId: AppConfig.accountId,
        appointmentId: appointmentId
      }, {
        appointment: {
          "canceled_at": new Date()
        }
      }, function() {
        fidelisaToast.showShortBottom(
          gettextCatalog.getString('Votre demande a été enregistrée.'));
        update();
      }, function(error) {
        console.error(error);
        fidelisaToast.showShortBottom(
          gettextCatalog.getString('Une erreur est survenue.'));
      });
    }

    $scope.addToCalendar = function(appointment) {
      var startDate = appointment.scheduled_at;
      var endDate = new Date( startDate.getTime() + appointment.duration * 60000);
      var title = appointment.planning.vendor.title;
      if (appointment.planning_title !== "") {
        title += " - " + appointment.planning_title;
      }
      var eventLocation = appointment.planning.vendor.full_address;
      var notes = appointment.notes;

      if ($window.plugins && $window.plugins.calendar) {
        var success = function() {
          appointment.calendar = true;
          Appointments.update({
            accountId: AppConfig.accountId,
            appointmentId: appointment.uuid
          }, {
            appointment: {
              calendar: true
            }
          });
        };

        $window.plugins.calendar.createEventInteractively(title, eventLocation, notes, startDate, endDate, success);
      }
    }

  });
