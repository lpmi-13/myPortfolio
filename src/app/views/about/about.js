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

			_loadImages();
		}
	};
})
.controller('MyViewAboutCtrl', function (
) {
});