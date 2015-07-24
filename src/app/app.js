
'use strict';

var angular = require('angular');
var angularRoute = require('angular-route');

var filters = require('./filters');
var localisationService = require('./services/localisationService');
var analyticsService = require('./services/analyticsService');

var viewMain = require('./views/main/main');
var viewAbout = require('./views/about/about');
var viewTax = require('./views/tax/tax');
var viewDetail = require('./views/detail/detail');

angular.module('myApp', [
	filters.name,
	localisationService.name,
	analyticsService.name,
	viewMain.name,
	viewAbout.name,
	viewTax.name,
	viewDetail.name,
	'ngRoute'
])
.config(function (
	$routeProvider, $provide
) {
	// handle pages / routing
	$routeProvider
		.when('/', { template: '<my:view-main></my:view-main>' })
		.when('/about', { template: '<my:view-about></my:view-about>' })
		.when('/tax', { template: '<my:view-tax></my:view-tax>' })
		.when('/project/:key', {
			template: function (params) {
				return '<my:view-detail data-key="' + params.key + '"></my:view-detail>';
			}
		})
		.otherwise({ redirectTo: '/' });

	// decorate the $q service with 'allSettled' which unlike 'all' resolves if a promise fails
	$provide.decorator('$q', function($delegate) {
		var $q = $delegate;
		$q.allSettled = function(promises) {
			return $q.all(promises.map(function(promise) {
				return promise.then(function(value) {
					return { state: 'fulfilled', value: value };
				}, function(reason) {
					return { state: 'rejected', reason: reason };
				});
			}));
		};
		return $q;
	});
})
.run(function (
	$filter,
	LocalisationService,
	AnalyticsService
) {
	LocalisationService.init('en-GB')
		.then(function () {
			var successMsg = $filter('localise')('myApp_localisationInitSuccess');
		})
		.catch(function (err) {
			console.error(err);
		});

	AnalyticsService.init();
});