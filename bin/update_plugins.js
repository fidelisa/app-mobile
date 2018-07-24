#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    suspend = require('suspend'),
    resume = suspend.resume,
    xml2js = require('xml2js'),
    parseString = xml2js.parseString;

var setConfigXml = suspend(function*(rootdir) {
  process.stdout.write('update all plugins from ' + rootdir + 'config.xml\n');

  var configXmlPath = path.join(rootdir, 'config.xml');

  var configString = yield fs.readFile(configXmlPath, 'utf8', resume());
  var jsonConfig = yield parseString(configString, resume());

  jsonConfig.widget.plugin.forEach(function(plugin) {
    var name = plugin.$.name;
    var spec = plugin.$.spec;
    if (spec[0] === '~') {
      process.stdout.write('update '+name+'\n');
      var spawnSync = require('child_process').spawnSync;
      process.stdout.write('\tremoving plugin...');
      var sp = spawnSync('cordova', ['plugin', 'rm', name, '--save'], { cwd: rootdir });
      if (sp.stderr && sp.stderr.length>0) process.stdout.write(sp.stderr); else process.stdout.write('done');
      process.stdout.write('\n')
      process.stdout.write('\tadding plugin...');
      var sp = spawnSync('cordova', ['plugin', 'add', name, '--save'], { cwd: rootdir });
      if (sp.stderr && sp.stderr.length>0) process.stdout.write(sp.stderr); else process.stdout.write('done');
      process.stdout.write('\n')
    }
  }) ;


});

setConfigXml('./');
