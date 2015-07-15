'use strict';

var angular = require('angular');
var template = require('./about.html');
// services
var blogService = require('../../services/blogService');
// sub components
var headerComponent = require('../../components/header/header');
var footerComponent = require('../../components/footer/footer');
var tumblrBlogPostComponent = require('../../components/tumblrBlogPost/tumblrBlogPost');
var tweetComponent = require('../../components/tweet/tweet');



// directive name:
//		namespaceTypeName (examples: wtComponentAvatar or dinoViewDetail )
// 
// template use:
// <namespace:type-name></namespace:type-name> (examples: <wt:component-avatar></wt:component-avatar> or <dino:view-detail></dino:view-detail> )

module.exports = angular.module('myApp.views.about', [
	blogService.name,
	headerComponent.name,
	footerComponent.name,
	tumblrBlogPostComponent.name,
	tweetComponent.name
])
.directive('myViewAbout', function (
	$location
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

			controller.getBlogPosts().then(function (posts) {
				scope.blogPosts = posts;
			});

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
	$scope,
	MyProjectService,
	BlogService
) {
	var self = this;

	this.getBlogPosts = function (params) {
		return BlogService.getPosts();
	};

});