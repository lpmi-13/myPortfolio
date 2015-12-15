'use strict';

var angular = require('angular');
var template = require('./blogPost.html');
var loadingImageComponent = require('../../components/loadingImage/loadingImage');

module.exports = angular.module('myApp.components.blogPost', [
	loadingImageComponent.name
])
.directive('myBlogPost', function (
	$sce,
	$timeout
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyBlogPostCtrl as Post',
		replace: true,
		scope: {
			model: '=?'
		},
		link: function (scope, elem, attrs, controller) {

			scope._getCaption = function () {
				return $sce.trustAsHtml(scope.model.__props.html.caption);
			};

			scope._getPostInfo = function () {
				return $sce.trustAsHtml(scope.model.__props.html.postInfo);
			};
		}
	};
})
.controller('MyBlogPostCtrl', function (
	$scope
) {
	var Post = this;
	Post.model = $scope.model;
});