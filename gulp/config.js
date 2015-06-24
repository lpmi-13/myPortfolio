'use strict';

module.exports = {

  'serverport': 8089,

  'styles': {
    'watch' : 'src/app/**/*.scss',
    'src' : 'src/app/sass/app.scss',
    'dest': 'build/css'
  },

  'scripts': {
    'src' : 'src/app/**/*.js',
    'dest': 'build/js'
  },

  'php': {
    'src' : 'src/server/**/*.php',
    'dest': 'build/server'
  },

  'txt': {
    'src' : 'src/**/*.txt',
    'dest': 'build'
  },

  'images': {
    'src' : 'src/images/**/*',
    'dest': 'build/images'
  },

  'fonts': {
    'src' : ['src/fonts/**/*'],
    'dest': 'build/fonts'
  },

  'views': {
    'watch': [
      'src/**/*.html'
    ],
    'src': '/src/**/*.html',
    'dest': 'src/js'
  },

  'gzip': {
    'src': 'build/**/*.{html,xml,json,css,js,js.map}',
    'dest': 'build/',
    'options': {}
  },

  'dist': {
    'root'  : 'build'
  },

  'browserify': {
    'entries'   : ['./src/app/app.js'],
    'bundleName': 'the.js',
    'sourcemap' : true
  },

  'test': {
    'karma': 'test/karma.conf.js',
    'protractor': 'test/protractor.conf.js'
  }

};
