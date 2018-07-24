angular
  .module('fidelisa')
  .controller('HappeningsDetailCtrl', function($scope, $rootScope,
    $stateParams, Happenings, AppConfig, $state, gettextCatalog, $window,
    $ionicHistory, $ionicModal, $ionicPopup, loginService, Shops, FdTools,
    FDI18n, Translations) {

    $scope.myown = $state.current.name.split('.')[1].startsWith('my');

    var happeningID = $stateParams.id;

    var update = function() {
      $scope.withLocalization = FdTools.feature("localization").active && FDI18n.getCurrentLanguage() !== 'fr';

      Happenings.get({
        happeningsId: happeningID,
        "with_customers": 't'
      }, function(data) {
        $scope.happening = data;
        $scope.happening.fullDesc = true;
        if ($scope.happening.description) {
          $scope.happening.descEncode = $scope.happening.description.textEncode();
        } else {
          $scope.withLocalization = false;
        }

        var customers = $scope.happening.customers;
        $scope.customerEmpty = angular.isUndefined(customers) || customers.length === 0;
        if ($scope.happening.vendor_id) {
          Shops.get({
            shopId: $scope.happening.vendor_id
          }, function(vendor) {
            $scope.happening["vendor_title"] = vendor.title;
          });
        }
      });
    };

    update();

    var user = loginService.getUser();

    $scope.own = function() {
      return ($scope.happening && $scope.happening.customer && $scope.happening.customer.uuid === user.uuid);
    }

    $scope.getCustomerName = function() {
      if ($scope.happening.customer) {
        return $scope.happening.customer.first_name + ' ' + $scope.happening.customer.last_name ;
      }
    }

    $scope.toggleTranslate = function(msg) {
      msg.showTranslate = !msg.showTranslate;
      if (angular.isUndefined(msg.htmlTr)) {
        Translations.single({
          'tl': FDI18n.getCurrentLanguage(),
          'q': msg.descEncode
        }, function(data) {
          msg.htmlTr = data.translatedText;
        });
      }
    }

    $scope.confirmedCustomers = function() {
      switch ($scope.happening.confirmed_customers) {
        case 0:
          return gettextCatalog.getString('aucun inscrit');
        case 1:
          return gettextCatalog.getString('un inscrit');
        default:
          return $scope.happening.confirmed_customers + ' ' + gettextCatalog.getString('inscrits');
      }
    }

    $scope.availableMessage = function() {
      if ($scope.happening.sold_out) {
        return gettextCatalog.getString('Complet');
      } else if ($scope.happening.quota == 0) {
        return gettextCatalog.getString('Illimité');
      } else {
        return gettextCatalog.getString('{{quota}} participants max.', {
          quota: $scope.happening.quota
        });
      }
    }

    $scope.toggleDesc = function() {
      $scope.happening.fullDesc = !$scope.happening.fullDesc;
      if ($scope.happening.fullDesc) {
        $scope.happening.descEncode = $scope.happening.description.textEncode();
      } else {
        $scope.happening.descEncode = $scope.happening.description;
      }
    }

    $scope.canParticipate = function() {
      if (!$scope.happening) {
        return false;
      }
      return !$scope.happening.sold_out && !$scope.happening.confirmed
    }

    $scope.participate = function(participateValue) {
      $rootScope.activeCategory.follow = true;
      Happenings.update({
        happeningsId: $scope.happening.uuid
      }, {
        happening: {
          confirmed: participateValue
        }
      }, function(data) {
        $scope.happening = data;
        //$ionicHistory.goBack();
      }, function(error) {
        console.error(error);
      });
    }

    $scope.addToCalendar = function() {
      var startDate = $scope.happening.started_at;
      var endDate = new Date(startDate.getTime() + $scope.happening.duration * 60000);
      var title = $scope.happening.title;
      var eventLocation = '';

      var notes = $scope.happening.description;

      if ($window.plugins && $window.plugins.calendar) {
        $window.plugins.calendar.createEventInteractively(title, eventLocation, notes, startDate, endDate);
      } else {
        console.info(title, eventLocation, notes, startDate, endDate);
      }
    }

    $scope.showParticipants = function() {

      var dest = $scope.myown ? AppConfig.subState('myhappenings_detail_participants') : AppConfig.subState('happenings_detail_participants');
      $state.go(dest, {
        id: $scope.happening.uuid
      });


    }

    $scope.modifyHappening = function() {
      $ionicModal.fromTemplateUrl('templates/happenings/new.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modalHappening = modal;
        $scope.modalHappening.show();
      });
    }

    $scope.askDelete = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: gettextCatalog.getString('Suppression'),
        template: gettextCatalog.getString('Supprimer cet événement ?'),
        cancelText: gettextCatalog.getString('Annuler'),
        cancelType: 'confirm-btn',
        okText: gettextCatalog.getString('Supprimer'),
        okType: 'confirm-btn'
      });

      confirmPopup.then(function(res) {
        if (res) {
          $scope.deleteHappening();
        }
      });
    };

    $scope.deleteHappening = function() {
      Happenings.delete({
          happeningsId: happeningID
        }, function() {
          $ionicHistory.goBack();
        });
    };


  });
