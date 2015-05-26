'use strict';

var angular = require('angular');
var template = require('./sessionTime.html');



// directive name:
//		namespaceTypeName (examples: wtComponentAvatar or dinoViewDetail )
// 
// template use:
// <namespace:type-name></namespace:type-name> (examples: <wt:component-avatar></wt:component-avatar> or <dino:view-detail></dino:view-detail> )

module.exports = angular.module('myApp.components.sessionTime', [
	
])
.directive('mySessionTime', function (
	$interval
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MySessionTimeCtrl',
		replace: true,
		scope: {
			model: '=?'
		},
		link: function (scope, elem, attrs, controller) {
			scope.secs = 0;

			$interval(function () {
				scope.secs = controller.increaseTime(scope.secs);
			}, 1000);
		}
	};
})
.controller('MySessionTimeCtrl', function (
	$scope
) {
	var self = this;

	this.increaseTime = function (time) {
		return time += 1;
	};
});