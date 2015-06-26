'use strict';

var angular = require('angular');
var template = require('./tumblrBlogPost.html');

module.exports = angular.module('myApp.components.tumblrBlogPost', [
])
.directive('myTumblrBlogPost', function (
	$sce
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

			scope._getCaption = function () {
				return $sce.trustAsHtml(scope.model.caption);
			};
		}
	};
})
.controller('MyTumblrBlogPostCtrl', function (
	$scope
) {
	var Post = this;

	Post.model = $scope.model;
});