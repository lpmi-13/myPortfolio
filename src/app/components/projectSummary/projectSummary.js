'use strict';

var angular = require('angular');
var template = require('./projectSummary.html');
var avatarComponent = require('../../components/avatar/avatar');

module.exports = angular.module('myApp.components.projectSummary', [
	avatarComponent.name
])
.directive('myProjectSummary', function (
	$state,
	STATE_NAME_PROJECT
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

			scope._onLinkClicked = function () {
				$state.go(STATE_NAME_PROJECT, {
					projectKey: scope.model.id
				});
			};
		}
	};
})
.controller('MyProjectSummaryCtrl', function (
	$scope
) {
	var Project = this;
	Project.model = $scope.model;
});