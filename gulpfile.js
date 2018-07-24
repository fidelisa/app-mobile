var gulp = require('gulp'),
  gutil = require('gulp-util'),
  bower = require('bower'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  minifyCss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  sh = require('shelljs'),
  wrap = require('gulp-wrap'),
  ejs = require("gulp-ejs"),
  fs = require('fs'),
  ext_replace = require('gulp-ext-replace'),
  replace = require('gulp-replace'),
  template = require('gulp-template'),
  download = require("gulp-download"),
  jeditor = require("gulp-json-editor"),
  map = require('map-stream'),
  merge = require('merge-stream'),
  gettext = require('gulp-angular-gettext'),
  clean = require('./bin/clean'),
  eslint = require('gulp-eslint'),
  prettify = require('gulp-jsbeautifier'),
  exec = require('child_process').exec,
  requireDir  = require( 'require-dir' );

var paths = {
  config: ['./options.json'],
  ejs:    ['./ejs/*.ejs'],
  css:    ['config/options.json', './src/scss/**/*.scss'],
  js:     ['config/options.json', './src/js/**/*'],
  pwa:    ['config/options.json', './src/pwa/**/*'],
  html:   ['config/options.json', './src/html/**/*.html'],
  json:   ['config/options.json']
};

function getDataOptions() {
  var data = {};
  var dir = './config_default';
  if (fs.existsSync('./config')) dir = './config';
  data = JSON.parse(fs.readFileSync(dir + '/options.json', 'utf-8'));
  return data;
}

function getDownloadOptions() {
  var json = fs.readFileSync("./options.json", "utf8");
  var loadOpts = JSON.parse(json);

  var options = {
      rejectUnauthorized: false,
      encoding: null,
      headers: {
        'FIDELISA_PROVIDER': loadOpts.provider,
        'FIDELISA_PROVIDER_KEY': loadOpts['provider_key']
      }
  };

  return { load: loadOpts, options: options }

}


// Require all tasks.
requireDir( './gulp/tasks', { recurse: true } );

gulp.task('default', ['watch']);

gulp.task('build-all', ["copy-config", "build-ejs-css", "build-js", "build-html", 'build-pwa']);


gulp.task('copy-config', function() {
  gulp.src('./config/options.json')
    .pipe(gulp.dest('./www/data/'))
});

gulp.task('watch', ['build-all'], function() {
  gulp.watch(paths.css,    ['build-ejs-css']);
  gulp.watch(paths.js,     ['build-js']);
  gulp.watch(paths.pwa,    ['build-pwa']);
  //gulp.watch(paths.js,     ['lint']);
  gulp.watch(paths.html,   ['build-html']);
  gulp.watch(paths.config, ['download-images']);
  gulp.watch(paths.json,   ['copy-config']);

});

//
// Handle scss + css.ejs + css
//
gulp.task('sass', function(done) {
  gulp.src('./src/scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(replace(/"<%/g, '<%'))
    .pipe(replace(/%>"/g, '%>'))
    .pipe(ext_replace('.css.ejs'))
    .pipe(gulp.dest('./ejs'))
    .on('end', done);
});

gulp.task('build-ejs-css', ['sass'], function(done) {
  var data = getDataOptions();

  gulp.src("./ejs/*.css.ejs")
    .pipe(ejs(data, {
      ext: ''
    }).on('error', gutil.log))
    .pipe(gulp.dest("./www/css"))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});


var sortTabs = function() {
  var data = getDataOptions();
  var tabs = [];
  if (!data.menus.sort) {
    data.menus.sort = ["home", "cards", "messages", "facebook", "instagram",
      "shops", "web1", "web2", "web3", "web4", "appointment", "profile"
    ];
  }

  data.menus.sort.forEach(function(tab, idx) {
    var mnu = data.menus[tab.toLowerCase()]
    if (mnu) {
      mnu.name = tab.toLowerCase();
      tabs.push(mnu);
    }
  });

  return tabs
}

// ***************************************
// Config
// ***************************************
gulp.task('download-config', function() {

  var opt = getDownloadOptions();
  var url = opt.load.fidelisa_host+'/api/accounts/'+opt.load.account+'/application.json';

  return download(url, opt.options)
    .pipe(concat('options.json'))
    .pipe(prettify())
    .pipe(gulp.dest("config/"));
});

function downloadImages (cb) {
  exec('bin/downloadImages.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

// ***************************************
// Images
// ***************************************
gulp.task('download-images', ['download-config'], downloadImages);
gulp.task('download-images-only', downloadImages);

// ***************************************
// Html
// ***************************************
var log = function(file, cb) {
  var name = file.path.replace(file.base, '');
  file.template_name = name;
  cb(null, file);
};

gulp.task('prepare-html', function () {

  return gulp.src([
    'src/html/templates/menus/tabs.html',
    'src/html/templates/menus/side.html'
  ])
  .pipe(map(log))
  .pipe(template({
    tabs: sortTabs()
  }))
  .pipe(gulp.dest('src/html/www/menus'))
});


gulp.task('prepare-index-html', function () {
  var data = getDataOptions();

  return gulp.src([
    'src/html/templates/index.html',
  ])
  .pipe(map(log))
  .pipe(template({
    color: data.colors.base.bgColor,
    contents: "<%= contents %>"
  }))
  .pipe(concat('index.html'))
  .pipe(gulp.dest('builds/html/www'))
});

gulp.task('build-html', ['prepare-html', 'prepare-index-html'], function() {
  return gulp.src([
      'src/html/www/**/*.html'
    ])
    .pipe(map(log))
    .pipe(wrap({
      src: 'src/html/templates/script-template.html'
    }))
    .pipe(concat('index.html'))
    .pipe(wrap({
      src: 'builds/html/www/index.html'
    }))
    .pipe(gulp.dest('./www'))
});


// ***************************************
// JS
// ***************************************


// ***************************************
// PWA
// ***************************************
gulp.task('build-sw', function () {
  var data = getDataOptions();

  return gulp.src([
    'src/pwa/sw.js',
  ])
  .pipe(template({
    uuid: data.app.accountId
  }))
  .pipe(gulp.dest('www'))
});

gulp.task('build-pwa', ['build-sw']);





//
// task for ionic-www
//
gulp.task('sim-watch', function() {
  gulp.watch(paths.ejs, ['build-ejs-css']);
});

gulp.task('sim-copy-ejs', function() {
  return gulp.src(paths.ejs)
    .pipe(gulp.dest('../ionic-www/templates/ejs'))
});


gulp.task('serve:before', ['watch', 'build-all']);

//
// Other
//
gulp.task('bower', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('clean-bower', function() {
  return clean.bower('./');
});

gulp.task('install', ['bower', 'clean-bower'], function() {
  return true;
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


gulp.task('lint', () => {
  return gulp.src(['src/js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});



gulp.task('pot', function() {
  return gulp.src(['src/html/**/*.html', 'src/js/**/*.js'])
    .pipe(gettext.extract('template.pot', {
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest('po/'));
});

gulp.task('translations', function() {
  return gulp.src('po/**/*.po')
    .pipe(gettext.compile({
      // options to pass to angular-gettext-tools...
      format: 'javascript'
    }))
    .pipe(concat('languages.js'))
    .pipe(gulp.dest('www/js'));
  // .pipe(gulp.dest('www/js/languages/'));
});
