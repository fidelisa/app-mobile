// #!/usr/bin/env node
//
var fs = require('fs'),
    path = require('path'),
    suspend = require('suspend'),
    resume = suspend.resume,
    xml2js = require('xml2js'),
    parseString = xml2js.parseString;

var setConfigXml = suspend(function*(rootdir) {
  console.log('Ios: update config.xml: ' + rootdir + '\n');

  var options = require( rootdir + '/www/data/options.json');
  var app = options.app ;

  var configXmlPath = path.join(rootdir, 'config.xml');
//  var configXmlPath = path.join(rootdir, '/platforms/android/res/xml/config.xml');

  var configString = yield fs.readFile(configXmlPath, 'utf8', resume());
  var jsonConfig = yield parseString(configString, resume());

  var goodname = app.name;

  jsonConfig.widget.name = goodname;

  var xmlBuilder = new xml2js.Builder();
  configString = xmlBuilder.buildObject(jsonConfig);

  yield fs.writeFile(configXmlPath, configString, resume());

});

module.exports = function(context) {
    var Q = context.requireCordovaModule('q');
    var deferral = new Q.defer();

    setTimeout(function(){
      setConfigXml(context.opts.projectRoot);
      deferral.resolve();
    }, 1000);

    return deferral.promise;
}
