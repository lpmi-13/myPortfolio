'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.navigationService', [
])
.service('NavigationService', function (
) {
	return {
		getMainNavItems: function () {
			return [
				{
					title: 'Projects',
					url: '/#/',
					path: '/'
				},
				{
					title: 'About',
					url: '/#/about',
					path: '/about'
				},
				{
					title: 'Play',
					url: '/#/play',
					path: '/play'
				},
				{
					title: 'Resume',
					url: 'http://bit.ly/1cGjA8X'
				}
			];
		}
	};
});
