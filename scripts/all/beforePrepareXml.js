
var fs = require('fs'),
    path = require('path'),
    suspend = require('suspend'),
    resume = suspend.resume,
    xml2js = require('xml2js'),
    parseString = xml2js.parseString;

var setConfigXml = suspend(function*(rootdir) {
  process.stdout.write('update config.xml: ' + rootdir + '\n');

  var options = require( rootdir + '/www/data/options.json');
  options.prefix_id = options.prefix_id || 'com.fidelisa.app';

  var app = options.app ;

  var configXmlPath = path.join(rootdir, 'config.xml');

  var configString = yield fs.readFile(configXmlPath, 'utf8', resume());
  var jsonConfig = yield parseString(configString, resume());

  // var goodname = app.name ; //.replace(/'/g, " ");

  // jsonConfig.widget.name = goodname || "Fidelisa";
  jsonConfig.widget.description = app.description || "Fidelisa app";

  if (app.author) {
    jsonConfig.widget.author[0]._ = app.author.value;
    jsonConfig.widget.author[0].$.email = app.author.email;
    jsonConfig.widget.author[0].$.href = app.author.href;
  } else {
    jsonConfig.widget.author[0]._ = "Fidelisa team";
    jsonConfig.widget.author[0].$.email = "contact@fidelisa.com";
    jsonConfig.widget.author[0].$.href = "www.fidelisa.com";
  }

  // if (app.uuid) {
  //   jsonConfig.widget.$.id = options.prefix_id+app.uuid;
  // }

  if (app.next_version) {
    jsonConfig.widget.$.version = app.next_version.version;
    jsonConfig.widget.$["android-versionCode"] = (app.next_version.version_code || "1");
    jsonConfig.widget.$["CFBundleVersion"] = (app.next_version.version || "1");
  } else {
    jsonConfig.widget.$.version = "0.0.1";
    jsonConfig.widget.$["android-versionCode"] = "1";
    jsonConfig.widget.$["CFBundleVersion"] = "1";
  }

  jsonConfig.widget.access = [];
  jsonConfig.widget.access.push({"$":{"origin":"*"}});
  jsonConfig.widget.access.push({"$":{"origin":"http://*"}});
  jsonConfig.widget.access.push({"$":{"origin":"https://*"}});
  jsonConfig.widget.access.push({"$":{"origin":"tel://*", "launch-external":"yes"}});
  jsonConfig.widget.access.push({"$":{"origin":"geo://*", "launch-external":"yes"}});
  jsonConfig.widget.access.push({"$":{"origin":"mailto://*", "launch-external":"yes"}});
  jsonConfig.widget.access.push({"$":{"origin":"sms://*", "launch-external":"yes"}});
  jsonConfig.widget.access.push({"$":{"origin":"market://*", "launch-external":"yes"}});

  jsonConfig.widget.platform.forEach(function(platform) {
    if (platform.splash) {
      var newSplash = []

      platform.splash.forEach(function(splash) {
        if (!splash.$.src.includes('land') && !splash.$.src.includes('Landscape')) {
          newSplash.push(splash);
        }
      });
      platform.splash = newSplash;
    }
  })

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
