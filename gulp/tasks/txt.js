'use strict';

var config      = require('../config');
var changed     = require('gulp-changed');
var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var browserSync = require('browser-sync');

gulp.task('txt', function() {

  return gulp.src(config.txt.src)
    .pipe(changed(config.txt.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.txt.dest))
    .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true, once: true })));

});