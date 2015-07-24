
'use strict';

var angular = require('angular');
var angularRoute = require('angular-route');

var localisationService = require('./services/localisationService');
var analyticsService = require('./services/analyticsService');

angular.module('myTestApp', [
	localisationService.name,
	analyticsService.name
])
.config(function (
	$provide
) {
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
) {
	// console.log('running test js');
});