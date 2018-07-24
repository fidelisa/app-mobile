#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var shelljs = require('shelljs/global');

function rmIfExists(options, path) {
  if (test('-e', path)) {
    rm(options, path);
  }
}

module.exports = {
  bower: function(rootdir) {
    var bowerDir = rootdir + '/bower_components';
    var libDir = rootdir + '/www/lib';

    rmIfExists('-rf', libDir );
    mkdir('-p', libDir);

    cp('-f',  bowerDir + '/jquery/dist/jquery.min.js', libDir + '/');
    cp('-f',  bowerDir + '/jquery/dist/jquery.min.map', libDir + '/');
    
    cp('-f',  bowerDir + '/angular-http-auth/src/http-auth-interceptor.js', libDir + '/');
    cp('-f',  bowerDir + '/angular-resource/angular-resource.min.js', libDir + '/');
    cp('-f',  bowerDir + '/angular-resource/angular-resource.min.js.map', libDir + '/');
    cp('-f',  bowerDir + '/d3/d3.min.js', libDir + '/');
    cp('-f',  bowerDir + '/geolib/dist/geolib.min.js', libDir + '/');
    cp('-f',  bowerDir + '/ngCordova/dist/ng-cordova.min.js', libDir + '/');
    cp('-f',  bowerDir + '/ngstorage/ngStorage.min.js', libDir + '/');
    cp('-f',  bowerDir + '/angular-carousel/dist/angular-carousel.min.css', libDir + '/');
    cp('-f',  bowerDir + '/angular-carousel/dist/angular-carousel.min.js', libDir + '/');
    cp('-f',  bowerDir + '/angular-touch/angular-touch.min.js', libDir + '/');
    cp('-f',  bowerDir + '/angular-touch/angular-touch.min.js.map', libDir + '/');
    
    cp('-f',  bowerDir + '/ionic/js/ionic.min.js', libDir + '/');
    cp('-f',  bowerDir + '/ionic/js/ionic-angular.min.js', libDir + '/');
    cp('-f',  bowerDir + '/angular/angular.min.js', libDir + '/');
    cp('-f',  bowerDir + '/angular/angular.min.js.map', libDir + '/');
    cp('-f',  bowerDir + '/angular-animate/angular-animate.min.js', libDir + '/');
    cp('-f',  bowerDir + '/angular-animate/angular-animate.min.js.map', libDir + '/');
    cp('-f',  bowerDir + '/angular-sanitize/angular-sanitize.min.js', libDir + '/');
    cp('-f',  bowerDir + '/angular-sanitize/angular-sanitize.min.js.map', libDir + '/');
    cp('-f',  bowerDir + '/angular-ui-router/release/angular-ui-router.min.js', libDir + '/');


    // * angular-sanitize.js, angular-ui-router.js,
    // * and ionic-angular.js
    // cp('-f',  bowerDir + '/react/react-dom.min.js', libDir + '/');
    // cp('-f',  bowerDir + '/react/react-with-addons.min.js', libDir + '/');
    // cp('-f',  bowerDir + '/react/react.min.js', libDir + '/');

    cp('-f',  bowerDir + '/toastr/toastr.min.js', libDir + '/');
    cp('-f',  bowerDir + '/toastr/toastr.min.css', libDir + '/');
    cp('-f',  bowerDir + '/toastr/toastr.js.map', libDir + '/');


    rmIfExists('-rf', rootdir + '/src/scss/ionic' );
    cp('-rf', bowerDir + '/ionic/scss', rootdir + '/src/scss/ionic');

    cp('-rf', bowerDir + '/ionic/fonts/', libDir+'/fonts');

    cp('-f',  bowerDir + '/ionic-timepicker/dist/ionic-timepicker.bundle.min.js', libDir + '/');
    cp('-f',  bowerDir + '/ionic-datepicker/dist/ionic-datepicker.bundle.min.js', libDir + '/');

    cp('-f',  bowerDir + '/linkifyjs/linkify.min.js', libDir + '/');
    cp('-f',  bowerDir + '/linkifyjs/linkify-string.min.js', libDir + '/');

    cp('-f',  bowerDir + '/angular-gettext/dist/angular-gettext.min.js', libDir + '/');
    cp('-f',  bowerDir + '/angular-dynamic-locale/dist/tmhDynamicLocale.min.js', libDir + '/');
    cp('-f',  bowerDir + '/angular-dynamic-locale/dist/tmhDynamicLocale.min.js.map', libDir + '/');

    cp('-f',  'src/addons/selector/dist/fidelisa-selector.bundle.min.js', libDir + '/');


  }
}
