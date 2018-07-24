angular
.module('fidelisa')
.directive('fdProgress', function($compile) {
  return function(scope, element, attrs) {
    scope.$watch(
      function() {
        return attrs.type + attrs.levelsPoints;
      },
      function() {
        var type = attrs.type || 'liquid';
        var tpl = '<fd-progress-' + type +
          '  pts-color="{{card.program.points_color}}"' +
          '  color="{{card.next_gift.color}}"' +
          '  bg-color="{{card.program.gauge_color}}"' +
          '  max="{{card.next_gift.floor_points}}"' +
          '  points="{{card.result.points || 0}}"' +
          '  levels-points="{{card.levelsPoints}}"' +
          '  levels-colors="{{card.levelsColors}}"' +
          '>' +
          '</fd-progress-' + type + '>';

        element.html(tpl);

        $compile(element.contents())(scope);
      }
    );
  };
})

.directive('fdSlotgame', function() {
  return {
    restrict: 'E',
    replace: true,
    controller: function($scope) {
      var images = $scope.images = [];
      this.addSlotImage = function(slotImage) {
        images.push(slotImage);
      };
    },
    template: function() {
      return '' +
        '<div class="sg-base">' +
        '    <fd-slotimage anim="1"></fd-slotimage>' +
        '    <fd-slotimage anim="2"></fd-slotimage>' +
        '    <fd-slotimage anim="3"></fd-slotimage>' +
        '    <img class="sg-bg" src="img/slot_bg.png">' +
        '</div>'
    },
    scope: {
      fdWin: '@',
      fdPlay: '@',
      ended: '&fdEndedGame',
      fdBgImage: '@'
    }
  };
})

.directive('fdSlotimage', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^fdSlotgame',
    template: function(element, attrs) {
      var pos = attrs.anim || "1";
      return '<div class="sg-img sg-pos' + pos + ' sg-border' + pos + '"></div>';
    },

    link: function(scope, element, attrs, slotGameCtrl) {
      var anim = attrs.anim || "1";

      element.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function() {
        scope.$emit('fidelisa:endedGame', {});
      });

      scope.$watch('fdPlay', function(newValue) {
        if (newValue === "true") {
          var animCode = scope.fdWin === "true" ? "" : "0";
          element.addClass("sg-anim" + anim + animCode).removeClass("sg-pos" + anim);
        } else {
          element.removeClass("sg-anim1 sg-anim2 sg-anim3 sg-anim10 sg-anim20 sg-anim30").addClass("sg-pos" + anim);
        }
      });

      scope.$watch('fdBgImage', function(newValue) {
        element.attr('style', 'background-image:url(' + newValue + ')')
      });

      slotGameCtrl.addSlotImage(scope);
    }
  };
})

.directive('fdProgressLiquid', function($window) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      bgColor: '@',
      ptsColor: '@',
      color: '@',
      value: '@',
      max: '@',
      levelsColors: '@',
      levelsPoints: '@',
      points: '@'
    },
    controller: function($scope) {
      function update() {
        var config = $window.liquidFillGaugeDefaultSettings();
        config.circleThickness = 0.1;
        config.circleColor = $scope.bgColor;
        config.textColor = $scope.ptsColor;
        config.waveTextColor = $scope.ptsColor;
        config.waveColor = $scope.color;
        config.textVertPosition = 0.62;
        config.waveAnimateTime = 2000;
        // config.waveHeight = 0;
        config.textSize = 0.7;
        config.minValue = 0;
        config.maxValue = $scope.max;
        config.displayPercent = false;
        config.secondeLine = "points";
        $window.loadLiquidFillGauge($scope.elementId, $scope.points, config);
      }

      var watchArray = ['bgColor', 'ptsColor', 'color', 'value', 'max',
        'levelsColors', 'levelsPoints'
      ];
      $scope.$watchGroup(watchArray, function() {
        update();
      });

      $scope.$on('$fidelisa:refreshGauge', function() {
        update();
      });
    },
    template: function() {
      return '<svg width="240px" height="240px"></svg>';
    },
    link: function(scope, element) {
      element[0].id = $window.generateRandomId(5);
      scope.elementId = element[0].id;
    }
  };
})


