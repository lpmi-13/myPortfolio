'use strict';

var angular = require('angular');
var template = require('./main.html');
// services
var projectService = require('../../services/projectService');
// sub components
var navigationComponent = require('../../components/navigation/navigation');
var avatarComponent = require('../../components/avatar/avatar');



// directive name:
//		namespaceTypeName (examples: wtComponentAvatar or dinoViewDetail )
// 
// template use:
// <namespace:type-name></namespace:type-name> (examples: <wt:component-avatar></wt:component-avatar> or <dino:view-detail></dino:view-detail> )

module.exports = angular.module('myApp.views.main', [
	projectService.name,
	navigationComponent.name,
	avatarComponent.name
])
.directive('myViewMain', function (
	MyProjectService,
	$location
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

			scope._onRowClicked = function (project) {
				$location.path('project/' + project.id);
			};

			// silly chaining but good test!!

			// controller.getProjects()
			// 	.then(function (origProjectsData) {
			// 		console.log('origProjects ', origProjectsData);
					
			// 		controller.getProject(1001)
			// 			.then(function (getProjectData) {
			// 				console.log('getProject ', getProjectData);

			// 				controller.updateProject(getProjectData.data._id, {
			// 						extras: 'I like armadillos'
			// 					})
			// 					.then(function (updateProjectData) {
			// 						console.log('updateProject ', updateProjectData);

			// 						controller.createProject({
			// 								name: 'Newbie',
			// 								where: 'No-where'
			// 							})
			// 							.then(function (createProjectData) {
			// 								console.log('createProject ', createProjectData);

			// 								controller.getProjects()
			// 									.then(function (getProjectsData) {
			// 										console.log('getProjects ', getProjectsData);
													
			// 										MyProjectService.delete(1001)
			// 											.then(function (deleteData) {
			// 												console.log('MyProjectService.delete ', deleteData);

			// 												controller.getProjects()
			// 													.then(function (getProjectsAfterDeleteData) {
			// 														console.log('getProjects ', getProjectsAfterDeleteData);
			// 													});
			// 											})
			// 											.catch(function (err) {
			// 												console.warn('MyProjectService.delete error', 1001, err);
			// 											});
			// 									});
			// 							});

			// 					});
			// 			});
			// 	});
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