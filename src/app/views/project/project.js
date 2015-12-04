'use strict';

var angular = require('angular');
var template = require('./project.html');
// services
var projectService = require('../../services/projectService');
// sub components
var headerComponent = require('../../components/header/header');
var footerComponent = require('../../components/footer/footer');
var avatarComponent = require('../../components/avatar/avatar');



// directive name:
//		namespaceTypeName (examples: wtComponentAvatar or dinoViewDetail )
// 
// template use:
// <namespace:type-name></namespace:type-name> (examples: <wt:component-avatar></wt:component-avatar> or <dino:view-project></dino:view-project> )

module.exports = angular.module('myApp.views.project', [
	projectService.name,
	headerComponent.name,
	footerComponent.name,
	avatarComponent.name
])
.directive('myViewProject', function (
	MyProjectService
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyViewProjectCtrl as Project',
		replace: true,
		scope: {
			key: '='
		},
		link: function (scope, elem, attrs, controller) {
		}
	};
})
.controller('MyViewProjectCtrl', function (
	$sce,
	$scope,
	$stateParams,
	MyProjectService
) {
	var Project = this;

	Project.getTestimonialQuoteHtml = function () {
		var testimonial = Project.details && Project.details.testimonial;

		if (!testimonial) {
			return null;
		}

		return $sce.trustAsHtml(testimonial.html);
	};

	Project.getTestimonialAuthor = function () {
		var testimonial = Project.details && Project.details.testimonial;

		if (!testimonial) {
			return null;
		}

		return testimonial.author;
	};

	Project.getDetails = function (id) {
		Project.message = null;
		return MyProjectService.get(id)
			.then(function (details) {
				Project.details = details;
				// console.log('retrieved', $scope.details);
			})
			.catch(function (err) {
				Project.error = 'Sorry, the project cannot be found';
				console.warn('getDetails error', id, err);
			});
	};

	Project.key = $stateParams.projectKey;
	Project.getDetails(Project.key);
});