'use strict';

var angular = require('angular');
var template = require('./navigation.html');

var navigationService = require('../../services/navigationService');

module.exports = angular.module('myApp.components.navigation', [
	navigationService.name
])
.directive('myNavigation', function (
	$location,
	NavigationService
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyNavigationCtrl',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {
			scope.items = NavigationService.getMainNavItems();

			scope._getIsSelected = function (item) {
				return Boolean(item.path === $location.path());
			};
		}
	};
})
.controller('MyNavigationCtrl', function (
	$scope
) {

});