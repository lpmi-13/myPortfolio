
'use strict';

var angular = require('angular');
var angularRoute = require('angular-route');

var filters = require('./filters');
var localisationService = require('./services/localisationService');

var viewMain = require('./views/main/main');
var viewAbout = require('./views/about/about');
var viewDetail = require('./views/detail/detail');

angularRoute;

angular.module('myApp', [
		filters.name,
		localisationService.name,
		viewMain.name,
		viewAbout.name,
		viewDetail.name,
		'ngRoute'
	])
	.config([
		'$routeProvider', function (
			$routeProvider
		) {
			$routeProvider
				.when('/', { template: '<my:view-main></my:view-main>' })
				.when('/about', { template: '<my:view-about></my:view-about>' })
				.when('/detail/:key', {
					template: function (params) {
						console.log(params);
						return '<my:view-detail data-key="' + params.key + '"></my:view-detail>';
					}
				})
				.otherwise({ redirectTo: '/' });
		}
	])
	.run(function (
		$filter,
		LocalisationService
	) {
		console.log('running!');
		LocalisationService.init('en-GB')
			.then(function () {
				var successMsg = $filter('localise')('myApp_localisationInitSuccess');
				console.log(successMsg.toString());
			})
			.catch(function (err) {
				console.error(err);
			});
	});

console.log('app.js here');