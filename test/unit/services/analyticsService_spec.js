/*global angular */

'use strict';

var angular = require('angular');
var angularMocks = require('angular-mocks');

// var angular = require('angular');
var analyticsService = require('../../../src/app/services/analyticsService');


describe('Unit: AnalyticsService', function() {

	var service;

 	beforeEach(function() {
		// instantiate the app module
		angular.mock.module('myTestApp');

		// mock the service
		angular.mock.inject(function(AnalyticsService) {
			service = AnalyticsService;
		});
	});

	it ('Service is defined', function () {
		expect(service).toBeDefined();
	})


	it ('init() method is type of function', function () {
		expect(typeof service.init).toBe('function');
	})

});