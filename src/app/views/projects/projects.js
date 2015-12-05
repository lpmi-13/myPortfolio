'use strict';

var angular = require('angular');
var template = require('./projects.html');
// services
var projectService = require('../../services/projectService');
// sub components
var headerComponent = require('../../components/header/header');
var footerComponent = require('../../components/footer/footer');
var projectSummaryComponent = require('../../components/projectSummary/projectSummary');



// directive name:
//		namespaceTypeName (examples: wtComponentAvatar or dinoViewDetail )
// 
// template use:
// <namespace:type-name></namespace:type-name> (examples: <wt:component-avatar></wt:component-avatar> or <dino:view-detail></dino:view-detail> )

module.exports = angular.module('myApp.views.projects', [
	projectService.name,
	headerComponent.name,
	footerComponent.name,
	projectSummaryComponent.name
])
.directive('myViewProjects', function (
	MyProjectService
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyViewProjectsCtrl',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {

			controller.getProjects();
		}
	};
})
.controller('MyViewProjectsCtrl', function (
	$scope,
	MyProjectService
) {
	var self = this;

	this.getProjects = function (params) {
		return MyProjectService.getAll(params)
			.then(function (projects) {
				$scope.projects = projects;
			})
			.catch(function (err) {
				console.warn('getProjects error', params, err);
			});
	};
});