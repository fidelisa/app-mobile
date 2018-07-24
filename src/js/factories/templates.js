angular
  .module('fidelisa')
  .factory('FdTemplates', function($rootScope, AppConfig) {

    $rootScope.FdTpl = {};
    var style ;

    function createTpl(model, pages) {
      $rootScope.FdTpl[model] = {};
      pages.forEach(function(page) {
        $rootScope.FdTpl[model][page] = 'templates/'+model+'/'+style+'/'+page+'.html';
      });
    }

    return {
      init: function() {
        style = AppConfig.menus.style || 0;

        createTpl("happenings", ["_categories", "_detail", "_list", "_new", "_participants"]);
        $rootScope.FdTpl['sign-up'] = 'templates/partials/'+style+'/sign-up.html';
      }
    }

  });
