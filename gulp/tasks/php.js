'use strict';

var config      = require('../config');
var changed     = require('gulp-changed');
var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var browserSync = require('browser-sync');

gulp.task('php', function() {

  return gulp.src(config.php.src)
    .pipe(changed(config.php.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.php.dest))
    .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true, once: true })));

});