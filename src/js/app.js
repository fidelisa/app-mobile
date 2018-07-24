angular
  .module('fidelisa', [
    'ionic',
    'ngAnimate',
    'ngResource',
    'ngStorage',
    'ngCordova',
    'ngLocale',
    'ngIOS9UIWebViewPatch',
    'http-auth-interceptor',
    'angular-carousel',
    'ionic-timepicker',
    'ionic-datepicker',
    'gettext',
    'tmh.dynamicLocale',
    'fidelisa-selector'
  ])
  .run(function ($rootScope, AppConfig, $localStorage, $ionicConfig,
    $state, PushNotify, Beacon, Monitoring, Geofence, FDI18n, $window,
    gettextCatalog, FdTools, FdTemplates) {

    if (angular.isUndefined($localStorage.accountId)) {
      $localStorage.accountId = AppConfig.app.accountId;
    }

    if ($localStorage.accountId !== AppConfig.app.accountId) {
      $localStorage.$reset();
    }

    AppConfig.updateStatus($window);


    FDI18n.addEventListener(function () {
      var backText = gettextCatalog.getString('Retour');
      $ionicConfig.backButton.text(backText).icon('ion-chevron-left');
    })

    var defaultLanguage = 'fr';
    if (FdTools.feature("localization").active) {
      defaultLanguage = undefined
    }
    FDI18n.init(defaultLanguage);

    if (angular.isDefined($localStorage.host)) {
      AppConfig.app.host = $localStorage.host;
      AppConfig.host = $localStorage.host;
    }

    document.addEventListener("deviceready", function () {

      if ($window.cordova && $window.cordova.logger) {
        $window.cordova.logger.level($window.cordova.logger.DEBUG);
      }

      if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
        $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        $window.cordova.plugins.Keyboard.disableScroll(true);
      }

      if ($window.StatusBar) {
        if (AppConfig.colors.statusBarDefault) {
          $window.StatusBar.styleDefault();
        } else {
          $window.StatusBar.styleLightContent();
        }
      }

      if ($window.cordova && $window.cordova.InAppBrowser) {
        $window.open = $window.cordova.InAppBrowser.open;
      }

      //TODO: PWA Geoloc
      if (FdTools.feature("geoloc").active) {
        Geofence.start();
      }

      //TODO: PWA beacons
      if (FdTools.feature("beacons").active) {
        Beacon.start();
      }

      Monitoring.start();

    });

    $rootScope.$on('$stateChangeStart', function (e, to) {
      if (to.data && to.data.requiresLogin) {
        if (!$rootScope.logged || $rootScope.loggedPending) {
          e.preventDefault();
          $state.go(AppConfig.subState('home'), {}, {
            reload: true
          });
        }
      }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
      var page = toState.name.split('.');
      page.shift();
      if (page.length > 0) {
        Monitoring.create('Page', page[0]);
      }
    });

    $rootScope.logoName = AppConfig.app.iconId;

    
    PushNotify.start();

    FdTemplates.init();

  });