angular
  .module('fidelisa')
  .controller('WordpressCtrl', function($scope, $rootScope,
    urlObj, $timeout, Wordpress, $state, AppConfig,  $window) {

    $scope.title = urlObj.value.title;

    var update = function() {
      console.log(urlObj.value.url);
      Wordpress.get(urlObj.value.url)
        .then(function(data) {
          console.log(data);
          if (angular.isArray(data)) {
            $scope.data = data;
          } else {
            $scope.msg = data;
          }
          
        }, function(error) {
          console.error(error);
        });
    }

    $scope.convertWP = function(data) {
      var st = $window.linkifyStr(data);
      st = st.replace(/\n/g, "<br />");
      return st;
    }


    $scope.showDetail = function(idx) {
      $state.go(AppConfig.subState(urlObj.name + '_detail'), {
        id: idx,
        data: $scope.data[idx]
      });
    }

    $scope.onRefresh = function() {
      Wordpress.reset();
      update();
      $scope.$broadcast('scroll.refreshComplete');
    };

    update();

  });
