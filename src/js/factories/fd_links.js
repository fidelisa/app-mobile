angular.module('fidelisa')
  .factory('FDLinks', function ($rootScope, AppConfig, Device, Customers, $state, $window, $ionicModal) {



    function wrapUrlToken(url, callback) {
      var re = /\{(.*)_token\}/g;
      var find = re.exec(url);
      if (find) {
        var name = find[1];
        Customers.token({
          title: name
        }, function (data) {
          var newstr = url.replace(re, data.token);
          callback(newstr);
        }, function () {
          callback(url);
        });
      } else {
        callback(url);
      }
    }

     function openFormsModal(id) {      
      $ionicModal.fromTemplateUrl('templates/forms/modal.html', {        
        animation: 'slide-in-up',
        focusFirstInput: true
      }).then(function (modal) {
        modal.scope.formsID = id;
        modal.scope.formsModal = modal;
        modal.show();
      });
    }

    function openRegistration() {
      $ionicModal.fromTemplateUrl('templates/registration.html', {
        animation: 'none'
      }).then(function (modal) {
        modal.scope.RegistrationModal = modal;
        modal.scope.RegistrationModal.codePromo = "subscribe";
        modal.show();
      });
    }

    function openSurvey() {
      $ionicModal.fromTemplateUrl('templates/survey.html', {
          animation: 'slide-in-up',
          focusFirstInput: true
        })
        .then(function (modal) {
          modal.scope.surveyModal = modal;
          modal.show();
        });
    }

    return {
      gotoLink: function gotoLink(url, target) {

        if (url && url.startsWith('subscribe')) {
          openRegistration();
        } else if (url && url.startsWith('survey')) {
          openSurvey();
        } else if (url && url.startsWith('state:')) {
          var state = url.split(':');
          var dest = state[1];
          if (dest == '^.forms_detail') {
            openFormsModal(state[2]);
          } else {
            $state.go(dest);
          }
        } else if (url !== "") {

          if (angular.isUndefined(target)) {
            target = '_blank';
          }

          var options = "location=yes";
          if ($window.ionic.Platform.isIOS()) {
            options = "location=no,closebuttoncaption=Terminé";
          }


          wrapUrlToken(url, function (url) {
            if ($window.cordova && $window.cordova.InAppBrowser) {
              $window.cordova.InAppBrowser.open(url, target, options);
            } else {
              $window.open(url, target);
            }
          });

        }
      },

      followName: function (name) {
        var tab = AppConfig.menus[name.toLowerCase()];
        this.followTab(tab);
      },

      followTab: function followTab(tab) {
        if (tab.link && tab.link.contains('web') && !tab.iframe) {
          this.gotoLink(tab.url);
        } else {
          this.gotoLink(tab.link)
        }
      }

    }
  });