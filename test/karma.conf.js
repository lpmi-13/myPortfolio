'use strict';

var istanbul = require('browserify-istanbul');
var isparta	= require('isparta');

module.exports = function(config) {

	config.set({

		basePath: '../',
		frameworks: ['jasmine', 'browserify'],
		preprocessors: {
			'src/app/**/*.js': ['browserify', 'babel', 'coverage'],
			'test/unit/controllers/*.js': ['browserify', 'babel', 'coverage'],
			'test/unit/services/*.js': ['browserify', 'babel', 'coverage']
		},
		browsers: [
			'PhantomJS'
			// , 'Chrome'
		],
		reporters: [
			'spec'
		],

		autoWatch: true,

		browserify: {
			debug: true,
			transform: [
			'bulkify',
			istanbul({
				instrumenter: isparta,
				ignore: ['**/node_modules/**', '**/test/**']
			})
			]
		},
		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		files: [
			// app-specific code
			'src/app/test.js',

			// test files
			'test/unit/controllers/*.js',
			'test/unit/services/*.js'
		],
		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false

	});

};