.directive('fdProgressCircle', function($window) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      bgColor: '@',
      ptsColor: '@',
      color: '@',
      value: '@',
      max: '@',
      levelsColors: '@',
      levelsPoints: '@',
      points: '@'
    },
    controller: function($scope) {
      function update() {
        var config = $window.circleGaugeDefaultSettings();
        config.circleThickness = 0.30;
        config.circleColor = $scope.bgColor;
        config.textColor = $scope.ptsColor;
        config.gaugeColor = $scope.color;
        config.textVertPosition = 0.72;
        config.waveAnimateTime = 2000;
        // config.waveHeight = 0;
        config.textSize = 0.7;
        config.minValue = 0;
        config.maxValue = $scope.max;
        config.displayPercent = false;
        config.secondeLine = "points";
        $window.loadCircleGauge($scope.elementId, $scope.points, config);
      }

      var watchArray = ['bgColor', 'ptsColor', 'color', 'value', 'max',
        'levelsColors', 'levelsPoints'
      ];
      $scope.$watchGroup(watchArray, function() {
        update();
      });

      $scope.$on('$fidelisa:refreshGauge', function() {
        update();
      });
    },
    template: function() {
      return '<svg width="240px" height="240px"></svg>';
    },
    link: function(scope, element) {
      element[0].id = $window.generateRandomId(5);
      scope.elementId = element[0].id;
    }
  };
})

.directive('fdProgressPile', function($window) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      bgColor: '@',
      ptsColor: '@',
      color: '@',
      value: '@',
      max: '@',
      levelsColors: '@',
      levelsPoints: '@',
      points: '@'
    },
    controller: function($scope) {
      function update() {
        var config = $window.pileGaugeDefaultSettings();
        config.circleThickness = 0.30;
        config.circleColor = $scope.bgColor;
        config.textColor = $scope.ptsColor;
        config.gaugeColor = $scope.color;
        config.textVertPosition = 0.72;
        config.waveAnimateTime = 2000;
        // config.waveHeight = 0;
        config.textSize = 0.7;
        config.minValue = 0;
        config.levelsPoints = $scope.levelsPoints.split('|');
        config.levelsColors = $scope.levelsColors.split('|');
        config.maxValue = config.levelsPoints[config.levelsPoints.length - 1];
        config.displayPercent = false;
        config.secondeLine = "points";
        $window.loadPileGauge($scope.elementId, $scope.points, config);
      }

      var watchArray = ['bgColor', 'ptsColor', 'color', 'value', 'max',
        'levelsColors', 'levelsPoints', 'points'
      ];

      $scope.$watchGroup(watchArray, function() {
        update();
      });

      $scope.$on('$fidelisa:refreshGauge', function() {
        update();
      });
    },
    template: function() {
      return '<svg width="240px" height="240px"></svg>';
    },
    link: function(scope, element) {
      element[0].id = $window.generateRandomId(5);
      scope.elementId = element[0].id;
    }
  };
})

