angular
  .module('fidelisa')
  .factory('FDI18n', function($document,  AppConfig,
    gettextCatalog, $localStorage, FdTools, $locale,
    tmhDynamicLocale) {

    var _currentLanguage = $localStorage.currentLanguage;
    var _listeners = [];

    function checkLanguage(language) {
      var availableLanguages = AppConfig.feature("localization").languages || [];
      availableLanguages.push('fr'); // Force french
      if (availableLanguages.contains(language)) {
        return language;
      } else if (availableLanguages.contains('en')) {
        return 'en'
      } else {
        return 'fr';
      }
    }

    function afterTranslate() {
      AppConfig.menus["more"]["title"] = gettextCatalog.getString('Plus');
    }

    return {
      init: function(defaultLanguage) {

        var self = this;
        console.info('FD18n.init', $localStorage.currentLanguage);
        if (angular.isDefined(defaultLanguage)) {
          self.setCurrentLanguage(defaultLanguage);
        }
        else if ($localStorage.currentLanguage) {
          self.setCurrentLanguage($localStorage.currentLanguage);
        } else {
          document.addEventListener("deviceready", function() {
            navigator.globalization.getPreferredLanguage(function(language) {
              var lang = language.value.split('-')[0];
              console.info('language: ' + language.value);
              self.setCurrentLanguage(lang);
            }, function() {
              console.error('Error getting language');
            });
          });
        }

        if (typeof Array.prototype.fdTranslateArray != 'function') {
          Array.prototype.fdTranslateArray = function(name) {
            var newArray = [];
            this.forEach(function(obj) {
              var newObj = angular.merge({}, obj, { title: self.translateEntity(obj, name) } );
              newArray.push(newObj);
            })
            return newArray;
          };
        }

      },

      mustChooseLanguage: function() {
        return angular.isUndefined(_currentLanguage);
      },

      setCurrentLanguage: function(lang) {
        _currentLanguage = checkLanguage(lang);
        gettextCatalog.setCurrentLanguage(_currentLanguage);
        tmhDynamicLocale.set(_currentLanguage);
        $localStorage.currentLanguage = _currentLanguage;

        _listeners.forEach(function(listener) {
          listener(_currentLanguage);
        });

        afterTranslate();
      },

      getTitleString: function(name) {
        var menu = AppConfig.menu(name, true);
        if (menu) {
          return this.translateEntity(menu);
        } else {
          return name;
        }
      },

      getFeatureOptionsTitle: function getFeatureTitle(name) {
        var feature = FdTools.featureOptions(name);
        if (feature) {
          return this.translateEntity(feature);
        } else {
          return name;
        }
      },

      translateEntity : function translateEntity(entity, name) {
        name = name || "title";

        if (_currentLanguage && entity && entity[name+"_i18n"] && entity[name+"_i18n"][_currentLanguage]) {
          return entity[name+"_i18n"][_currentLanguage];
        }
        return entity[name] || 'N/A';
      },


      getCurrentLanguage: function() {
        return _currentLanguage;
      },

      addEventListener: function(listener) {
        _listeners.push(listener);
      },

      monthsList: function() {
        return $locale.DATETIME_FORMATS.SHORTMONTH;
      },

      weeksList: function() {
        var ret = [];
        $locale.DATETIME_FORMATS.SHORTDAY.forEach(function(d) {
          ret.push(d[0].toUpperCase())
        });
        return ret;
      },

      firstDayOfWeek: function() {
        return $locale.DATETIME_FORMATS.FIRSTDAYOFWEEK;
      },

      mondayFirst: function() {
        return $locale.DATETIME_FORMATS.FIRSTDAYOFWEEK == 0;
      },

      shortDateFormat: function() {
        return $locale.DATETIME_FORMATS.shortDate;
      },

      removeEventListener: function(listener) {
        while (_listeners.indexOf(listener) !== -1) {
          _listeners.splice(_listeners.indexOf(listener), 1);
        }
      }
    }

  });
