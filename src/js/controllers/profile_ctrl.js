angular.module('fidelisa').controller('ProfileCtrl', function($scope, $rootScope,
    $timeout, $ionicModal, User, $ionicPopup, loginService, AppConfig,
    fidelisaToast, Surveys, $stateParams, $localStorage, gettextCatalog,
    FDI18n, $window, FdTools, FDModals, $state, $ionicScrollDelegate) {

    $scope.devMode = $localStorage.devMode;
    $scope.withLocalization = FdTools.feature("localization").active;
    function initCustomer() {
        $scope.customer = {
            password: '',
            "confirmation_password": ''
        };
    }

    initCustomer();

    $scope.modifyProfile = function() {
        $ionicModal.fromTemplateUrl('templates/registration.html', {
            scope: $scope,
            animation: 'none'
        }).then(function(modal) {
            $scope.RegistrationModal = modal;
            $scope.RegistrationModal.show();
        });
    }

    $scope.signOut = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: gettextCatalog.getString('Déconnexion'),
            template: gettextCatalog.getString('Se déconnecter?'),
            cancelText: gettextCatalog.getString('Annuler'),
            cancelType: 'confirm-btn',
            okText: gettextCatalog.getString('Déconnexion'),
            okType: 'confirm-btn'
        });

        confirmPopup.then(function(res) {
            if (res) {
                loginService.delUser();
            }
        });
    };

    var update = function() {
        $scope.user = loginService.getUser();
    };

    var devCpt = 0;

    $scope.devMod = function() {
        devCpt = devCpt + 1;
        if (devCpt >= 5) {
            devCpt = 0;
            $localStorage.devMode = !$localStorage.devMode
            if ($localStorage.devMode) {
                fidelisaToast.showShortBottom(gettextCatalog.getString('Mode développeur activé'));
            } else {
                fidelisaToast.showShortBottom(gettextCatalog.getString('Mode développeur désactivé'));
            }
            $scope.devMode = $localStorage.devMode;
        }
        $timeout(function() {
            devCpt = 0;
        }, 10 * 1000);
    }

    update();

    $scope.$on('$ionicView.enter', function() {
        update();
        $ionicScrollDelegate.freezeScroll(!$scope.showPolicy);
    });

    $scope.$on('$ionicView.leave', function() {
        $ionicScrollDelegate.freezeScroll(false);
    });

    $scope.$on('event:auth-loginConfirmed', function() {
        update();
    });


    $scope.$on('event:auth-loginCancelled', function() {
        update();
    });


    $scope.openDevModeModal = function() {
        $ionicModal.fromTemplateUrl('templates/dev-mode.html', {
                scope: $scope
            })
            .then(function(modal) {
                $scope.devModeModal = modal;
                $scope.devModeModal.show();
            });
    }

    $ionicModal.fromTemplateUrl('templates/newpass.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.newpass = function() {
        initCustomer();
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.openAdmin = function() {
        $state.go(AppConfig.subState('admin'));
    };

    $scope.changepass = function() {
        var login = loginService.getLogin();
        var oldLp = login.password || "";
        var oldP = $scope.customer.old_password || "";
        if (oldP !== oldLp) {
            fidelisaToast.showShortBottom(gettextCatalog.getString('Ancien mot de passe incorrect'));
        } else if ($scope.customer.password !== $scope.customer.confirmation_password) {
            fidelisaToast.showShortBottom(gettextCatalog.getString('Le mot de passe de confirmation est incorrect'));
        } else {
            User.pass($scope.customer).then(function() {
                login.password = $scope.customer.password;
                $scope.closeModal();
            }, function(data) {
                var msg = gettextCatalog.getString('Le mot de passe {{pass}}', {
                    pass: data.password
                });
                fidelisaToast.showShortBottom(msg);
            });
        }
    };

    $scope.changeLang = function() {
        FDModals.openLanguage();
    }

    $scope.privacyPolicy = function() {
        if (angular.isDefined(AppConfig.privacyPolicyText)) {
            $scope.privacyPolicyText = AppConfig.privacyPolicyText.textEncode();
        
            $scope.showPolicy = !$scope.showPolicy;
            if ($scope.showPolicy) {
                $ionicScrollDelegate.freezeScroll(false);
            } else {
                $ionicScrollDelegate.freezeScroll(true);
            }
            $ionicScrollDelegate.scrollTop();
            $ionicScrollDelegate.resize();
        } else {
            $window.open(AppConfig.app.host + '/privacy_policy?app_id=' + AppConfig.appId, '_system');
        }
    }
});