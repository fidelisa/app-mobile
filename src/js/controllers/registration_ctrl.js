angular
  .module('fidelisa')
  .controller('RegistrationCtrl', function ($scope, Countries, AppConfig,
    $ionicModal, User, fidelisaToast, ionicDatePicker, $state, FDI18n,
    gettextCatalog, FdTools, ImagesUpload, $ionicPopup, $rootScope, Shops,
    fidelisaSelector, $window, $ionicScrollDelegate) {

    $scope.birthday = new Date();
    $scope.birthdayOK = false;

    var codePromo = ($scope.codePromo !== "subscribe") ? $scope.codePromo : undefined;

    var defaultShow = {
      base: true,
      address: true,
      perso: true,
      secure: true,
      tag: true
    };

    $scope.showSection = angular.merge(defaultShow, AppConfig.app.sectionShow);
    $scope.showSection = angular.merge($scope.showSection, FdTools.feature('profile').sectionShow);
    $scope.showSection.secure = !FdTools.feature('profile').noPassword;

    $scope.showTags = FdTools.feature('tags').active;
    $scope.headtitle = AppConfig.app.title;

    var EMPTYAVATAR = 'img/avatarEmpty.png';
    $scope.customerImageUri = EMPTYAVATAR;


    var convertBirthday = function convertBirthday(year, month, day) {
      if (angular.isDefined(year) && angular.isDefined(month) && angular.isDefined(day)) {
        var dd = new Date(year, month-1, day);
        return dd;
      } else {
        return undefined;
      }
    }

    if ($rootScope.logged) {
      User.check($scope.user).then(function(customer) {
        $scope.customer = customer;
        var birthday = convertBirthday(customer['birth_year'], customer['birth_month'], customer['birth_day']);
        if (angular.isDefined(birthday)) {
          $scope.birthdayOK = true;
          $scope.birthday = birthday;
        }
        $scope.customer.mailChoice = $scope.customer.email && ($scope.customer.phone == null);
      });
    } else {
      $scope.customer = {
        "first_name": "",
        "last_name": "",
        phone: "",
        email: "",
        country: AppConfig.app.country || 'FR',
        "birth_day": "",
        "birth_month": undefined,
        "birth_year": undefined,
        password: "",
        "password_confirmation": "",
        gender: "",
        address1: "",
        address2: "",
        zipcode: undefined,
        city: "",
        "account_id": AppConfig.app.accountId,
        codepromo: codePromo,
        mailChoice: true
      }
    }

    $scope.showRemoteImage = function () {
      var remoteImage = angular.isDefined($scope.customer.image_id) && $scope.customer.image_id !== null;
      return remoteImage && ($scope.customerImageUri === 'img/avatarEmpty.png');
    }


    $scope.closeRegistrationModal = function () {
      $scope.RegistrationModal.remove();
    }

    $scope.days = new Array(31);
    $scope.months = [{
      id: 1,
      name: "Janvier"
    }, {
      id: 2,
      name: "Février"
    }, {
      id: 3,
      name: "Mars"
    }, {
      id: 4,
      name: "Avril"
    }, {
      id: 5,
      name: "Mai"
    }, {
      id: 6,
      name: "Juin"
    }, {
      id: 7,
      name: "Juillet"
    }, {
      id: 8,
      name: "Août"
    }, {
      id: 9,
      name: "Septembre"
    }, {
      id: 10,
      name: "Octobre"
    }, {
      id: 11,
      name: "Novembre"
    }, {
      id: 12,
      name: "Decembre"
    }];

    $scope.countries = [{
      title: 'France',
      uuid: 'FR'
    }];

    Countries.query(function (data) {
      var countries = [];
      data.forEach(function (country) {
        countries.push({
          title: country[0],
          uuid: country[1]
        })
      })
      $scope.countries = countries;
    });

    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }


    $scope.customerInvalid = function () {
      var customer = $scope.customer;

      var customerInvalid = customer.last_name === '';
      var emailInvalid = customer.mailChoice && !validateEmail(customer.email); // === '';
      var phoneInvalid = !customer.mailChoice && customer.phone === '';
      var invalid = customerInvalid || emailInvalid || phoneInvalid;

      return invalid;
    }

    $scope.register = function () {
      var customer = $scope.customer;
      delete customer.mailChoice;

      User.register(customer)
        .then(function (registeredCustomer) {
          if ($scope.customerImageUri !== EMPTYAVATAR) {
            console.info("OK Avatar");
            console.info($scope.customerImageUri);
            return ImagesUpload.create($scope.customerImageUri, 'Customer')
              .then(function (image) {
                console.info("image uploaded");
                console.info(image);
                return User.update({
                  "account_id": registeredCustomer.account_id,
                  "image_id": image.uuid
                });
              })
              .catch(function (error) {
                console.info("image create Error");
                console.info(error);

                fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue avec l\'envoi de votre avatar.'));
              });
          } else {
            return true;
          }
        })
        .then(function () {
          $rootScope.$broadcast('$fidelisa:favoriteShop', $scope.customer.favorite_vendor_id);
          $scope.closeRegistrationModal();
          $state.go(AppConfig.goHome());
        })
        .catch(function (error) {
          console.info("registration Error");
          console.info(error);

          fidelisaToast.showShortBottom(gettextCatalog.getString('Une erreur est survenue.'));
        });
    };

    $scope.openCountries = function () {
      var selectorObj = {
        titleLabel: gettextCatalog.getString('Lieux'),
        setLabel: gettextCatalog.getString('OK'),
        closeLabel: gettextCatalog.getString('Annuler'),
        multi: false,
        search: true,
        closeOnSelect: true,
        selectedElements: [$scope.customer.country],
        elements: $scope.countries,
        callback: function (data) {
          if (data.length > 0) {
            $scope.customer.country = data[0];
          }
        },
        popupCss: 'fd-popup'
      };

      fidelisaSelector.openFidelisaSelector(selectorObj);
      // $ionicModal.fromTemplateUrl('templates/countries.html', {
      //   scope: $scope,
      //   animation: 'slide-in-up'
      // }).then(function(modal) {
      //   $scope.modalCountries = modal;
      //   $scope.modalCountries.show();
      // });
    }


    Shops.all({}, function (data) {
      $scope.shops = data;

      if ($scope.shops && $scope.shops.length > 0 && angular.isUndefined($scope.customer["favorite_vendor_id"])) {
        $scope.customer["favorite_vendor_id"] = $scope.shops[0].uuid;
      }


    }, function (error) {
      console.error(error);
    });


    $scope.selectShop = function () {
      var selectorObj = {
        titleLabel: gettextCatalog.getString('Lieux'),
        setLabel: gettextCatalog.getString('OK'),
        closeLabel: gettextCatalog.getString('Annuler'),
        multi: false,
        selectedElements: [$scope.customer["favorite_vendor_id"]],
        elements: $scope.shops,
        callback: function (data) {
          if (data.length > 0) {
            $scope.customer["favorite_vendor_id"] = data[0];
          }
        },
        popupCss: 'fd-popup'
      };

      fidelisaSelector.openFidelisaSelector(selectorObj);
    }

    $scope.onPickTag = function (tags) {
      $scope.customer['tag_ids'] = tags;
    }

    $scope.pickCountry = function (id) {
      $scope.customer.country = id;
      $scope.modalCountries.remove();
    }

    var disabledDates = [];

    var datePickerScheduleCallback = function (val) {
      if (angular.isDefined(val)) {
        var dd = new Date(val);
        $scope.birthdayOK = true;
        $scope.birthday = dd;
        $scope.customer["birth_month"] = dd.getMonth() + 1; //months from 1-12
        $scope.customer["birth_day"] = dd.getDate();
        $scope.customer["birth_year"] = dd.getFullYear();
      }
    };

    $scope.openPicker = function () {

      var timestamp = Date.parse($scope.birthday);
      if (isNaN(timestamp) === true) {
        $scope.birthday = new Date();
      }

      var datePickerObj = {
        titleLabel: gettextCatalog.getString('Date'), //Optional
        todayLabel: '_', //Optional
        closeLabel: gettextCatalog.getString('Annuler'), //Optional
        setLabel: gettextCatalog.getString('OK'), //Optional
        setButtonType: 'button-block', //Optional
        todayButtonType: 'button-hide', //Optional
        closeButtonType: 'button-block', //Optional
        inputDate: $scope.birthday, //Optional
        mondayFirst: FDI18n.mondayFirst(), //Optional
        disabledDates: disabledDates, //Optional
        weeksList: FDI18n.weeksList(), //Optional
        monthsList: FDI18n.monthsList(), //Optional
        templateType: 'popup', //Optional
        showTodayButton: false, //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        // from: new Date(2012, 8, 2), //Optional
        // to: new Date(2018, 8, 25),  //Optional
        callback: function (val) { //Mandatory
          datePickerScheduleCallback(val);
        },
        dateFormat: FDI18n.shortDateFormat(), //Optional
        closeOnSelect: false, //Optional
      };

      ionicDatePicker.openDatePicker(datePickerObj);
    }

    $scope.$watch('customer.gender', function (newValue) {
      var genders = {
        "": "",
        "Boy": gettextCatalog.getString('Homme'),
        "Girl": gettextCatalog.getString('Femme')
      }
      $scope.genderText = genders[newValue];
    })

    $scope.toggleGender = function () {
      if ($scope.customer.gender === "") {
        $scope.customer.gender = "Girl";
      } else if ($scope.customer.gender === "Girl") {
        $scope.customer.gender = "Boy";
      } else {
        $scope.customer.gender = "";
      }
    }

    $scope.selectAvatar = function (idx) {
      $scope.modalAvatar.remove();
      $scope.customerImageUri = 'img/avatar0' + idx + '.png';
    }

    $scope.pickAvatar = function () {
      $ionicModal.fromTemplateUrl('templates/avatars/list.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modalAvatar = modal;
        $scope.modalAvatar.show();
      });
    }

    $scope.takePicture = function () {
      var nativeApp = !!$window.cordova && $window.cordova.platformId !== 'browser'
      
      if (nativeApp) {
        var confirmPopup = $ionicPopup.confirm({
          cssClass: 'popup-pick',
          buttons: [{
              text: gettextCatalog.getString('Choisir une photo'),
              onTap: function () {
                return 1
              }
            },
            {
              text: gettextCatalog.getString('Prendre une photo'),
              onTap: function () {
                return 2
              }
            },
            {
              text: gettextCatalog.getString('Annuler'),
              onTap: function () {
                return 3
              }
            }
          ]
        });

        confirmPopup
          .then(function (res) {
            if (res === 3) {
              return undefined;
            } else {
              return ImagesUpload.pick(res === 2, true)
            }
          })
          .then(function (data) {
            if (angular.isDefined(data)) {
              $scope.customerImageUri = data;
            }
          });
      } else {
        var onchange = function onchange(data) {
          $scope.$apply(function() {
            $scope.customerImageUri = data;
          });
        };

        ImagesUpload.pickBrowser(true, onchange);       
      }

    }

    $scope.privacyPolicy = function() {
      if (angular.isDefined(AppConfig.privacyPolicyText)) {
          $scope.privacyPolicyText = AppConfig.privacyPolicyText.textEncode();
          $scope.showPolicy = !$scope.showPolicy;          
          $ionicScrollDelegate.resize();
          $ionicScrollDelegate.scrollBy(0, 20);
      } else {
          $window.open(AppConfig.app.host + '/privacy_policy?app_id=' + AppConfig.appId, '_system');
      }
    }


  });