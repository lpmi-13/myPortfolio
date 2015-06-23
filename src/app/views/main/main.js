'use strict';

var angular = require('angular');
var template = require('./main.html');
// services
var projectService = require('../../services/projectService');
// sub components
var headerComponent = require('../../components/header/header');
var footerComponent = require('../../components/footer/footer');
var socialNetworksComponent = require('../../components/socialNetworks/socialNetworks');
var projectSummaryComponent = require('../../components/projectSummary/projectSummary');



// directive name:
//		namespaceTypeName (examples: wtComponentAvatar or dinoViewDetail )
// 
// template use:
// <namespace:type-name></namespace:type-name> (examples: <wt:component-avatar></wt:component-avatar> or <dino:view-detail></dino:view-detail> )

module.exports = angular.module('myApp.views.main', [
	projectService.name,
	headerComponent.name,
	footerComponent.name,
	socialNetworksComponent.name,
	projectSummaryComponent.name
])
.directive('myViewMain', function (
	MyProjectService
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyViewMainCtrl',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {

			controller.getProjects();
		}
	};
})
.controller('MyViewMainCtrl', function (
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