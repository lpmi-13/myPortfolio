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
					url: '/#/'
				},
				{
					title: 'About',
					url: '/#/about'
				},
				{
					title: 'Resume',
					url: 'http://bit.ly/1cGjA8X'
				}
			];
		}
	};
});