.directive('fdProgressCircleTotal', function($window) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      bgColor: '@',
      ptsColor: '@',
      color: '@',
      value: '@',
      max: '@',
      levelsColors: '@',
      levelsPoints: '@',
      points: '@'
    },
    controller: function($scope) {
      function update() {
        var config = $window.circleTotalGaugeDefaultSettings();
        config.circleThickness = 0.30;
        config.circleColor = $scope.bgColor;
        config.textColor = $scope.ptsColor;
        config.gaugeColor = $scope.color;
        config.textVertPosition = 0.72;
        config.waveAnimateTime = 2000;
        // config.waveHeight = 0;
        config.textSize = 0.7;
        config.minValue = 0;
        config.levelsPoints = $scope.levelsPoints.split('|');
        config.levelsColors = $scope.levelsColors.split('|');
        config.maxValue = config.levelsPoints[config.levelsPoints.length - 1];
        config.displayPercent = false;
        config.secondeLine = "points";
        $window.loadCircleTotalGauge($scope.elementId, $scope.points, config);
      }

      var watchArray = ['bgColor', 'ptsColor', 'color', 'value', 'max',
        'levelsColors', 'levelsPoints', 'points'
      ];

      $scope.$watchGroup(watchArray, function() {
        update();
      });

      $scope.$on('$fidelisa:refreshGauge', function() {
        update();
      });
    },
    template: function() {
      return '<svg width="240px" height="240px"></svg>';
    },
    link: function(scope, element) {
      element[0].id = $window.generateRandomId(5);
      scope.elementId = element[0].id;
    }
  };
})


.directive('fdFbLike', function() {
  return {
    restrict: 'E',
    scope: {
      fbId: '=',
      fbUrl: '='
    },
    controller: function($scope, $window) {
      $scope.openFB = function() {
        var url;
        if ($scope.fbUrl) {
          url = $scope.fbUrl;
        } else {
          url = 'https://www.facebook.com/profile/' + $scope.fbId;
        }
        if ($window.cordova && $window.cordova.platformId !== "browser") {
          url = url.replace('https://', 'fb://').replace('http://', 'fb://');
        }
        var ref = $window.open(url, '_system')
        ref.addEventListener('loadstart', function(event) {
          alert(event.type + ' - ' + event.url);
        });
        ref.addEventListener('loadstop', function(event) {
          alert(event.type + ' - ' + event.url);
        });
        ref.addEventListener('loaderror', function(event) {
          alert(event.type + ' - ' + event.url + ' - ' + event.code + ' - ' + event.message);
        });
        ref.addEventListener('exit', function(event) {
          alert(event.type);
        });

      };
    },
    template: '<button class="button fb-cnx" ng-click="GotoLink(\'{{msg.fbUrl}}\')">' +
      '<i class="icon ion-social-facebook"></i>J\'aime</button>'
  }
})

.directive('fdOpen', function() {
  return {
    restrict: 'A',
    scope: {
      fdOpen: '='
    },
    controller: function($scope, $window) {
      $scope.fdOpenUrl = function() {
        $window.open($scope.fdOpen, '_system')
      };
    }
  }
})

.directive('fdDotText', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      value: '@',
      bgColor: '@',
      color: '@',
      fdWidth: '@',
      fdHeight: '@',
      textSize: '@',
      fontFamily: '@'
    },
    controller: function($scope, $window) {
      function initial(data) {
        var first = data.first_name[0] || "";
        var last = data.last_name[0] || "";
        return first + last;
      }
      function update() {
        var config = $window.defaultLoadDotText();
        config.bgColor = $scope.bgColor;
        config.color = $scope.color;
        config.width = $scope.fdWidth || 40;
        config.height = $scope.fdHeight || 40;
        config.textSize = $scope.textSize || 1;
        config.fontFamily = $scope.fontFamily;
        if ($scope.value === '\uf3be') {
          config.fontFamily = "Ionicons";
        }
        var value = $scope.value;
        if (value && value.hasOwnProperty("first_name")) {
          value = initial(value) ;
        }
        $window.loadDotText($scope.elementId, value, config);
      }
      $scope.$watch('value', function() {
        update();
      });
    },
    template: function(element, attrs) {
      var width = attrs.fdWidth || 40;
      var height = attrs.fdHeight || 40;
      return '<svg width="' + width + 'px" height="' + height + 'px"></svg>';
    },
    link: function(scope, element) {
      scope.elementId = element[0];
    }
  };
})

.directive('fdBgStyle', function() {
  return {
    restrict: 'A',
    scope: {
      fdBgStyle: '='
    },
    controller: function($scope, $element) {
      $scope.$watch('fdBgStyle', function() {
        if (angular.isDefined($scope.fdBgStyle)) {
          $element.css('background-image', 'url(' + $scope.fdBgStyle + ')');
        }
      })
    }
  }
})

