angular.module('fidelisa').controller('ShopsCtrl', function($scope, AppConfig,
  Shops, $cordovaGeolocation, fidelisaToast, $localStorage, gettextCatalog,
   $window, FdTools, $rootScope, loginService) {

  $scope.showtimes = [];
  $scope.local = undefined;
  $scope.q = "";
  $scope.favoriteShop = loginService.getFavoriteShop();

  if (FdTools.feature("shops").selector) {
    $scope.shopPartial = 'templates/shops/selector.html';
  } else {
    $scope.shopPartial = 'templates/shops/locator.html';
  }

  function trim(myString) {
    return myString.replace(/^\s+/g, '').replace(/\s+$/g, '')
  }

  var updateGeolocation = function() {
    document.addEventListener("deviceready", function() {

      var posOptions = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 15000,
      };

      $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(function(position) {
          $scope.local = position.coords;
        }, function(error) {
          console.error(error);
        });

    });
  }

  var adaptShops = function(shop) {
    updateDistance(shop);
    shop.withSchedule = (shop.schedule && trim(shop.schedule) !== "");
    shop.searchText = shop.title + ':' + shop.address1 + ':' + shop.address2 + ':' + shop.zipcode + ':' + shop.city

    if (shop.withSchedule) {
      shop.scheduleHtml = shop.schedule.textEncode();
    }

  }

  var updateDistance = function updateDistance(shop) {
    if (shop.latitude && shop.longitude && $scope.local) {
      shop.distance = $window.geolib.getDistance({
        latitude: $scope.local.latitude,
        longitude: $scope.local.longitude
      }, {
        latitude: shop.latitude,
        longitude: shop.longitude
      });
    } else {
      shop.distance = 0;
    }
  }

  var update = function() {

    if (FdTools.feature("geoloc").active) {
      updateGeolocation();
    }

    Shops.query({}, function(data) {

      $scope.shops.forEach(function(shop, idx) {
        var find = data.findByUUID(shop.uuid);
        if (angular.isUndefined(find)) {
          $scope.shops.splice(idx, 1);
        }
      });

      data.forEach(function(oneShop) {
        var shop = $scope.shops.findByUUID(oneShop.uuid);

        if (angular.isUndefined(shop)) {
          $scope.shops.push(oneShop);
          shop = oneShop;
        } else {
          angular.merge(shop, oneShop);
        }
        adaptShops(shop);
      });

      $localStorage.shops = data;

      $scope.showtimes = new Array(data.length);

    }, function() {

      var msg = gettextCatalog.getString('Notre application nécessite une connexion réseau pour fonctionner.\n\
        Modifiez vos réglages ou réessayez plus tard');

      fidelisaToast.showShortBottom(msg);

    });
  };

  $scope.shops = $localStorage.shops || AppConfig.vendors || [];
  $scope.shops.forEach(function(shop) { adaptShops(shop); });


  $scope.onRefresh = function() {
    update();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.toggleClock = function(idx) {
    if (idx < $scope.showtimes.length) {
      $scope.showtimes[idx] = !$scope.showtimes[idx];
    }
  };

  $scope.call = function(number) {
    $window.location = "tel:" + number
  }

  $scope.email = function(mail) {
    $window.location = "mailto:" + mail
  }

  $scope.showImage = function(value) {
    return value !== null && angular.isDefined(value);
  }

  $scope.go = function(shop) {

    var url;
    var isApple = $window.ionic.Platform.isIOS() || $window.ionic.Platform.isIPad() || $window.ionic.Platform.is('Macintel');
    $window.ionic.Platform.is('Mac');
    var add = shop.address1 + "+" + shop.address2 + "+" + shop.city + "+" + shop.zipcode;
    add = add.addressEncode();

    if (isApple) {
      url = "maps://maps.apple.com/maps?q=" + add + "&zoom=14";
    } else if ($window.ionic.Platform.isAndroid()) {
      url = "geo:0,0?q=" + add

    } else {
      url = "http://maps.google.com/maps?q=" + add + "&zoom=14"
    }

    if (url) {
      $window.open(url, '_system');
    }

  }

  $scope.$watch('local', function() {
    if ($scope.shops) {
      $scope.shops.forEach(updateDistance);
    }
  });

  update();

  $scope.$on('$$window.ionicView.enter', function() {
    update();
  });

  $scope.metrics = function(data) {
    if (data < 1000) {
      return data;
    } else {
      return (Math.round(data / 10) / 100);
    }
  }

  $scope.metricsUnit = function(data) {
    if (data < 1000) {
      return 'm';
    } else {
      return 'km';
    }
  }

  $scope.displayPhone = function(shop) {
    if (angular.isUndefined(shop.phone)) {
      return '';
    } else if (shop.phone.startsWith('+') || shop.phone.startsWith('00')) {
      return shop.phone;
    } else {
      return shop.display_phone;
    }
  }


  $scope.favoriteToggle = function(shop, noRemote) {

    $scope.shops.forEach(function(shop) {
      shop.favorite = false;
    });

    if (!noRemote) {
      Shops.favorite({ shopId: shop.uuid }, {});
    }
    shop.favorite = true;

    $scope.favoriteShop = shop;

    loginService.setFavoriteShop(shop);

    if ($scope.ShopModal) {
      $scope.ShopModal.remove();
    }
  }

  $scope.$on('$ionicView.enter', function () {
    $scope.favoriteShop = loginService.getFavoriteShop();
  });

  $rootScope.$on('$fidelisa:favoriteShop', function(event, shop) {
    if (angular.isString(shop)) {
      shop = $scope.shops.findByUUID(shop);
    }

    if (angular.isDefined(shop)) {
      $scope.favoriteToggle(shop, true);
    }
  });
});
