angular.module('fidelisa')
  .factory('ImagesUpload', function ($http, $q, AppConfig, $window, loginService) {

    var urlBase = '/api/images';

    function setOptions(srcType, dstType) {
      var options = {
        quality: 20, // prev: 50
        destinationType: dstType,
        sourceType: srcType,
        // encodingType: $window.Camera.EncodingType.JPEG, 
        mediaType: $window.Camera.MediaType.PICTURE,
        // allowEdit: true, 
        // correctOrientation: true, 
        saveToPhotoAlbum: true // prev: none
      }
      return options;
    }

    function sendFileUri(imageURI, imageType) {
      var deferred = $q.defer();

      var options = new $window.FileUploadOptions();
      options.fileKey = "file";
      options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);

      var params = {};
      options.params = params;
      var headers = loginService.headers();
      delete headers["Content-Type"]; //avoid json
      options.headers = headers;

      var ft = new $window.FileTransfer();
      ft.upload(imageURI,
        AppConfig.host + urlBase + '?type=' + imageType + '&account_id=' + AppConfig.app.accountId,
        function (r) {
          console.info("image create OK", r.response);
          deferred.resolve(angular.fromJson(r.response));
        },
        function (error) {
          console.info("image create Error", error);
          deferred.reject(error);
        }, options);

      return deferred.promise;
    }

    function dataURItoBlob(dataURI) {
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0){
        byteString = atob(dataURI.split(',')[1]);
      } else {
        byteString = unescape(dataURI.split(',')[1]);
      }

      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      var ia = new $window.Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], { type: mimeString });
    }

    function sendFileData(imageURI, imageType) {
      var deferred = $q.defer();
      var url = AppConfig.host + urlBase + '?type=' + imageType + '&account_id=' + AppConfig.app.accountId;
      var formData = new FormData();
      formData.append('file', dataURItoBlob(imageURI));

      $http.post(url, formData, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': 'none' }
      })
      .success(function (data) {
        deferred.resolve(data);
      }).
      error(function (data, status) {
        deferred.reject(status);
      });
      return deferred.promise;
    }

    var self = {
      create: function (imageURI, imageType, errorOnEmpty) {

        if (angular.isUndefined(imageURI) || angular.isUndefined($window.cordova)) {
          var deferred = $q.defer();
          if (errorOnEmpty) {
            deferred.reject("Empty imageURI");
          } else {
            deferred.resolve({});
          }
          return deferred.promise;
        } else {
          var realCnx = !!$window.cordova && $window.cordova.platformId !== 'browser'
          if (realCnx) {
            return sendFileUri(imageURI, imageType);
          } else {
            return sendFileData(imageURI, imageType);
          }
        }
      },

      pick: function (withCamera, allowSimulation) {
        var realCnx = !!$window.cordova && $window.cordova.platformId !== 'browser'
        var dstType = $window.Camera.DestinationType.FILE_URI;
        if (!realCnx) {
          dstType = $window.Camera.DestinationType.DATA_URL;
        }

        var srcType = $window.Camera.PictureSourceType.SAVEDPHOTOALBUM;
        if (withCamera) {
          srcType = $window.Camera.PictureSourceType.CAMERA
        }
        var options = setOptions(srcType, dstType);

        var d = $q.defer();
        if ($window.Camera) {
          navigator.camera.getPicture(function cameraSuccess(data) {
            if (!realCnx) {
              data = 'data:image/jpeg;base64,' + data;
            }
            d.resolve(data);
          }, function cameraError(error) {
            d.reject(error);
          }, options);
        } else if (allowSimulation) {
          d.resolve('img/avatarEmpty.png'); //simulation
        } else {
          d.reject("Not available");
        }

        return d.promise;
      },


      pickBrowser: function pickBrowser(trigger, onchangeCallBack) {

        var input = document.getElementsByName('fdCameraFiles')[0];
        if (!input) {
          input = document.createElement('input');
          input.style.display = 'none';
          input.className = 'fd-camera-select';
          input.type = 'file';
          input.name = 'fdCameraFiles';
          document.body.appendChild(input);
        }
      
        input.onchange = function (inputEvent) {
          var reader = new FileReader();
          reader.onload = function (readerEvent) {
            if ( angular.isFunction(onchangeCallBack) ) {
              onchangeCallBack(readerEvent.target.result);              
            }
          };

          reader.readAsDataURL(inputEvent.target.files[0]);
        };
        if (trigger) {
          angular.element(input).trigger('click');          
        }

        return input;
      }

    }

    return self;
  });