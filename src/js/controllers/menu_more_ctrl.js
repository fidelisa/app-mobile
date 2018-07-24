angular.module('fidelisa').controller('MenuMoreCtrl', function($scope, AppConfig, FDLinks) {

    $scope.moreTabsSort = [];

    AppConfig.menus.sort.forEach(function(tab) {
        var mnu = AppConfig.menus[tab.toLowerCase()]
        if (mnu && mnu.more && mnu.enable) {
          mnu.name = tab;
          $scope.moreTabsSort.push(mnu);
        }
    })

    $scope.onMenuMoreClick = function(tab) {
        FDLinks.followTab(tab) ;
    }

});
