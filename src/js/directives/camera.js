angular.module('fidelisa')

  .directive('fdCamera', function (ImagesUpload) {

    return {
      require: 'ngModel',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        model: "=ngModel"
      },

      link: function (scope, element, attrs, ngModel) {
        scope.$watch(function () {
          return ngModel.$modelValue;
        }, function (newValue) {
          if (newValue && newValue !== scope.imageUri) {
            scope.imageUri = newValue;
          }
        });
      },

      templateUrl: function () {
        return 'templates/pickers/camera.html';
      },

      controller: function ($scope, $window, fidelisaToast, $rootScope, $q, gettextCatalog) {
        var nativeApp = !!$window.cordova && $window.cordova.platformId !== 'browser'

        $scope.withCamera = nativeApp;

        //TODO: PWA camera
        $rootScope.$on('$fidelisa:$camera', function (event, imageUri) {
          $scope.$apply(function() {
            $scope.model = imageUri;
            $scope.withImage = true;
          });
        });

        $scope.removePicture = function () {
          $scope.withImage = false;
          $scope.model = undefined;
        }

        $scope.takePicture = function (camera) {
          
          if (nativeApp) {
            ImagesUpload.pick(camera)
            .then(function (data) {
              $rootScope.$broadcast('$fidelisa:$camera', data);
            })
            .catch(function (error) {
              fidelisaToast.showShortBottom(
                gettextCatalog.getString('Une erreur est survenue.\n{{error}}', {
                  error: error
                })
              );
            });

          }  else {
            var onchange = function onchange(data) {
              $rootScope.$broadcast('$fidelisa:$camera', data);
            };
            ImagesUpload.pickBrowser(true, onchange);                 
          }              
        }

      }
    }
  })