angular.module('fidelisa')

  .controller('MenuCtrl', function ($scope, $rootScope, $filter, loginService,
    AppConfig, $ionicModal, $state, $stateParams, User, $ionicNavBarDelegate,
    Messages, Cards, $localStorage, $ionicTabsDelegate, $ionicSideMenuDelegate,
    Customers, $window, FdTools, FDModals, FDI18n, gettextCatalog, FDLinks) {

    if ($stateParams.locale) {
      FDI18n.setCurrentLanguage($stateParams.locale);
    }

    $rootScope.listStyle = AppConfig.styles.list || "list card";

    $rootScope.avatarColor = AppConfig.colors.button.color;
    $rootScope.avatarBgColor = AppConfig.colors.button.bgColor;

    $scope.accountId = AppConfig.accountId;
    $scope.tabs = AppConfig.menus;
    $scope.host = AppConfig.host;

    $scope.tabsSort = [];

    var cpt = 0;
    var withMore = FdTools.numberOfMenus() > AppConfig.menus.limit;

    AppConfig.menus.sort.forEach(function (tab) {
      $scope.tabsSort.push(tab.toLowerCase());
      var mnu = AppConfig.menus[tab.toLowerCase()]
      if (mnu) {
        if (mnu.enable) {
          cpt++;
        }
        mnu.more = (withMore && cpt >= AppConfig.menus.limit);
        mnu.link = 'state:' + AppConfig.subState(tab.toLowerCase());
      }
    })
    if (withMore) {
      $scope.tabsSort.push('more');
    }

    $scope.tabs.messages.count = 0;

    $scope.headtitle = AppConfig.app.title;
    $scope.withImageTitle = (AppConfig.app.imageTitle && AppConfig.app.imageTitle !== "");
    
    // On device local image and on preview url (FIX cache issue)
    $scope.imageTitleUrl = AppConfig.app.imageTitle;
    document.addEventListener("deviceready", function () {
      $scope.imageTitleUrl = 'img/title.png';
    });

    $scope.showMore = function () {
      return withMore;
    }

    $scope.hideTab = function (tab) {
      var mnu = AppConfig.menus[tab];
      var hide = (!mnu || mnu.more || !mnu.enable);
      return hide;
    }

    $rootScope.getTitleString = function (name) {
      return FDI18n.getTitleString(name);
    }

    $scope.secureDate = function (date, format, timezone) {
      if (angular.isString(date)) {
        var re = /([0-9]{4}).([0-9]{2}).([0-9]{2}).([0-9]{2}).([0-9]{2}).([0-9]{2})/gm
        var ta = re.exec(date)
        if (ta) {
          date = Date.UTC(ta[1], ta[2] - 1, ta[3], ta[4], ta[5], ta[6]);
        }
      }

      return $filter('date')(date, format, timezone);
    }

    $scope.dateAgo = function (time) {

      if (angular.isUndefined(time) || time === null) {
        return "";
      }
      var date = time;

      if (angular.isString(time)) {
        date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ").replace(/\.000/, ""));
      }

      var dateUTC = date.getTime() - date.getTimezoneOffset() * 60 * 1000;
      var newDate = new Date().getTime();

      var diff = (newDate - dateUTC) / 1000;
      var dayDiff = Math.floor(diff / 86400);

      if (dayDiff < 0 && dayDiff > -5) {
        dayDiff = 0;
      }

      if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
        return $filter('date')(date, 'longDate');
      }

      if (dayDiff == 1) {
        return "hier";
      }

      var val = dayDiff == 0 && (
          diff < 60 && gettextCatalog.getString('maintenant') ||
          diff < 120 && gettextCatalog.getString('Il y a 1 minute') ||
          diff < 3600 && gettextCatalog.getString('Il y a {{m}} minutes', {
            m: Math.floor(diff / 60)
          }) ||
          diff < 7200 && gettextCatalog.getString('Il y a 1 heure') ||
          diff < 86400 && gettextCatalog.getString('Il y a {{h}} heures', {
            h: Math.floor(diff / 3600)
          })
        ) ||
        dayDiff < 7 && gettextCatalog.getString('Il y a {{d}} jours', {
          d: dayDiff
        }) ||
        dayDiff < 31 && gettextCatalog.getString('Il y a {{w}} semaines', {
          w: Math.ceil(dayDiff / 7)
        })

      return val;
    }
    

    $scope.GotoLink = FDLinks.gotoLink; //open GotoLink

    $scope.onMenuTabClick = function (name) {      
      FDLinks.followName(name);
    }

    $scope.onMenuSideClick = function (name) {
      $ionicSideMenuDelegate.toggleLeft();
      FDLinks.followName(name);
    };

    $ionicModal.fromTemplateUrl('templates/game.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
      })
      .then(function (modal) {
        $scope.gameModal = modal;
      });

    $scope.$on('$destroy', function () {
      $scope.gameModal.remove();
    });

    var avoidLoopName;

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      var name = toState.name;
      if (name.contains('web') && name !== avoidLoopName) {
        avoidLoopName = name;
        name = name.substring(4);
        $scope.onMenuSideClick(name);
        event.preventDefault();
      }

    });


    var unregisterOnMessage = $rootScope.$on('messages.update', function (targetScope, currentScope) {
      if ($rootScope.logged) {
        if (currentScope.reduce) {
          $scope.tabs.messages.count -= 1;
        } else {
          Messages.count({
            accountId: AppConfig.accountId
          }, function (data) {
            $scope.tabs.messages.count = data.count;
          });
        }
      }
    });

    $rootScope.$watch('hidenavbar', function () {
      $ionicNavBarDelegate.showBar(!$rootScope.hidenavbar);
    });

    $scope.$on('$ionicView.enter', function () {
      $ionicNavBarDelegate.showBar(!$rootScope.hidenavbar);
      $ionicNavBarDelegate.align('center');

      $localStorage.page = $state.current.name;
      $rootScope.$emit('messages.update', {});
      if (FDI18n.mustChooseLanguage()) {
        FDModals.openLanguage();
      }

    });

    $scope.$on('$ionicView.leave', function () {
      unregisterOnMessage();
    });

    $rootScope.fdTranslate = function fdTranslate(text, traductions) {
      var lang = FDI18n.getCurrentLanguage();
      if (traductions && traductions[lang]) {
        return traductions[lang];
      } else {
        return text;
      }
    }

  });