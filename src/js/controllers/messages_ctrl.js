angular
  .module('fidelisa')
  .controller('MessagesCtrl', function ($scope, $rootScope, PushNotify,
    AppConfig, Messages, $window, Gifts, FdTools, Translations, FDI18n, $q) {

    $scope.host = AppConfig.host;
    $scope.noMessage = true;
    $scope.showShare = $window.cordova && $window.cordova.platformId !== "browser"

    $scope.messages = [];

    $scope.activeTabs = false;
    $scope.activeMsg = true;

    $scope.isGifts = false;
    $scope.isMessages = false;

    function manageMessages() {      

      if ($rootScope.logged) {
        $rootScope.$emit('messages.update', {});
        return Messages.query({}).$promise.then(function (data) {
          $scope.isMessages = data.length > 0;
          var oldMessages = $scope.messages          
          
          for (var index = 0; index < data.length; index++) {
            var element = data[index];
            var msg = oldMessages.findByUUID(element.uuid);
            if (angular.isDefined(msg)) {
              data[index] = msg;
            }            
          }
          $scope.messages = data;

          return data;
        });
      } else {
        var q = $q.defer();        
        q.resolve([]);
        return q.promise;      
      }

    }

    var fillMessage = function fillMessage(msg) {
      return Messages.get({
        messageId: msg.uuid
      }).$promise.then(function(newMsg) {
        newMsg.createdDate = newMsg.created_at;
        var data = newMsg['data_html'] || newMsg['data'];
        newMsg.html = data.textEncode();
        return newMsg;
      }); 
    }

    function manageMessage(data) {
      var promises = data.map(function(msg) { return fillMessage(msg); });
      return $q.all(promises);
    }

    function sortMessages(data) {
      // console.log(data);
      // data.sort(function(a, b){
      //   console.log(a.createdDate.getTime(), b.createdDate.getTime());
      //   return a.createdDate.getTime() <= b.createdDate.getTime();
      // });
      $scope.messages = data;
      return true;
    }


    function manageGifts() {
      if (FdTools.feature("cards").detachGifts) {
        Gifts.query({}, function (data) {
          $scope.isGifts = data.length > 0;
          $scope.gifts = data;
        }, function (error) {
          console.error(error);
        });
      }
    }

    var update = function () {
      $scope.withLocalization = FdTools.feature("localization").active && FDI18n.getCurrentLanguage() !== 'fr';

      manageMessages()
      .then(manageMessage)
      .then(sortMessages)
      .then(manageGifts)

      PushNotify.resetBadge();
    };

    $scope.$watchGroup(['isGifts', 'isMessages'], function () {
      $scope.activeMsg = true;
      $scope.activeTabs = $scope.isGifts && $scope.isMessages;
      if (!$scope.activeTabs) {
        $scope.isGifts = !$scope.activeMsg;
      }
    });

    $scope.onRefresh = function () {
      update();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.levels = function (card) {
      return card.program.gifts;
    }

    $scope.read = function (msg) {
      $rootScope.$emit('messages.update', {
        reduce: !msg.read
      });
      msg.read = true;
      Messages.read({
        messageId: msg.uuid
      });
    }

    $scope.delete = function (msg) {
      $rootScope.$emit('messages.update', {
        reduce: !msg.read
      });
      var idx = $scope.messages.findIndex(function (message) {
        return msg.uuid === message.uuid
      });
      if (angular.isDefined(idx)) {
        $scope.messages.splice(idx, 1);
      }

      Messages.delete({
        messageId: msg.uuid
      });
    }

    $scope.toggleTranslate = function (msg) {
      msg.showTranslate = !msg.showTranslate;
      if (angular.isUndefined(msg.htmlTr)) {
        Translations.single({
          'tl': FDI18n.getCurrentLanguage(),
          'q': msg.html
        }, function (data) {
          msg.htmlTr = data.translatedText;
        });
      }
    }

    $scope.toggleActiveMsg = function () {
      $scope.activeMsg = !$scope.activeMsg;
    }

    $scope.$on('$ionicView.enter', function () {
      update();
      document.addEventListener("resume", update, false);
    });

    $scope.$on('$ionicView.leave', function () {
      document.removeEventListener("resume", update, false);
    });


    $scope.$on('event:auth-loginConfirmed', function () {
      update();
    });

    $scope.$on('event:auth-loginCancelled', function () {
      update();
    });

    $rootScope.$on('$fidelisa:reloadGifts', function () {
      manageGifts();
    });

  })