'use strict';

var angular = require('angular');
var template = require('./loadingImage.html');

module.exports = angular.module('myApp.components.loadingImage', [
])
.directive('myLoadingImage', function (
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyLoadingImageCtrl as LoadingImage',
		replace: true,
		scope: {
			url: '=',
			width: '=?',
			height: '=?'
		},
		link: function (scope, elem, attrs, controller) {

			var imageToLoad;
			var imageElem = elem.find('img')[0];
			var imageWidth = imageElem && imageElem.clientWidth;

			function _initImage () {
				scope._imageSrc = null;

				// need to temporarily add height to image while it's loading
				if (scope.width && scope.height) {
					scope._tempImageHeight = Math.round((imageWidth / scope.width) * scope.height) + 'px';
				}

				// create new image to load
				imageToLoad = new Image();
				imageToLoad.src = scope.url;
				imageToLoad.onload = function () {
					scope._imageSrc = scope.url;
					
					if (scope.width && scope.height) {
						scope._tempImageHeight = 'auto';
					}

					scope.$digest();
				};				
			}

			scope.$watch('url', _initImage);
			_initImage();
		}
	};
})
.controller('MyLoadingImageCtrl', function (
	$scope
) {
	var LoadingImage = this;
});