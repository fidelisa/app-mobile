angular
  .module('fidelisa')
  .controller('LanguageCtrl', function($scope, FDI18n, FdTools, FDModals,  AppConfig) {

    var oldLang = FDI18n.getCurrentLanguage();

    $scope.headtitle = AppConfig.app.title;
    $scope.withImageTitle = (AppConfig.app.imageTitle && AppConfig.app.imageTitle !== "");

    // On device local image and on preview url (FIX cache issue)
    $scope.imageTitleUrl = AppConfig.app.imageTitle;
    document.addEventListener("deviceready", function() {
        $scope.imageTitleUrl = 'img/title.png';
    });


    $scope.languages = [
      { name: 'English', img: 'img/flags/gb.png', code: 'en' },
      { name: 'Français', img: 'img/flags/fr.png', code: 'fr' }
    ];

    $scope.active = function(lang) {
      return lang.code === FDI18n.getCurrentLanguage();
    }

    $scope.changeLang = function(lang) {
      if (oldLang !== lang.code) {
        FDI18n.setCurrentLanguage(lang.code);
      }
      FDModals.closeLanguage();
    }

  });
