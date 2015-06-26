
'use strict';

var angular = require('angular');
var angularRoute = require('angular-route');

var filters = require('./filters');
var localisationService = require('./services/localisationService');
var analyticsService = require('./services/analyticsService');

var viewMain = require('./views/main/main');
var viewAbout = require('./views/about/about');
var viewDetail = require('./views/detail/detail');

angularRoute;

angular.module('myApp', [
	filters.name,
	localisationService.name,
	analyticsService.name,
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
			.when('/project/:key', {
				template: function (params) {
					return '<my:view-detail data-key="' + params.key + '"></my:view-detail>';
				}
			})
			.otherwise({ redirectTo: '/' });
	}
])
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