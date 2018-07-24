angular.module('fidelisa')

.factory('Accounts', function($resource, AppConfig) {

  return $resource(AppConfig.host + '/m/accounts/:accountId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    }
  });

})

.factory('Customers', function($resource, AppConfig) {

  return $resource(AppConfig.host + '/m/accounts/:accountId/customers.json', {
    accountId: AppConfig.accountId
  }, {
    'token': {
      method: 'GET',
      url: AppConfig.host + '/m/accounts/:accountId/customers/token.json'
    },
    'geofence': {
      method: 'POST',
      url: AppConfig.host + '/m/accounts/:accountId/customers/geofence.json'
    }
  });

})

.factory('Cards', function($resource, AppConfig) {

  return $resource(AppConfig.host + '/m/accounts/:accountId/cards/:cardId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'query': {
      method: 'GET',
      isArray: true,
      params: {
        "only_id": true
      }
    },
    'points': {
      method: 'POST',
      url: AppConfig.host + '/m/accounts/:accountId/cards/:cardId/points.json'
    },
    'gifts': {
      method: 'POST',
      url: AppConfig.host + '/m/accounts/:accountId/cards/:cardId/gifts.json'
    },
    'gains': {
      method: 'POST',
      url: AppConfig.host + '/m/accounts/:accountId/cards/:cardId/gains.json'
    }

  });

})


.factory('Gains', function($resource, AppConfig) {

  return $resource(AppConfig.host + '/m/accounts/:accountId/gains/:gainId.json', {
    accountId: AppConfig.accountId
  }, {
    'valid': {
      method: 'GET',
      url: AppConfig.host + '/m/accounts/:accountId/gains/:gainId/valid.json'
    }
  });

})

.factory('InstagramData', function($resource, AppConfig) {

  return $resource(AppConfig.host + '/m/accounts/:accountId/instagram', {
    accountId: AppConfig.accountId
  }, {
    'profile': {
      method: 'GET',
      url: AppConfig.host + '/m/accounts/:accountId/instagram/profile'
    },
    'media': {
      method: 'GET',
      isArray: true,
      url: AppConfig.host + '/m/accounts/:accountId/instagram/media'
    }
  });

})

.factory('Messages', function($resource, AppConfig) {

  return $resource(AppConfig.host + '/m/accounts/:accountId/messages/:messageId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'count': {
      method: 'GET',
      params: {
        read: false,
        count: true
      }
    },
    'query': {
      method: 'GET',
      isArray: true,
      params: {
        "only_id": true
      }
    },
    'read': {
      method: 'GET',
      url: AppConfig.host + '/api/messages/read/:messageId.json'
    },
    'delete': {
      method: 'DELETE',
      url: AppConfig.host + '/api/messages/:messageId.json'
    }
  });

})

.factory('Showcase', function($resource, AppConfig) {

  return $resource(AppConfig.host + '/m/accounts/:accountId/showcase.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    }
  });

})

// Apple/Google Stores Urls
.factory('Stores', function($resource, AppConfig) {

  return $resource(AppConfig.host + '/m/accounts/:accountId/stores.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    }
  });

})

.factory('Shops', function($resource, AppConfig, loginService) {

  return $resource(AppConfig.host + '/m/accounts/:accountId/vendors/:shopId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'query2': {
      method: 'GET',
      isArray: true,
      params: {
        "only_id": true
      }
    },
    'query': {
      method: 'GET',
      isArray: true,
      interceptor: {
        'response': function(response) {
          if (response && response.data) {
            response.data.forEach(function(shop) {
              if (shop.favorite) {
                loginService.setFavoriteShop(shop);
              }
            });
          }
          return response.data;
        }
      }
    },
    'favorite': {
      method: 'POST',
      url: AppConfig.host + '/m/accounts/:accountId/vendors/:shopId/favorite.json'
    },
    'all': {
      method: 'GET',
      isArray: true
    }
  });

})

.factory('Gifts', function($resource, AppConfig) {

  return $resource(AppConfig.host + '/m/accounts/:accountId/gifts.json', {
    accountId: AppConfig.accountId
  }, {
    'query': {
      method: 'GET',
      isArray: true
    }
  });

})

.factory('Tags', function($resource, AppConfig) {

  return $resource(AppConfig.host + '/m/accounts/:accountId/tags.json', {
    accountId: AppConfig.accountId
  }, {
    'query': {
      method: 'GET',
      isArray: true,
      interceptor: {
        'response': function(response) {
          if (response && response.data) {
            response.data.forEach(function(tag) {
              tag.style = { color: tag["color"], 'background-color': tag["background_color"] };
            });
          }
          return response.data;
        }
      }
    }
  });

})

