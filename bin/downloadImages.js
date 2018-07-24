#!/usr/bin/env node
var shell = require('shelljs');

var config = require('../config/options.json');

var host = config.app.host;

var fs = require('fs'),
    request = require('request');

var download = function(uri, filename){
  return new Promise(function (resolve) {
    console.log('Download '+uri+' to '+filename);
    request.head(uri, function(err, res, body){
      // console.log('content-type:', res.headers['content-type']);
      // console.log('content-length:', res.headers['content-length']);
      request(uri).pipe(fs.createWriteStream(filename)).on('close', function() {
        console.log("Done")
        resolve();
      });
    });
  });
};

shell.mkdir('-p', 'www/img/icons');

shell.rm('-f', 'www/img/logo*.png');
shell.rm('-f', 'www/img/icons/*.*');
if (config.app.iconId) {
  download(host+'/api/images/'+config.app.iconId+'.png?static=t', 'www/img/logo.png');
  download(host+'/api/images/'+config.app.iconId+'.png?height=180', 'www/img/logo180.png');
  download(host+'/api/images/'+config.app.iconId+'.png?height=96', 'www/launcher-icon-1x.png');
  download(host+'/api/images/'+config.app.iconId+'.png?height=192', 'www/launcher-icon-2x.png');
  download(host+'/api/images/'+config.app.iconId+'.png?height=512', 'www/launcher-icon-4x.png');
}

if (config.icons) {
  config.icons.forEach(function(icon) {
    download(host+'/api/images/'+icon.name+'?static=t', 'www/img/icons/'+icon.name);
  })
}
if (config.colors.imageBgId) {
  download(host+'/api/images/'+config.colors.imageBgId+'?static=t', 'www/img/background.png');  
}

if (config.app.splashId) {
  download(host+'/api/images/'+config.app.splashId+'?height=512', 'www/splash.png');  
}
