'use strict';

var angular = require('angular');
var template = require('./projectSummary.html');
var avatarComponent = require('../../components/avatar/avatar');

module.exports = angular.module('myApp.components.projectSummary', [
	avatarComponent.name
])
.directive('myProjectSummary', function (

) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyProjectSummaryCtrl as Project',
		replace: true,
		scope: {
			model: '=?'
		},
		link: function (scope, elem, attrs, controller) {
		}
	};
})
.controller('MyProjectSummaryCtrl', function (
	$scope
) {
	var Project = this;

	Project.model = $scope.model;
});