.factory('Games', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/customers_games/:customerGameId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'put': {
      method: 'PUT'
    }
  });
})

.factory('Countries', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/api/countries.json', {}, {
    'query': {
      method: 'GET',
      isArray: true
    },
  });
})


.factory('Beacons', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/beacons/:beaconId.json', {
    accountId: AppConfig.accountId
  }, {
    'events': {
      method: 'GET',
      url: AppConfig.host + '/m/accounts/:accountId/beacons/:beaconId/events.json'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
  });
})

.factory('Device', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/token.json', {
    accountId: AppConfig.accountId
  }, {
    'create': {
      method: 'POST'
    },
    'delete': {
      method: 'DELETE',
      url: AppConfig.host + '/m/accounts/:accountId/devices/:deviceId.json'
    }
  });
})

.factory('Statsmobile', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/statsmobiles/:statsmobileId.json', {
    accountId: AppConfig.accountId
  }, {
    'create': {
      method: 'POST'
    },
  });
})

.factory('Appointments', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/appointments/:appointmentId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'create': {
      method: 'POST'
    },
    'update': {
      method: 'PATCH'
    }
  });
})

.factory('Surveys', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/surveys/:surveyId.json', {
    accountId: AppConfig.accountId
  }, {
    'query': {
      method: 'GET',
      isArray: true
    },
    'create': {
      method: 'POST'
    }
  });
})

.factory('Plannings', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/plannings/:planningId.json', {
    accountId: AppConfig.accountId
  }, {
    'query': {
      method: 'GET',
      isArray: true
    },
    'available': {
      method: 'GET',
      isArray: true,
      url: AppConfig.host + '/m/accounts/:accountId/plannings/:planningId/available.json'
    }
  })
})

.factory('Forms', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/forms/:formId.json', {
    accountId: AppConfig.accountId
  }, {
    'query': {
      method: 'GET',
      isArray: true
    },
    'get': {
      method: 'GET'
    },
    'answer': {
      method: 'POST',
      url: AppConfig.host + '/m/accounts/:accountId/forms/:formId/answer.json'
    }
  })
})


.factory('HappeningsCategories', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/happenings_categories/:happeningsCategoriesId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'delete': {
      method: 'DELETE'
    },
    'follow': {
      method: 'GET',
      url: AppConfig.host + '/m/accounts/:accountId/happenings_categories/:happeningsCategoriesId/follow.json'
    },
    'unfollow': {
      method: 'GET',
      url: AppConfig.host + '/m/accounts/:accountId/happenings_categories/:happeningsCategoriesId/unfollow.json'
    }
  });
})

.factory('Happenings', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/happenings/:happeningsId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'create': {
      method: 'POST'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'update': {
      method: 'PATCH'
    }
  });
})

.factory('Places', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/places/:placeId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'create': {
      method: 'POST'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'update': {
      method: 'PATCH'
    }
  });
})

.factory('ForumsCategories', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/forums_categories/:forumsCategoriesId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'query': {
      method: 'GET',
      isArray: true
    }
  });
})

.factory('ItemsCategories', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/items_categories/:itemsCategoriesId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'query': {
      method: 'GET',
      isArray: true
    }
  });
})

.factory('Items', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/items/:itemsId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'update': {
      method: 'PATCH'
    }
  });
})


.factory('Translations', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/translations', {
    accountId: AppConfig.accountId
  }, {
    'single': {
      method: 'GET',
      url: AppConfig.host + '/m/accounts/:accountId/translations/single.json'
    }
  });
})

.factory('Forums', function($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/forums/:forumsId.json', {
    accountId: AppConfig.accountId
  }, {
    'get': {
      method: 'GET'
    },
    'create': {
      method: 'POST'
    },
    'query': {
      method: 'GET',
      isArray: true
    },
    'delete': {
      method: 'DELETE'
    },
    'follow': {
      method: 'GET',
      url: AppConfig.host + '/m/accounts/:accountId/forums/:forumsId/follow.json'
    },
    'unfollow': {
      method: 'GET',
      url: AppConfig.host + '/m/accounts/:accountId/forums/:forumsId/unfollow.json'
    }
  });
})

.factory('Feedbacks', function ($resource, AppConfig) {
  return $resource(AppConfig.host + '/m/accounts/:accountId/feedbacks', {
    accountId: AppConfig.accountId
  }, {
    'create': {
      method: 'POST',
    },
  });
})

;
