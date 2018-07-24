angular.module('fidelisa')

.directive('fdTitle', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/title/image.html'
  }
})

.directive('fdTitleString', function(FDI18n){
  return {
    restrict: 'E',
    scope: {
      fdName: '='
    },
    template: function(element, attrs) {
      var title = FDI18n.getTitleString(attrs.fdName);
      return '<div>'+title+'</div>';
    },
    link: function(scope, element, attrs) {
      FDI18n.addEventListener(function() {
        var title = FDI18n.getTitleString(attrs.fdName);
        element.html(title);
      })
    }
  }
})

.directive('fdTab', function(FDI18n) {
  return {
    restrict: 'E',
    transclude: true,

    template: function(element, attrs) {
      var click = "";
      if ( attrs.name.indexOf('web') != -1 ) {
        click = 'ng-click="onMenuTabClick(\''+attrs.name+'\')"'
      }

      return '<ion-tab hidden="{{hideTab(\''+attrs.name+'\')}}"  title="'+FDI18n.getTitleString(attrs.name)+'"'+
            '  fd-title-test="'+attrs.name+'" icon="'+attrs.icon+'" href="#/tab/'+attrs.name+'" '+click+
            ' class="fd-tab-'+attrs.name+'">'+
            '  <ion-nav-view name="tab-'+attrs.name+'"></ion-nav-view>'+
            '</ion-tab>';

    }

  };
})

.directive('fdTitleTest', function(FDI18n) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      FDI18n.addEventListener(function() {
        var title = FDI18n.getTitleString($attrs.fdTitleTest);
        var elementName = '.fd-tab-'+$attrs.fdTitleTest+' > span ';
        var titleElement = angular.element(elementName);
        titleElement.html(title);
      })
    }

  };
})
