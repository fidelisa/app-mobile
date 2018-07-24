angular.module('fidelisa').controller('CardsCtrl', function($scope, $rootScope,
  AppConfig, $window, loginService, $stateParams, User, Cards, Gifts, Shops,
  $ionicSlideBoxDelegate, $ionicModal, $cordovaSms,
  gettextCatalog, FdTools) {


  $scope.host = AppConfig.host;
  $scope.views = {};
  $scope.gauge = AppConfig.app.gauge;
  $scope.currentSlide = 0;

  $scope.isBrowser = (!$window.cordova || $window.cordova.platformId === "browser")

  $scope.cardActive = undefined;
  $scope.user = loginService.getUser();

  var programId = $window.normalizeUUID($stateParams.programId);

  //'cards';

  if (angular.isDefined($stateParams.user)) {
    User.check({login: $stateParams.user});
  }

  $scope.attachGifts = !FdTools.feature("cards").detachGifts;
  $scope.attachGodfather = !FdTools.feature("cards").detachSponsorship;

  $scope.defaultLegalStatement = "<p>Le Bénéficiaire reconnaît avoir pris connaissance et accepté les conditions générales d´adhésion au présent programme de fidélité.</p>" +
    "<p>Ces conditions sont disponibles sur simple demande en magasin. Nous nous réservons le droit de modifier à tout moment les conditions générales d’utilisation du programme de fidélité ou de modifier ou de le supprimer.</p>" +
    "<h2>Principes :</h2>" +
    "<p>La carte est nominative et strictement personnelle. Elle ne peut être cédée ou prêtée.</p>" +
    "<p>La présente carte n’est ni une carte de paiement, ni une carte de crédit.</p>" +
    "<p>Le barême des avantages accordés en contrepartie de l’achat de prestations ou de produits, ainsi que les seuils de la carte sont librement définis par votre magasin qui pourra, à tout moment et à sa seule initiative, les modifier.</p>" +
    "<p>Les avantages ne pourront en aucun cas être couverts en espèces. </p>" +
    "<p></p>" +
    "<p>En cas de cessation du programme de fidélité, les avantages acquis par les titulaires de la carte pourront être utilisés pendant le délai qui vous sera indiqué en magasin et à l’issue duquel ils seront définitivement perdus. </p>" +
    "<p>Le défaut d’utilisation de la carte pendant une durée de plus d’un an pourra entrainer la perte de votre adhésion au programme de fidélité et des avantages qui lui sont liés.</p>";

  $scope.cards = [];

  /*
   * manageGifts with card
   *
   *
   * oneCard: card object
   */
  function manageGifts(oneCard) {

    oneCard.specialGains = [];

    Gifts.query({
      "card_id": oneCard.uuid
    }, function(gifts) {
      oneCard.isGift = gifts.length > 0;
      gifts.forEach(function(gift) {
        oneCard.isGift = true;
        if (gift["is_special_gain"]) {
          oneCard.specialGains.push(gift);
        } else {
          oneCard.winGift = gift;
        }
      });
    })
  }

  /*
   * manage one card
   *
   * oneCard: card object
   */
  function manageCard(oneCard) {
    var card = $scope.cards.findByUUID(oneCard.uuid);

    if (angular.isUndefined(card)) {
      $scope.cards.push(oneCard);
      card = oneCard;
    }

    if (angular.isUndefined($scope.cardActive)) {
      $scope.cardActive = card;
    }

    var paramsUrl = { cardId: card.uuid }

    if (angular.isDefined($stateParams.user) && $stateParams.user === 'demo') {
      paramsUrl['fake'] = true;
    }



    Cards.get(paramsUrl, function(newCard) {
      angular.merge(card, newCard);
      card.view = 'cards';

      manageGifts(card);

      card.owner = AppConfig.app;
      // card["expired_at"] = new Date(2017, 7, 13, 10, 0, 0, 0);
      var today = new Date();
      card.isExpired = card["expired_at"] < today;

      if (card.vendor_id) {
        Shops.get({
          shopId: card.vendor_id
        }, function(vendor) {
          card.owner = vendor
        });
      }

      User.promo(card.uuid).then(function(promoUrl) {
        card.promoUrl = promoUrl;
      });

      if (card.card_number) {
        var id = card.uuid;
        if (loginService.isDemo()) {
          id = card.card_number;
        }
        card.barcodeUrl = AppConfig.host + "/api/images/barcode/" + id + ".png?card=t&xdim=3&h=t";
      }



      var levelsPoints = [];
      var levelsColors = [];
      card.levels.forEach(function(level) {
        levelsPoints.push(level.floor_points);
        levelsColors.push(level.color);
      })
      card.levelsPoints = levelsPoints.join('|');
      card.levelsColors = levelsColors.join('|');
      card.complete = true;
    });
  }

  /*
   * manage cards
   *
   * data: all cards
   */
  function manageCards(data) {

    $scope.cards.forEach(function(card, idx) {
      var find = data.findByUUID(card.uuid);
      if (angular.isUndefined(find)) {
        $scope.cards.splice(idx, 1);
      }
    });

    data.forEach(manageCard);

    $ionicSlideBoxDelegate.enableSlide(data.length > 1);
    $ionicSlideBoxDelegate.update();
  }

  /*
   * update data
   */
  var update = function() {
    if (angular.isDefined(programId) && programId !== "") {
      manageCards([{
        "uuid": programId
      }]);
    } else {
      Cards.query({}, manageCards);
    }
  };

  $scope.onRefresh = function() {
    update();
    $scope.$broadcast('scroll.refreshComplete');
  };


  $scope.giftStyle = function(gift) {
    return "background-color: " + gift.color + "; border-radius: 50%; height: 40px; width: 40px;"
  };

  $scope.slideHasChanged = function(idx) {
    $scope.$broadcast('$fidelisa:refreshGauge', {});
    $scope.currentSlide = idx;
    $scope.cardActive = $scope.cards[idx];
  }

  $scope.pagerActive = function() {
    return $scope.cards.length > 1;
  }

  $scope.showCondition = function(card) {
    card.isShowCondition = !card.isShowCondition;
  }

  $scope.showDescription = function(card) {
    card.isShowDescription = !card.isShowDescription;
  }

  $scope.showSponsoring = function(card) {
    card.isShowSponsoring = !card.isShowSponsoring;
  }

  $scope.levels = function(card) {
    return card.program.gifts;
  }

  $scope.show = function(card, view) {
    card.view = view;
  }

  $scope.showGift = function(gift) {
    if (gift.image_id || gift.description) {
      $ionicModal.fromTemplateUrl('templates/cards/gift.html', {
        animation: 'slide-in-up'
      }).then(function(modal) {
        modal.scope.currentGift = gift;
        modal.show();
      });
    }
  }

  $scope.showLegalStatment = function(card) {
    $ionicModal.fromTemplateUrl('templates/cards/legal-statment.html', {
      animation: 'slide-in-up'
    }).then(function(modal) {
      modal.scope.card = card;
      modal.scope.defaultLegalStatement = $scope.defaultLegalStatement;
      modal.show();
    });
  }

  $scope.send = function(via, card) {
    var body = gettextCatalog.getString('Je vous recommande\n\
      {{ownerTitle}}\n\
      {{ownerUrl}}\n\
      En venant de ma part, vous profiterez de\n\
      {{sponsoredGift}}.\n\
      Pour bénéficier de votre cadeau, inscrivez-vous en suivant ce lien\n\
      {{promoUrlCode}}', {
      ownerTitle: card.owner.title,
      ownerUrl: (card.owner.url || ''),
      sponsoredGift: card.program["sponsored_gift"],
      promoUrlCode: card.promoUrl.code
    });

    if ($scope.isBrowser) {
      body = encodeURIComponent(body);
    }

    if (via === 'email') {
      document.addEventListener("deviceready", function() {
        $window.cordova.plugins.email.open({
          to: '',
          subject: card.owner.title,
          body: body,
          isHtml: true
        });
      });

    } else if (via === 'sms') {
      document.addEventListener("deviceready", function() {
        $cordovaSms.send('', body, {
          replaceLineBreaks: false,
          android: {
            intent: 'INTENT'
          }
        });
      });
    }
  }


  $scope.onHold = function(card) {
    if (card) {
      if ($scope.cardActive.program.addpoints_mobile) {
        $ionicModal.fromTemplateUrl('templates/cards/points.html', {
          animation: 'slide-in-up'
        }).then(function(modal) {
          modal.scope.cardActive = card;
          modal.scope.modal = modal;
          modal.show();
        });
      }
    }
  }

  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    if ($scope.giftModal) {
      $scope.giftModal = null;
    }
  });

  var unregister = $rootScope.$on('$fidelisa:refreshCards', function() {
    update();
  });

  $scope.$on('$ionicView.enter', function() {
    $window.addEventListener("orientationchange", orientationChangeListener);
    update();
  });

  $scope.$on('$ionicView.leave', function() {
    unregister();
    $window.removeEventListener("orientationchange", orientationChangeListener);
  });


  $scope.$on('event:auth-loginConfirmed', function() {
    update();
  });

  $scope.$on('event:auth-loginCancelled', function() {
    update();
  });

  $rootScope.$on('$fidelisa:reloadGifts', function() {
    update();
  });

  var orientationChangeListener = function() {
    if ($scope.cardActive.card_number && screen.orientation) {
      var orientation;
      if (screen.orientation && screen.orientation.type) {
        orientation = screen.orientation.type;
      } else {
        orientation = screen.orientation;
      }
      if (orientation.startsWith('landscape')) {
        $scope.showBarcode($scope.cardActive);
      } else if (orientation.startsWith('portrait')) {
        $scope.closeBarcodeModal();
      }
    }
  }


  $scope.showBarcode = function() {
    if (angular.isUndefined($scope.barcodeModal) && angular.isDefined($scope.cardActive)) {
      $ionicModal.fromTemplateUrl('templates/cards/barcode.html', {
        scope: $scope,
        animation: 'mh-slide'
      }).then(function(modal) {
        $scope.barcodeModal = modal;
        modal.show();
      });
    }
  }

  $scope.closeBarcodeModal = function() {
    if (angular.isDefined($scope.barcodeModal)) {
      $scope.barcodeModal.remove();
      $scope.barcodeModal = undefined;
    }
  }

});
