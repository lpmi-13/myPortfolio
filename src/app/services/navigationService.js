'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.navigationService', [
])
.service('NavigationService', function (
	STATE_NAME_ABOUT,
	STATE_NAME_PROJECTS,
	STATE_NAME_PLAY
) {
	return {
		getMainNavItems: function () {
			return [
				{
					title: 'About',
					state: STATE_NAME_ABOUT
				},
				{
					title: 'Projects',
					state: STATE_NAME_PROJECTS
				},
				{
					title: 'Play',
					state: STATE_NAME_PLAY
				},
				{
					title: 'Resume',
					url: 'http://bit.ly/1cGjA8X'
				}
			];
		}
	};
});