.directive('fdD', function() {
  return {
    restrict: 'A',
    controller: function($scope, $element) {
      $scope.$watch('path', function(newValue) {
        $element.attr('d', newValue);
      });
    }
  };
})

.directive('fdImageSrc', function() {
  return {
    restrict: 'A',
    scope: {
      fdImageSrc: '@',
      fdImageSize: '@'
    },
    controller: function($scope, $element, AppConfig) {
      $scope.$watch('fdImageSrc', function(newValue) {
        if ( angular.isDefined(newValue) && newValue !== '') {
          var url = AppConfig.host + '/api/images/' + newValue + '?static=t';
          if (angular.isDefined($scope.fdImageSize)) {
            url = url + '&height=' + $scope.fdImageSize;
          }

          $element.attr('src', url);
        } else {
          $element.attr('src', "");
        }

      });
    }
  };
})

.directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&'
    },
    link: function(scope, element) {
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) {
            element[0].blur();
          }
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
})

.directive('map', function($window) {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function($scope, $element) {
      function initialize() {
        var mapOptions = {
          center: new $window.google.maps.LatLng(43.07493, -89.381388),
          zoom: 16,
          mapTypeId: $window.google.maps.MapTypeId.ROADMAP
        };
        var map = new $window.google.maps.Map($element[0], mapOptions);

        $scope.onCreate({
          map: map
        });

        // Stop the side bar from dragging when mousedown/tapdown on the map
        $window.google.maps.event.addDomListener($element[0], 'mousedown', function(e) {
          e.preventDefault();
          return false;
        });
      }

      if (document.readyState === "complete") {
        initialize();
      } else {
        $window.google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  }
})

.directive('iframeOnload', function() {
  return {
    scope: {
      callBack: '&iframeOnload'
    },
    link: function(scope, element) {
      element.on('load', function() {
        return scope.callBack();
      })
    }
  }
})

.directive('standardTimeMeridian', function() {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      etime: '=etime',
      hours: '=hours'
    },
    template: "<strong>{{stime}}</strong>",
    link: function(scope) {

      scope.stime = epochParser(scope.etime, 'time');

      function prependZero(param) {
        if (String(param).length < 2) {
          return "0" + String(param);
        }
        return param;
      }

      function epochParser(val, opType) {
        if (val === null) {
          return "00:00";
        } else {
          var meridian = ['AM', 'PM'];

          if (opType === 'time') {
            var hours = parseInt(val / 3600);
            var minutes = (val / 60) % 60;
            if (scope.hours) {
              var hoursRes = hours > 12 ? (hours - 12) : hours;
              var currentMeridian = meridian[parseInt(hours / 12)];
              return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
            } else {
              return (prependZero(hours) + ":" + prependZero(minutes));
            }
          }
        }
      }

      scope.$watch('etime', function() {
        scope.stime = epochParser(scope.etime, 'time');
      });

    }
  };
})

.directive('fdFloatButton', function(AppConfig) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      click: '&fdClick'
    },

    link: function(scope, element) {
      var colors = AppConfig.colors;
      var color = colors.button.bgColor;
      var bgcolor = colors.button.bgColor;
      if ( colors.addButton )   {
        if (colors.addButton.color ) {
          color = colors.addButton.color;
        }
        if ( colors.addButton.bgColor )   {
          bgcolor = colors.addButton.bgColor;
        } 
      } 

      var canvas = element[0];
      if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(100, 100, 100, 0, Math.PI * 2, true);

        ctx.fillStyle = bgcolor;
        ctx.fill() ; 

        ctx.fillStyle = color;
        ctx.fillRect(93, 40, 14, 120);
        ctx.fillRect(40, 93, 120, 14);
        
      }
    },

    templateUrl: 'templates/components/fd/float_button.html'
  }
});
