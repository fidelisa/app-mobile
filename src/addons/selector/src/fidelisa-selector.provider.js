angular.module('fidelisa-selector.provider', [])

  .provider('fidelisaSelector', function () {

    var config = {
      titleLabel: null,
      setLabel: 'Set',
      closeLabel: 'Close',

      templateType: 'popup',
      closeOnSelect: false,

      search: false,

      multi: true,
      selectedElements: [],
      elements: [],
      multiCheckIcon: 'ion-ios-circle-filled',
      mutliUncheckIcon: 'ion-ios-circle-outline',
      monoCheckIcon: 'ion-ios-checkmark-outline',
      monoUncheckIcon: '',

      popupCss: ''

    };

    this.configFidelisaSelector = function (inputObj) {
      angular.extend(config, inputObj);
    };

    this.$get = ['$rootScope', '$ionicPopup', '$ionicModal', '$window', '$timeout',
    function ($rootScope, $ionicPopup, $ionicModal, $window, $timeout) {

      var $scope = $rootScope.$new();

      $scope.searchHasFocus = false;

      var isSelected = function(idx) {
        if (angular.isDefined(idx)) {
          return $scope.selectedElements.indexOf(idx);
        }
        return -1;
      }

      $scope.buttonStyle = function(el) {
        if (angular.isUndefined(el)) {
          return "";
        }

        if ($scope.multi) {
          if (isSelected(el.uuid) > -1) { return $scope.mainObj.multiCheckIcon; }
          else { return $scope.mainObj.mutliUncheckIcon; }
        } else {
          if (isSelected(el.uuid) > -1) { return $scope.mainObj.monoCheckIcon; }
          else { return $scope.mainObj.monoUncheckIcon; }
        }
      }

      $scope.pickID = function(elID) {
        if (!$scope.multi) {
          $scope.selectedElements = [];
        }
        if (angular.isDefined(elID)) {
          var index = isSelected(elID);
          if (index > -1) {
              $scope.selectedElements.splice(index, 1);
          } else {
              $scope.selectedElements.push(elID);
          }
        }

        if ($scope.mainObj.closeOnSelect) {
          if ($scope.mainObj.closeOnSelect) {
            $scope.mainObj.callback($scope.selectedElements);
            if ($scope.mainObj.templateType.toLowerCase() == 'popup') {
              $scope.popup.close();
            } else {
              closeModal();
            }
          }
        }
      }

      var provider = {};

      //Setting up the initial object
      function setInitialObj(ipObj) {
        $scope.mainObj = angular.copy(ipObj);
        $scope.selectedElements = [].concat(ipObj.selectedElements);
        $scope.elements = [].concat(ipObj.elements);
        $scope.multi = $scope.mainObj.multi ;
        $scope.search = $scope.mainObj.search ;
      }

      $ionicModal.fromTemplateUrl('fidelisa-selector-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });

      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });

      function openModal() {
        $scope.modal.show();
      }

      function closeModal() {
        $scope.modal.hide();
      }

      $scope.closeFidelisaSelector = function closeFidelisaSelector() {
        closeModal();
      };

      var focusedElement;

      $scope.searchFocus = function searchFocus($event) {
        console.log("focus");
        $scope.searchHasFocus = true;
      }

      $scope.searchBlur = function searchBlur($event) {
        console.log("blur");
        $timeout(function() {
            $scope.searchHasFocus = false;
        }, 500); // timeout avoid keyboard re-opening
      }

      //Open selector
      provider.openFidelisaSelector = function (ipObj) {
        var buttons = [];

        $scope.mainObj = angular.extend({}, config, ipObj);

        setInitialObj($scope.mainObj);

        if (!$scope.mainObj.closeOnSelect) {
          buttons = [{
            text: $scope.mainObj.setLabel,
            type: 'button_set',
            onTap: function (e) {
              $scope.mainObj.callback($scope.selectedElements);
            }
          }];
        }

        buttons.push({
          text: $scope.mainObj.closeLabel,
          type: 'button_close'
        });

        if ($scope.mainObj.templateType.toLowerCase() == 'popup') {
          $scope.popup = $ionicPopup.show({
            title: $scope.mainObj.titleLabel,
            templateUrl: 'fidelisa-selector-popup.html',
            scope: $scope,
            cssClass: $scope.mainObj.popupCss,
            buttons: buttons
          });
        } else {
          openModal();
        }
      };

      return provider;

    }];

  });
