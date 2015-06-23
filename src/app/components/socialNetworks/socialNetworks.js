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
		controller: 'MySocialNetworksCtrl as SocialNetworks',
		replace: true,
		scope: {
			isInline: '=?'
		},
		link: function (scope, elem, attrs, controller) {
		}
	};
})
.controller('MySocialNetworksCtrl', function (
	SocialNetworksService
) {
	var SocialNetworks = this;

	SocialNetworks.socialNetworks = null;

	SocialNetworks.getSocialNetworks = function () {
		return SocialNetworksService.getSocialNetworks();
	};

	SocialNetworks.getSocialNetworks().then(function (socialNetworks) {
		SocialNetworks.socialNetworks = socialNetworks;
	});
});