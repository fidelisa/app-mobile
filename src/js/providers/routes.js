angular.module('fidelisa')

  .provider('FdRoutes', function (AppConfigProvider, $stateProvider) {
    var self = this;

    function generateViews(name, template, ctrl) {
      var data = {
        'menuContent': {
          templateUrl: template,
          controller: ctrl
        }
      };
      data['tab-' + name] = {
        templateUrl: template,
        controller: ctrl
      }
      return data;
    }

    function basicRoutes() {
      var style = AppConfigProvider.menus.style || 0;

      $stateProvider

        .state('signUp', {
          url: '/sign-up',
          templateUrl: 'templates/sign-up.html',
          controller: 'SignUpCtrl'
        })

        .state('full', {
          cache: false,
          url: '/app?user',
          abstract: true,
          templateUrl: 'templates/full.html',
          controller: 'MenuCtrl'
        })

        .state('full.registration', {
          url: '^/registration?code',
          views: {
            'fullContent': {
              templateUrl: 'templates/profile.html',
              controller: 'ProfileCtrl'
            },
            'login-view@full.registration': {
              templateUrl: 'templates/partials/' + style + '/sign-up.html'
            }
          }
        })

        .state('sso', {
          url: '/sso?user&keep',
          controller: 'SsoCtrl'
        })

        .state('show', {
          url: '/show?user',
          templateUrl: 'templates/show.html',
          controller: 'ShowCtrl'
        })

        .state('card', {
          url: '/cards/:programId?user',
          templateUrl: 'templates/cards/list.html',
          controller: 'CardsCtrl'
        })

        // // setup an abstract state for the tabs directive
        .state('app', {
          cache: false,
          url: '/app?user&keep&locale',
          abstract: true,
          templateUrl: 'templates/menus/side.html',
          controller: 'MenuCtrl'
        })

        // setup an abstract state for the tabs directive
        .state('tab', {
          cache: false,
          url: '/tab?user&keep&locale',
          abstract: true,
          views: {
            '': {
              templateUrl: 'templates/menus/tabs.html',
              controller: 'MenuCtrl'
            }
          }
        })
        .state('tab.more', {
          url: '/more',
          views: {
            'tab-more': {
              templateUrl: 'templates/more.html',
              controller: 'MenuMoreCtrl'
            }
          }
        });
    }

    function multipleRoutes() {
      // Each tab has its own nav history stack:
      ['app', 'tab'].forEach(function (mnu) {
        $stateProvider

          .state(mnu + '.home', {
            url: '/home',
            views: generateViews("home", 'templates/home.html', 'HomeCtrl')
          })

          .state(mnu + '.cards', {
            url: '/cards',
            views: generateViews('cards', 'templates/cards/list.html', 'CardsCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.messages', {
            url: '/messages',
            views: generateViews('messages', 'templates/messages.html', 'MessagesCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.profile', {
            url: '/profile?code',
            views: generateViews('profile', 'templates/profile.html', 'ProfileCtrl')
          })

          .state(mnu + '.shops', {
            url: '/shops',
            views: generateViews('shops', 'templates/shops/list.html', 'ShopsCtrl')
          })

          .state(mnu + '.facebook', {
            url: '/facebook',
            views: generateViews('facebook', 'templates/facebook.html', 'FacebookCtrl')
          })

          .state(mnu + '.appointment', {
            url: '/appointment',
            views: generateViews('appointment', 'templates/appointment/list.html', 'AppointmentCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.forms', {
            url: '/forms',
            views: generateViews('forms', 'templates/forms/list.html', 'FormsCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.forms_detail', {
            url: '/forms/:id',
            views: generateViews('forms', 'templates/forms/detail.html', 'FormsDetailCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.happenings', {
            url: '/happenings',
            views: generateViews('happenings', 'templates/happenings/categories.html', 'HappeningsCategoriesCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.happenings_list', {
            url: '/happenings/:id',
            views: generateViews('happenings', 'templates/happenings/list.html', 'HappeningsCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.happenings_detail', {
            url: '/happenings/:id',
            views: generateViews('happenings', 'templates/happenings/detail.html', 'HappeningsDetailCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.happenings_detail_participants', {
            url: '/happenings/:id/participants',
            views: generateViews('happenings', 'templates/happenings/participants.html', 'HappeningsDetailCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.myhappenings', {
            url: '/myhappenings',
            params: {
              id: 'owns'
            },
            views: generateViews('myhappenings', 'templates/happenings/list.html', 'HappeningsCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.myhappenings_detail', {
            url: '/myhappenings/:id',
            views: generateViews('myhappenings', 'templates/happenings/detail.html', 'HappeningsDetailCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.myhappenings_detail_participants', {
            url: '/myhappenings/:id/participants',
            views: generateViews('myhappenings', 'templates/happenings/participants.html', 'HappeningsDetailCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.forums', {
            url: '/forums',
            views: generateViews('forums', 'templates/forums/categories.html', 'ForumsCategoriesCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.forums_list', {
            url: '/forums/:id',
            views: generateViews('forums', 'templates/forums/list.html', 'ForumsCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.forums_new', {
            url: '/forums/:id/new',
            views: generateViews('forums', 'templates/forums/new.html', 'ForumsNewCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.forums_detail', {
            url: '/forums/:id/:detail',
            views: generateViews('forums', 'templates/forums/detail.html', 'ForumsDetailCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.forums_detail_new', {
            url: '/forums/:id/:detail/new',
            views: generateViews('forums', 'templates/forums/new.html', 'ForumsNewCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.items', {
            url: '/items',
            views: generateViews('items', 'templates/items/categories.html', 'ItemsCategoriesCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.items_list', {
            url: '/items/:id',
            views: generateViews('items', 'templates/items/list.html', 'ItemsCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.items_cart', {
            url: '/items/:id',
            views: generateViews('items', 'templates/items/cart.html', 'ItemsCartCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.instagram', {
            url: '/instagram',
            views: generateViews('instagram', 'templates/instagram/list.html', 'InstagramCtrl'),
          })

          .state(mnu + '.instagram_detail', {
            url: '/instagram/:id',
            views: generateViews('instagram', 'templates/instagram/detail.html', 'InstagramDetailCtrl')
          })

          .state(mnu + '.sponsorship', {
            url: '/sponsorship',
            views: generateViews('sponsorship', 'templates/sponsorship.html', 'CardsCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.contact', {
            url: '/contact',
            views: generateViews('contact', 'templates/contact.html', 'ContactCtrl'),
            data: {
              requiresLogin: true
            }
          })

          .state(mnu + '.admin', {
            url: '/admin',
            views: generateViews('admin', 'templates/admin/home.html', 'AdminHomeCtrl'),
            data: {
              requiresLogin: true,
              requiresAdmin: true
            }
          })

          .state(mnu + '.admin_contacts', {
            url: '/admin/contacts',
            views: generateViews('admin', 'templates/admin/contacts.html', 'AdminContactsCtrl'),
            data: {
              requiresLogin: true,
              requiresAdmin: true
            }
          })

          .state(mnu + '.admin_contact', {
            url: '/admin/contacts/:id',
            views: generateViews('admin', 'templates/admin/contact.html', 'AdminContactCtrl'),
            data: {
              requiresLogin: true,
              requiresAdmin: true
            }
          })

          .state(mnu + '.admin_message', {
            url: '/admin.message',
            views: generateViews('admin', 'templates/admin/message.html', 'AdminMessageCtrl'),
            data: {
              requiresLogin: true,
              requiresAdmin: true
            }
          })

        if (AppConfigProvider.menus && AppConfigProvider.menus.sort) {

          AppConfigProvider.menus.sort.forEach(function (m) {
            if (m.contains('web') || m.contains('wordpress')) {
              $stateProvider.state(mnu + '.' + m, {
                resolve: {
                  urlObj: function () {
                    return {
                      value: AppConfigProvider.menus[m]
                    };
                  }
                },
                url: '/' + m,
                views: generateViews(m, 'templates/iframe.html', 'WebSiteCtrl')
              })
            }

            if (m.contains('wordpressnew')) {
              $stateProvider.state(mnu + '.' + m, {
                  resolve: {
                    urlObj: function () {
                      return {
                        value: AppConfigProvider.menus[m],
                        name: m
                      };
                    }
                  },
                  url: '/' + m,
                  views: generateViews(m, 'templates/wordpress/list.html', 'WordpressCtrl')
                })
                .state(mnu + '.' + m + '_detail', {
                  resolve: {
                    urlObj: function () {
                      return {
                        value: AppConfigProvider.menus[m],
                        name: m
                      };
                    }
                  },
                  url: '/' + m + '/:id',
                  views: generateViews(m, 'templates/wordpress/detail.html', 'WordpressDetailCtrl')
                })
            }
          });
        }
      });
    }

    self.create = function () {
      basicRoutes();
      multipleRoutes();
    }

    this.$get = function () {
      return self;
    };
  });
