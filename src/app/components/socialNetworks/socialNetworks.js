'use strict';

var angular = require('angular');
var template = require('./socialNetworks.html');
var socialNetworksService = require('../../services/socialNetworksService');

module.exports = angular.module('myApp.components.socialNetworks', [
	socialNetworksService.name
])
.directive('mySocialNetworks', function (
	$sce
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MySocialNetworksCtrl',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {

			controller.getSocialNetworks().then(function (socialNetworks) {
				scope.socialNetworks = socialNetworks;
			});
		}
	};
})
.controller('MySocialNetworksCtrl', function (
	SocialNetworksService
) {
	this.getSocialNetworks = function () {
		return SocialNetworksService.getSocialNetworks();
	};
});