var gulp = require('gulp'),
  concat = require('gulp-concat');

// ***************************************
// Js
// ***************************************

gulp.task('build-js', function() {
  return gulp.src([
      'src/js/components/*.js',
      'src/js/app.js',
      'src/js/bootstrap.js',
      'src/js/animations/*.js',
      'src/js/directives/*.js',
      'src/js/controllers/**/*.js',
      'src/js/factories/*.js',
      'src/js/menus/*.js',
      'src/js/providers/*.js',
      'src/js/filters/*.js',
      'src/js/services/*.js'
    ])
    .pipe(concat('app.bundle.js'))
    .pipe(gulp.dest('./www/js'))
});