angular.module('fidelisa')

  .controller('WebSiteCtrl', function ($scope, $window, urlObj, $ionicNavBarDelegate, $ionicSideMenuDelegate, AppConfig) {


    function adaptUrl(url) {
      if (url.includes('fdmob')) {
        return url;
      } else {
        var parser = document.createElement('a');
        parser.href = url;
        if (parser.search[0] === '?') {
          parser.search = parser.search + '&fdmob=t';
        } else {
          parser.search = '?fdmob=t';
        }

        return parser.href;
      }
    }


    var url = adaptUrl(urlObj.value.url);
    $scope.title = urlObj.value.title;
    $scope.frameid = Math.floor((Math.random() * 1000000) + 1);

    var WebSubView = $window.WebSubView;

    var topDefault =$window.ionic.Platform.isIOS() ? 64 : 44;
    var bottomDefault = (AppConfig.menus.type === "app") ? 0 : 48;
    var css = "";
    if (angular.isDefined(urlObj.value.css) && urlObj.value.css !== "") {
      css = urlObj.value.css + ' { display: none !important; }';
    }


    var tag = -1;
    if (angular.isDefined(WebSubView)) {
      document.addEventListener("deviceready", function () {
        WebSubView.isAvailable(function (available) {
          if (available) {
            WebSubView.load({
                url: url,
                hidden: false, 
                top: topDefault,
                bottom: bottomDefault,
                css: css
              },
              // this success handler will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
              function (result) {
                console.log(result);
                if (result.event === "loading") {
                  urls.unshift(result.url);
                } else if (result.event === "loaded") {
                  $scope.$apply(function () {
                    setShowBack(result.canGoBack);
                  });
                } else if (result.event === "opened") {
                  tag = result.tag;
                }
              },
              function (msg) {
                console.log("KO: " + msg);
              })
          } else {
            $scope.url = url;
          }
        });
      });
    } else {
      $scope.url = url;
    }

    var urls = [];

    function setShowBack(value) {
      $scope.showSwipe = AppConfig.menus.type === 'app' && !value;
      $scope.showback = value;
    }

    setShowBack(false);

    $scope.goBack = function () {
      urls.shift();
      if (WebSubView) {
        WebSubView.back(tag);
      }
    }

    $scope.$on('$ionicView.enter', function () {
      if (WebSubView) {
        WebSubView.show(tag);
      }
    });

    $scope.$on('$ionicView.leave', function () {
      if (WebSubView) {
        WebSubView.hide(tag);
      }
    });

    $scope.$watch(function () {
        return $ionicSideMenuDelegate.getOpenRatio();
      },
      function (ratio) {
        var opts = {};
        if (ratio === 0) {
          opts.pixels = -275;
          opts.duration = 0.1;
        } else {
          opts.pixels = 275;
          opts.duration = 0.2;
        }

        if (WebSubView) {
          WebSubView.moveHorizontal(tag, opts);
        }
      });

  });