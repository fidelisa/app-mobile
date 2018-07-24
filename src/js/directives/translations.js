angular.module('fidelisa')

  .directive('fdTranslate', function($compile, $animate, Translations) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        scope.$watch(function() {
            return element.html();
        },
        function () {
          Translations.single({
            'tl': 'en',
            'q': element.html()
          }, function(data) {
            element.html(data.translatedText);
          });

        });
      }

    }
  })
