angular
  .module('fidelisa')
  .controller('HappeningsCtrl', function ($scope, $rootScope,
    $stateParams, Happenings, AppConfig, $state, gettextCatalog,
    $window, $ionicModal, FdTools, FDI18n, ionicDatePicker,
    $ionicPopup, fidelisaSelector, Tags, Shops, loginService) {

    $scope.myown = $state.current.name.split('.')[1].startsWith('my');
    $scope.showOwns = $scope.myown;

    $scope.happeningEmpty = false;
    $scope.multi = true;

    $scope.emptyFilter = function () {
      $scope.selectedTags = [];
      $scope.selectedDate = undefined;
      $scope.selectedPlaces = [];
      $scope.selectedVendors = [];
    }

    $scope.emptyFilter();

    var categoryID = $stateParams.id;
    $scope.listHappenings = [];

    function checkHappening() {
      return $rootScope.logged && FdTools.featureOptions("happenings").user_managed;
    }

    $scope.allowAddHappening = checkHappening();
    
    $rootScope.$watch('logged', function () {
      $scope.allowAddHappening = checkHappening();
    })

    $scope.onRefresh = function () {
      update();
      $scope.$broadcast('scroll.refreshComplete');
    };


    var tagFeature = FdTools.feature("tags");
    var tagOptions = tagFeature.tags || {};
    $scope.allowTags = tagFeature.active && (tagOptions["happenings"] !== '');

    $scope.allowShops = !FdTools.featureOptions("happenings").isolationVendor;

    function getVendors() {
      var ret;
      if ( !$scope.allowShops ) {
        var favoriteVendor = loginService.getFavoriteShop();
        if (favoriteVendor) {
          ret = favoriteVendor.uuid;
        } else {
          ret = '';
        }
      } else {
        ret = $scope.selectedVendors.join(',');
      }
      console.log(ret);
      return ret;
    }

    var update = function () {
      Happenings.query({
        "happenings_category": categoryID,
        "date": $scope.selectedDate,
        "places": $scope.selectedPlaces.join(','),
        "tags": $scope.selectedTags.join(','),
        "vendors": getVendors(),
        "with_customers": 't'
      }, function (data) {
        $scope.happeningEmpty = (data.length === 0);
        $scope.listHappenings = data;
        data.forEach(function (happening) {
          happening.fullDesc = false;
          happening.descEncode = happening.description;
          if (happening.vendor_id) {
            Shops.get({
              shopId: happening.vendor_id
            }, function (vendor) {
              happening["vendor_title"] = vendor.title;
            });
          }
        });
      });
    }

    $scope.tagName = FDI18n.getFeatureOptionsTitle('tags');

    FDI18n.addEventListener(function () {
      $scope.tagName = FDI18n.getFeatureOptionsTitle('tags');
    });

    if ($scope.myown) {
      $scope.title = $scope.getTitleString('myhappenings');

      FDI18n.addEventListener(function () {
        $scope.title = $scope.getTitleString('myhappenings');
      });
    } else if ($rootScope.activeCategory) {
     $scope.title = $rootScope.activeCategory.title;
    }

    $scope.allowSearch = true;

    if (!$scope.myown) {
      $rootScope.$watch('happeningsCategory', function (newValue) {
        if (newValue) {
          categoryID = newValue;
          update()
        }
      });
    }

    $scope.toggleDesc = function (happening) {
      happening.fullDesc = !happening.fullDesc;
      if (happening.fullDesc) {
        happening.descEncode = happening.description.textEncode();
      } else {
        happening.descEncode = happening.description;
      }
    }



    $scope.availableMessage = function (happening) {
      if (happening.sold_out) {
        return gettextCatalog.getString('Complet');
      } else if (happening.quota == 0) {
        return gettextCatalog.getString('Illimité');
      } else {
        return gettextCatalog.getString('{{quota}} participants maximum', {
          quota: happening.quota
        });
      }
    }

    $scope.canParticipate = function (happening) {
      return !happening.sold_out && !happening.confirmed
    }

    $scope.participate = function (idx, participateValue) {
      $rootScope.activeCategory.follow = true;
      Happenings.update({
        accountId: AppConfig.accountId,
        happeningsId: $scope.listHappenings[idx].uuid
      }, {
        happening: {
          confirmed: participateValue
        }
      }, function (data) {
        $scope.listHappenings[idx] = data;
      }, function (error) {
        console.error(error);
      });
    }

    $scope.onHappeningClick = function (happening) {
      var dest = $scope.myown ? AppConfig.subState('myhappenings_detail') : AppConfig.subState('happenings_detail');
      $state.go(dest, {
        id: happening.uuid
      });
    }


    $scope.selectCreate = function () {
      $scope.showOwns = true;
      categoryID = 'owns';
      update();
    }

    $scope.selectParticipants = function () {
      $scope.showOwns = false;
      categoryID = 'my';
      update();
    }

    $scope.selectDate = function () {
      var date = $scope.selectedDate;
      if (angular.isUndefined(date)) {
        date = new Date();
      }

      var datePickerObj = {
        titleLabel: gettextCatalog.getString('Date'), //Optional
        todayLabel: '_', //Optional
        closeLabel: gettextCatalog.getString('Annuler'), //Optional
        setLabel: gettextCatalog.getString('OK'), //Optional
        setButtonType: 'button-block', //Optional
        todayButtonType: 'button-hide', //Optional
        closeButtonType: 'button-block', //Optional
        inputDate: date,
        mondayFirst: FDI18n.mondayFirst(), //Optional
        weeksList: FDI18n.weeksList(), //Optional
        monthsList: FDI18n.monthsList(), //Optional
        templateType: 'popup', //Optional
        showTodayButton: false, //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        callback: function (val) {
          if (angular.isDefined(val)) {
            var dd = new Date(val);
            var date = new Date(); // timezone
            date.setMonth(dd.getMonth()); //months from 1-12
            date.setDate(dd.getDate());
            date.setFullYear(dd.getFullYear());
            $scope.selectedDate = date;
          } else {
            $scope.selectedDate = undefined;
          }
        },
        dateFormat: FDI18n.shortDateFormat(), //Optional
        closeOnSelect: false, //Optional
      };

      ionicDatePicker.openDatePicker(datePickerObj);
    }

    var tags = [];
    Tags.query({}, function (data) {
      tags = data;
    });

    $scope.selectTag = function () {
      var selectorObj = {
        titleLabel: FDI18n.getFeatureOptionsTitle('tags'),
        setLabel: gettextCatalog.getString('OK'),
        closeLabel: gettextCatalog.getString('Annuler'),
        selectedElements: $scope.selectedTags,
        elements: tags.fdTranslateArray(),
        callback: function (data) {
          $scope.selectedTags = data;
        },
        popupCss: 'fd-popup'
      };

      fidelisaSelector.openFidelisaSelector(selectorObj);
    }


    $scope.selectShop = function (callback) {

      Shops.query({}, function (shops) {
        var selectorObj = {
          titleLabel: gettextCatalog.getString('Lieux'),
          setLabel: gettextCatalog.getString('OK'),
          closeLabel: gettextCatalog.getString('Annuler'),
          selectedElements: $scope.selectedVendors,
          elements: shops,
          callback: function (data) {
            if (angular.isUndefined(callback)) {
              $scope.selectedVendors = data;
            } else {
              callback(shops.findByUUID(data[0]));
            }
          },
          popupCss: 'fd-popup'
        };

        fidelisaSelector.openFidelisaSelector(selectorObj);

      });
    }


    $scope.selectPlace = function () {
      $scope.popup = $ionicPopup.show({
        title: gettextCatalog.getString('Lieux'),
        templateUrl: 'templates/places/popup.html',
        scope: $scope,
        cssClass: 'fd-popup fd-places-popup',
        buttons: [{
            text: 'OK'
          },
          {
            text: 'Annuler'
          }
        ]
      }).then(function () {
        update();
      });
    }

    $scope.$watchGroup(['selectedVendors', 'selectedPlaces', 'selectedTags', 'selectedDate'], function () {
      update();
    })

    $scope.addToCalendar = function (happening) {
      var startDate = happening.started_at;
      var endDate = new Date(startDate.getTime() + happening.duration * 60000);
      var title = happening.title;
      var eventLocation = '';

      var notes = happening.description;

      if ($window.plugins && $window.plugins.calendar) {
        $window.plugins.calendar.createEventInteractively(title, eventLocation, notes, startDate, endDate);
      } else {
        console.info(title, eventLocation, notes, startDate, endDate);
      }
    }


    $scope.addHappening = function () {
      $ionicModal.fromTemplateUrl('templates/happenings/new.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modalHappening = modal;
        $scope.modalHappening.show();

      });
    }


    $scope.$on('$ionicView.enter', function () {
      update();
    });

    $scope.$watch('categories', function () {
      update();
    });

    $rootScope.$on('$fidelisa:reloadHappenings', function () {
      update();
    });

  });
