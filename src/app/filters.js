'use strict';

var angular = require('angular');
var $ = require('jquery');

module.exports = angular.module('myApp.filters', [

])
.filter('myInitials', function () {
	
	return function (model) {

		var initials = '';

		if (model && model.name) {
			model.name.split(/ |-/).forEach(function (word) {
				initials = initials + word.charAt(0).toUpperCase();
			});
		}

		return initials;

	};
});