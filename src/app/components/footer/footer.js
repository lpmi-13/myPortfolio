'use strict';

var angular = require('angular');
var template = require('./footer.html');
// sub components
var socialNetworksComponent = require('../../components/socialNetworks/socialNetworks');

module.exports = angular.module('myApp.components.footer', [
	socialNetworksComponent.name
])
.directive('myFooter', function (
	$location
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyFooterCtrl',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {
		}
	};
})
.controller('MyFooterCtrl', function (
	$scope
) {

});