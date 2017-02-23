'use strict';

var angular = require('angular');
var template = require('./about.html');

// sub components
var headerComponent = require('../../components/header/header');
var footerComponent = require('../../components/footer/footer');
var socialNetworksComponent = require('../../components/socialNetworks/socialNetworks');
var blogComponent = require('../../components/blog/blog');
var contributionActivityComponent = require('../../components/contributionActivity/contributionActivity.js');

module.exports = angular.module('myApp.views.about', [
	headerComponent.name,
	footerComponent.name,
	socialNetworksComponent.name,
	blogComponent.name,
	contributionActivityComponent.name
])
.directive('myViewAbout', function (
) {
	var PLACEHOLDER_IMAGE_SRC = '/images/family_still.jpg';
	var ANIMATED_IMAGE_SRC = '/images/family_animation.gif';

	return {
		restrict: 'E',
		template: template,
		controller: 'MyViewAboutCtrl',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {

			function _loadImages () {
				// The animated gif is expensive (3MB) so initially render the image
				// with a smaller jpg placeholder until we have loaded the gif.
				var animatedImage;
				// set placeholder image src
				scope._familyImageSrc = PLACEHOLDER_IMAGE_SRC;
				// create new image to load gif
				animatedImage = new Image();
				animatedImage.src = ANIMATED_IMAGE_SRC;
				animatedImage.onload = function () {
					// switch the image src to the animated gif
					scope._familyImageSrc = ANIMATED_IMAGE_SRC;
					scope.$digest();
				};
			}

			function _calculateAge (birthday) { // birthday is a date
				var ageDifMs = Date.now() - birthday.getTime();
				var ageDate = new Date(ageDifMs); // miliseconds from epoch
				return Math.abs(ageDate.getUTCFullYear() - 1970);
			}

			scope._harrisonAge = _calculateAge(new Date('2010-07-13T03:20:00'));
			scope._elliotAge = _calculateAge(new Date('2012-07-15T17:30:00'));

			_loadImages();
		}
	};
})
.controller('MyViewAboutCtrl', function (
) {
});