'use strict';

var angular = require('angular');
var template = require('./blog.html');
// services
var blogService = require('../../services/blogService');
// sub components
var blogPostComponent = require('../../components/blogPost/blogPost');

module.exports = angular.module('myApp.components.blog', [
	blogService.name,
	blogPostComponent.name
])
.directive('myBlog', function (
) {

	return {
		restrict: 'E',
		template: template,
		controller: 'MyBlogCtrl',
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
.controller('MyBlogCtrl', function (
	$scope,
	BlogService
) {
	var self = this;

	this.getBlogPosts = function (params) {
		return BlogService.getPosts();
	};

});