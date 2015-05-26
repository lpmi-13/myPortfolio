'use strict';

module.exports = {

  'serverport': 8089,

  'styles': {
    'src' : 'src/app/sass/**/*.scss',
    'dest': 'build/css'
  },

  'scripts': {
    'src' : 'src/app/**/*.js',
    'dest': 'build/js'
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
    'dest': 'app/js'
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
    'bundleName': 'main.js',
    'sourcemap' : true
  },

  'test': {
    'karma': 'test/karma.conf.js',
    'protractor': 'test/protractor.conf.js'
  }

};
