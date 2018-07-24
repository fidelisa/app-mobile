angular.module('fidelisa')
.filter('mintohours', function($filter) {
  return function(duration, format) {
    var dd = new Date(duration * 60 * 1000);
    var sFormat = "H'h'mm";
    if (dd.getHours() == 0) {sFormat = "mm 'm'"}
    if (dd.getMinutes() == 0) {sFormat = "H'h'"}
    if (format) {sFormat = format}
    return $filter('date')(dd, sFormat, '+0000');
  };
})
