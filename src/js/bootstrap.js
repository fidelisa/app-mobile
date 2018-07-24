angular.element(function() {

    $.get('./data/options.json', function (data) {

      var jsonData = data ;
      if ( angular.isString(data)) {
        jsonData = angular.fromJson(data);
      }

      angular.module('fidelisa').config(function($urlRouterProvider,
        $httpProvider, $sceDelegateProvider, $ionicConfigProvider,
        AppConfigProvider, $sceProvider, FdRoutesProvider,
        tmhDynamicLocaleProvider) {

        AppConfigProvider.init(jsonData);

        $ionicConfigProvider.tabs.position('bottom'); // other values: top
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.navBar.alignTitle('center');

        $sceProvider.enabled(false);

        $sceDelegateProvider.resourceUrlWhitelist(AppConfigProvider.urlWhitelist);

        $httpProvider.interceptors.push('apiHttpInterceptor');
        // $httpProvider.defaults.transformResponse.push(function(responseData){
        //   convertDateStringsToDates(responseData);
        //   return responseData;
        // });

        FdRoutesProvider.create();

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise(AppConfigProvider.home);

        tmhDynamicLocaleProvider.localeLocationPattern('./js/i18n/angular-locale_{{locale}}.js');

      });
      angular.bootstrap(document, ['fidelisa']);

    });
  });
