'use strict';

var angular = require('angular');
var template = require('./contributionActivity.html');

var activityService = require('../../services/activityService.js');
// sub components
var blogPostComponent = require('../../components/blogPost/blogPost');

module.exports = angular.module('myApp.components.contributionActivity', [
	activityService.name,
	blogPostComponent.name
])
.directive('myContributionActivity', function (
	$sce
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyContributionActivityCtrl',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {

			scope._getEventSummary = function (eventModel) {
				return $sce.trustAsHtml(eventModel.summary);
			};
		}
	};
})
.controller('MyContributionActivityCtrl', function (
	ActivityService,
	$scope
) {
	ActivityService.getActivity(true).then(_onActivityLoaded).catch(_onActivityLoadedError);
	$scope.$on('$destroy', _onDestroyed);


	/* ************************************
		EVENT HANDLERS / PRIVATE METHODS
	************************************ */

	function _onActivityLoaded (data) {
		$scope.activity = data.activity;
	}

	function _onActivityLoadedError (exception) {
		$scope.errorMessage = 'Error fetching activity from APIs';
		$scope.errorMessageDetails = (exception.message ? exception.message : '');
	}

	function _onDestroyed () {
	}
});