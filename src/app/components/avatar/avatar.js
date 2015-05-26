'use strict';

var angular = require('angular');
var template = require('./avatar.html');

module.exports = angular.module('myApp.components.avatar', [
	
])
.directive('myAvatar', function (

) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyAvatarCtrl',
		replace: true,
		scope: {
			model: '=?',
			isThumb: '=?',
			isIcon: '=?'
		},
		link: function (scope, elem, attrs, controller) {
		}
	};
})
.controller('MyAvatarCtrl', function (
	$scope
) {

});