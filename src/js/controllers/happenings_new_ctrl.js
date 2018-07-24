angular
  .module('fidelisa')
  .controller('HappeningsNewCtrl', function($scope, $rootScope,
    FDI18n, Shops, loginService, gettextCatalog,
    Happenings, AppConfig, fidelisaToast, HappeningsCategories,
    Places, fidelisaSelector) {

    $scope.user = loginService.getUser();
    $scope.numbers = new Array(20);

    var N = 10;
    $scope.people = Array.apply(null, {length: N}).map(Number.call, Number)
    $scope.people[0] = gettextCatalog.getString('Illimité');

    $scope.quotaList = [
      { uuid: 0, title: gettextCatalog.getString('Illimité') }
    ];

    $scope.quotaLabel = gettextCatalog.getString('Nombre de participants');
    $scope.shopLabel = $scope.getTitleString('shops');


    for (var i = 1; i <= 10; i++) {
      $scope.quotaList.push({ uuid: i, title: ""+i });
    }

    if (angular.isUndefined($scope.happening)) {
      $scope.title = gettextCatalog.getString('Création')
      $scope.happening = {
        active: true,
        "tag_ids": []
      };
    } else {
      $scope.title = gettextCatalog.getString('Modification')
    }

    if (angular.isUndefined($scope.happening.tag_ids)) {
      $scope.happening["tag_ids"] = [];
    }

    if (angular.isDefined($scope.happening.quota)) {
      $scope.happening.quota = $scope.happening.quota.toString();
    }


    $scope.canCreateHappening = true;

    function update() {

      Shops.all({}, function(data) {
        $scope.shops = data;
        if ($scope.shops && $scope.shops.length === 1
          && angular.isUndefined($scope.happening["vendor_id"])) {
          $scope.happening["vendor_id"] = $scope.shops[0].uuid;
        }
      }, function(error) {
        console.error(error);
      });

      HappeningsCategories.query({}, function(data) {
        $scope.categories = data;
        if ($scope.categories && $scope.categories.length > 0) {
          if ($rootScope.activeCategory) {
            $scope.categories.forEach(function(category) {
              if ($rootScope.activeCategory.uuid === category.uuid) {
                $scope.happening["happenings_category_id"] = $rootScope.activeCategory.uuid;
              }
            })
          }
          if (angular.isUndefined($scope.happening["happenings_category_id"])) {
            $scope.happening["happenings_category_id"] = $scope.categories[0].uuid;
          }
        }
      }, function(error) {
        console.error(error);
      });

      Places.query({}, function(data) {
        $scope.places = data;
        if ($scope.places && $scope.places.length > 0) {
          $scope.happening["place_id"] = $scope.places[0].uuid;
        }
      }, function(error) {
        console.error(error);
      });
    }

    update();

    // $scope.$on('$fidelisa:reloadNew', function() {
    //   update();
    // });

    $scope.selectShop = function() {
        var selectorObj = {
          titleLabel: gettextCatalog.getString('Lieux'),
          setLabel:  gettextCatalog.getString('OK'),
          closeLabel:  gettextCatalog.getString('Annuler'),
          multi: false,
          selectedElements: [$scope.happening["vendor_id"]],
          elements: $scope.shops,
          callback: function(data) {
            if (data.length>0) {
              $scope.happening["vendor_id"] = data[0];
            }
          },
          popupCss: 'fd-popup'
        };

        fidelisaSelector.openFidelisaSelector(selectorObj);
    }

    $scope.doHappening = function() {
      if (angular.isDefined($scope.happening.uuid)) {

        Happenings.update({
          accountId: AppConfig.accountId,
          happeningsId: $scope.happening.uuid
        }, {
          happening: $scope.happening
        }, function() {
          fidelisaToast.showShortBottom(gettextCatalog.getString('Votre demande a été enregistrée.'));
          $scope.modalHappening.hide();
          $rootScope.$broadcast('$fidelisa:reloadHappenings');
        }, function() {
            fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue.'));
        });
      } else {
        Happenings.create({
          accountId: AppConfig.accountId
        }, {
          happening: $scope.happening
        }, function() {
          fidelisaToast.showShortBottom(gettextCatalog.getString('Votre demande a été enregistrée.'));
          $scope.modalHappening.hide();
          $rootScope.$broadcast('$fidelisa:reloadHappenings');
        }, function() {
            fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue.'));
        });
      }
    }

    $scope.closeNewModal = function() {
      $scope.modalHappening.hide();
    }


  });
