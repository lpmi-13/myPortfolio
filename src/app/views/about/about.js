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