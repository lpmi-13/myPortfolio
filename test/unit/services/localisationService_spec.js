/*global angular */

'use strict';

var angular = require('angular');
var angularMocks = require('angular-mocks');

// var angular = require('angular');
var localisationService = require('../../../src/app/services/localisationService');


describe('Unit: LocalisationService', function() {

	var service;

 	beforeEach(function() {
		// instantiate the app module
		angular.mock.module('myTestApp');

		// mock the service
		angular.mock.inject(function(LocalisationService) {
			service = LocalisationService;
		});
	});

	it('Service is defined', function () {
		expect(service).toBeDefined();
	});


	it('init() method is type of function', function () {
		expect(typeof service.init).toBe('function');
	});


	it('localise() method is type of function', function () {
		expect(typeof service.localise).toBe('function');
	});

	it('test en-US locale', function () {
		service.init('en-US').then(function () {
			expect(service.localise('localeTestGreeting', { name: 'Brad' })).toEqual('Hey Brad');
		});
	});

	it('test en-GB locale', function () {
		service.init('en-GB').then(function () {
			expect(service.localise('localeTestGreeting', { name: 'Timothy' })).toEqual('Hello Timothy');
		});
	});

});