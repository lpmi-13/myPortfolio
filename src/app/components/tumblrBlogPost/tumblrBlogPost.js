'use strict';

var angular = require('angular');
var template = require('./tumblrBlogPost.html');

module.exports = angular.module('myApp.components.tumblrBlogPost', [
])
.directive('myTumblrBlogPost', function (

) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyTumblrBlogPostCtrl as Post',
		replace: true,
		scope: {
			model: '=?'
		},
		link: function (scope, elem, attrs, controller) {
		}
	};
})
.controller('MyTumblrBlogPostCtrl', function (
	$scope
) {
	var Post = this;

	Post.model = $scope.model;

	console.log(Post.model);
});