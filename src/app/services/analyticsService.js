'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.analyticsService', [
])
.service('AnalyticsService', function (
	$location,
	$rootScope,
	$window
) {
	var googleAnalytics = $window.ga;

	function _trackPageView () {
		// use the ga google analytics object
		var pageUrl = $location.url();
		window.console.log(pageUrl);
		googleAnalytics('send', 'pageview', pageUrl);
	}

	function _init () {
		// track page views
		$rootScope.$on('$routeChangeSuccess', _trackPageView);
	}

	return {
		init: _init
	};
});
