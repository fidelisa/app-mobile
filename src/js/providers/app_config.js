angular
  .module('fidelisa')
  .provider('AppConfig', function() {
    var self = this;

    function host(url) {
      if (angular.isUndefined(url) || url === '') {
        return 'self';
      }
      var parser = document.createElement('a');
      parser.href = url;

      var hostname = (parser.protocol || 'http:') + '//' + parser.host;
      return hostname;
    }

    this.updateStatus = function($window) {
      self.isPreview = !$window.cordova;
      self.isBrowser = ($window.cordova && $window.cordova.platformId === "browser");
      self.isMobile = !self.isPreview && !self.isBrowser;
      self.initialHref = $window.location.href;
    }

    var defaultFeatures = [{
      "name": "geoloc",
      "active": false
    }, {
      "name": "beacons",
      "active": true
    }, ];

    var defaultCardFeature = {
      "active": false,
      "detachGifts": true,
      "detachSponsorship": true,
    };

    this.init = function(opt) {


      self.menus = angular.extend({}, opt.menus);
      self.app = angular.extend({}, opt.app);
      self.colors = angular.extend({}, opt.colors);
      self.vendors = opt.vendors;

      self.host = self.app.host;
      self.accountId = self.app.accountId;
      self.appId = opt.uuid;
      self.showStore = true ;
      self.privacyPolicyText = opt["privacy_policy_text"];
      if (self.privacyPolicyText === null) {
        self.privacyPolicyText = undefined;
      }

      if (!self.menus['sort']) {
        self.menus['sort'] = ["home", "cards", "messages", "facebook", "instagram", "shops", "web1", "web2", "web3", "web4", "appointment", "profile"]
      }

      var firstPage = self.menus["first_page"];

      if (firstPage === "") {
        firstPage = undefined;
      }

      if (angular.isUndefined(firstPage)) {
        self.menus['sort'].forEach(function(mnu) {
          if (angular.isUndefined(firstPage) && self.menus[mnu] && self.menus[mnu].enable) {
             firstPage = mnu;
          }
        })
      }

      if (angular.isUndefined(firstPage)) {
        firstPage = 'home';
      }


      self.home = self.menus.type + '/' + firstPage;
      self.homeState = self.menus.type + '.' + firstPage;

      self.goHome = function() {
        return self.subState(firstPage);
      }

      self.subState = function(name) {
        return self.menus.type + '.' + name;
      }

      self.subStateReplace = function(name) {
        return name.replace(/app\./g, self.menus.type + '.').replace(/tab\./g, self.menus.type + '.');
      }

      self.menu = function menu(menuName) {
        var ret = self.menus[menuName];
        return ret || {
          "active": false
        }
      }

      self.feature = function feature(name) {
        var features = angular.merge([], defaultFeatures, self.app.features)
        var ret = false;
        features.forEach(function(feat) {
          if (feat.name === name || ( feat.name === 'webpage' && name === 'web' )) {
            ret = feat;
          }
        });

        //specific no card
        if (name === "cards" && !ret) {
          ret = defaultCardFeature;
        }

        return ret || {
          "active": false
        };
      }

      if (!self.menus['more']) {
        self.menus["more"] = {
          "enable": true,
          "title": "Plus",
          "icon": "ion-more"
        };
      }

      self.menus["limit"] = self.menus["limit"] || 5;


      self.styles = self.colors.styles || {};

      if (angular.isUndefined(self.colors.textButton)) {
        self.colors.textButton = self.colors.item;
      }

      if (angular.isUndefined(self.app.features)) {
        self.app.features = {};
      }

      self.urlWhitelist = ['self',
       'http://localhost:3000/**',
       'https://*.fidelisa.com/**',
       'https://*.fdlscontent.com/**'];
      self.urlWhitelist.push(host(self.menus.web1.url) + '/**');
      self.urlWhitelist.push(host(self.menus.web2.url) + '/**');
      self.urlWhitelist.push(host(self.menus.web3.url) + '/**');
      self.urlWhitelist.push(host(self.menus.web4.url) + '/**');
      self.urlWhitelist.push('https://scontent.cdninstagram.com/**');

    };

    this.$get = function() {
      return self;
    };

  });
