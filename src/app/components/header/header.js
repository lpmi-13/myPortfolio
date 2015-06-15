'use strict';

var angular = require('angular');
var template = require('./header.html');
// sub components
var navigationComponent = require('../../components/navigation/navigation');

module.exports = angular.module('myApp.components.header', [
	navigationComponent.name
])
.directive('myHeader', function (
	$location
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyHeaderCtrl',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {
		}
	};
})
.controller('MyHeaderCtrl', function (
	$scope
) {

});