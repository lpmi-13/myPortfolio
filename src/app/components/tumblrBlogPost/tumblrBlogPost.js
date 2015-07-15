'use strict';

var angular = require('angular');
var template = require('./tumblrBlogPost.html');
var loadingImageComponent = require('../../components/loadingImage/loadingImage');

module.exports = angular.module('myApp.components.tumblrBlogPost', [
	loadingImageComponent.name
])
.directive('myTumblrBlogPost', function (
	$sce,
	$timeout
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
	Post.imageModel = Post.model.photos[0].alt_sizes[0];
});