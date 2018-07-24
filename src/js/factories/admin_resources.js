angular.module('fidelisa')


  .factory('AdminCustomers', function ($resource, AppConfig) {

    return $resource(AppConfig.host + '/api/customers/:customerId.json', {
      accountId: AppConfig.accountId
    }, {
      'query': {
        method: 'GET',
        isArray: true
      },
      'get': {
        method: 'GET'
      },

    });

  })

  .factory('AdminMessages', function ($resource, AppConfig) {

    return $resource(AppConfig.host + '/api/notifications/:messageId.json', {
      accountId: AppConfig.accountId
    }, {
      'create': {
        method: 'POST',
      },

    });

  })

  .factory('AdminMenus', function ($resource, AppConfig, $q, gettextCatalog, $timeout) {
    var self = {
      query: function () {

        var deferred = $q.defer();
        $timeout(function () {
          var menus = [
//            {
//              "name": gettextCatalog.getString("Contacts"),
//              "icon": "ion-ios-people-outline",
//              "link": "admin_contacts",
//              "active": true
//            },
            {
              "name": gettextCatalog.getString("Envoyer un message"),
              "icon": "ion-ios-paperplane-outline",
              "link": "admin_message",
              "active": true
            }
          ]

          deferred.resolve(menus);
        }, 200); // timeout avoid empty result


        return deferred.promise;
      }
    };

    return self;
  });
