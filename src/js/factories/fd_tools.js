angular
  .module('fidelisa')
  .factory('FdTools', function($window, $state, AppConfig, $timeout) {

    return {
      numberOfMenus: function() {
        var cpt = 0;
        AppConfig.menus.sort.forEach(function(tab) {
          var mnu = AppConfig.menus[tab.toLowerCase()]
          if (mnu && mnu.enable) {
            cpt++
          }
        })
        return cpt;
      },

      restartApplication: function() {
        $timeout(function () {
            // 0 ms delay to reload the page.
            $state.go(AppConfig.homeState, {}, { reload: true });
        }, 1);
      },

      menu: function(menuName) {
        return AppConfig.menu(menuName);//legacy
      },

      feature: function(name) {
        return AppConfig.feature(name); //legacy
      },

      featureOptions: function(name, optionsName) {
        optionsName = optionsName || name;
        var feature = this.feature(name);
        return feature[optionsName] || {};
      },

      pageAvailable: function(name) {
        if (name.startsWith('app') || name.startsWith('tab')) {
          name = name.substring(4);
        }
        return this.feature(name).active;
      }

    }


  });
