angular
  .module('fidelisa')
  .animation('.slide-gifts', function() {
    var time = 500;
    return {
      // make note that other events (like addClass/removeClass)
      // have different function input parameters
      enter: function(element, doneFn) {
        angular.element(element).fadeIn(time, doneFn);

        // remember to call doneFn so that angular
        // knows that the animation has concluded
      },

      move: function(element, doneFn) {
        angular.element(element).fadeIn(time, doneFn);
      },

      leave: function(element, doneFn) {
        angular.element(element).fadeOut(time, doneFn);
      }
    }
  });
