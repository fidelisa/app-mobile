angular
  .module('fidelisa')
  .controller('AppointmentNewCtrl', function($scope, $rootScope, loginService, Shops, Appointments, AppConfig,
    fidelisaToast, $ionicModal, gettextCatalog) {

    $scope.user = loginService.getUser();
    $scope.numbers = new Array(20);

    function update() {
      $scope.appointment = {
        "guest_number": '1',
        "scheduled_at": ""
      };

      Shops.all({
        "with_planning": true
      }, function(data) {

        $scope.shops = data;
        if ($scope.shops && $scope.shops.length > 0) {
          $scope.appointment["vendor_id"] = $scope.shops[0].uuid;
        }
      }, function(error) {
        console.error(error);
      });
    }

    update();

    $scope.$on('$fidelisa:reloadNew', function() {
      update();
    });

    function findShop(id) {
      return $scope.shops.findByUUID(id);
    }

    $scope.planningsWithShopId = function(shopId) {
      var shop = findShop(shopId);
      if (shop) {
        return shop.plannings;
      } else {
        return [];
      }
    }

    $scope.findPlanning = function(shopId, id) {
      var shopPlannings = $scope.planningsWithShopId(shopId);
      if (shopPlannings) {
        return shopPlannings.findByUUID(id);
      } else {
        return [];
      }
    }

    $scope.$watch('appointment.vendor_id', function(newValue) {
      $scope.appointment["planning_id"] = undefined;
      if (angular.isDefined(newValue)) {
        var currentVendor = findShop(newValue);
        if (currentVendor) {
          $scope.plannings = currentVendor.plannings;
          if ($scope.plannings && $scope.plannings.length > 0) {
            $scope.appointment["planning_id"] = $scope.plannings[0].uuid;
          }
        }
      }
    });


    $scope.$watch('appointment.planning_id', function(newValue) {
      if (angular.isDefined(newValue)) {
        var planning = $scope.findPlanning($scope.appointment.vendor_id, newValue);

        if (planning) {
          $scope.planningMode = planning.mode;
          $scope.planningTz = planning.timezone;
          switch (planning.mode) {
            case 'Appointment':
              $scope.newTitle = gettextCatalog.getString('Rendez-vous');
              break;
            case 'Booking':
              $scope.newTitle = gettextCatalog.getString('Réservation');
              break;
            default:
              $scope.newTitle = '';
              break;
          }
        }
      }
    })

    $scope.doAppointment = function() {
      Appointments.create({
        accountId: AppConfig.accountId
      }, {
        appointment: $scope.appointment
      }, function() {
        fidelisaToast.showShortBottom(gettextCatalog.getString('Votre demande a été enregistrée.'));
        $scope.modal.hide();
      }, function(error) {
        if (error.data && error.data.scheduled_at) {
          fidelisaToast.showShortBottom(error.data.scheduled_at[0]);
        } else {
          fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue.'));
        }
      });
    }

    $scope.cancel = function() {
      $scope.modal.hide();
    }

    $ionicModal.fromTemplateUrl('templates/appointment/schedule.html', {
      scope: $scope,
      animation: 'slide-in-left-right'
    }).then(function(modal) {
      $scope.modalSchedule = modal;
    });

    $scope.scheduleSelect = function() {
      $scope.$broadcast('$fidelisa:reloadSchedule');
      $scope.modalSchedule.show();
    }

  });
