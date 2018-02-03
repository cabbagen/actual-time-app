var gulp = require('gulp');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var path = require('path');

// handle the styles
gulp.task('style', function() {
  return gulp.src('./frontend/styles/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, './frontend/styles/base') ]
    }))
    .pipe(cleanCss({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./public/styles/'))
});

// handle javascripts
gulp.task('javascripts', function(callback) {
  pump([
    gulp.src('./frontend/javascript/*.js'),
    uglify(),
    gulp.dest('./public/javascript/')
  ], callback);
});

// handle images
gulp.task('images', function() {
  return gulp.src('./frontend/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/images/'))
});

gulp.watch('./frontend/javascript/*.js', ['javascripts']);

gulp.watch(['./frontend/styles/*.less', './frontend/styles/base/*.less'], ['style']);

gulp.watch('./frontend/images/*', ['images']);

gulp.task('default', ['style', 'javascripts', 'images']);


