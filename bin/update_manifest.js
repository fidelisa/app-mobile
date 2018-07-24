#!/usr/bin/env node
var shell = require('shelljs');

var config = require('../config/options.json');
var manifest = require('../src/pwa/manifest.json')

var fs = require('fs');

manifest["short_name"] = config.app.name;
manifest["name"] = config.app.title;
manifest["background_color"] = config.colors.base.bgColor;
manifest["theme_color"] = config.colors.base.bgColor;
// manifest["start_url"] = '/' + config.app.accountId + '/index.html';

shell.rm('-f','../www/manifest.json');
fs.writeFileSync('../www/manifest.json', JSON.stringify(manifest));
