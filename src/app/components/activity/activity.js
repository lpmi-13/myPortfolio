'use strict';

var angular = require('angular');
var template = require('./activity.html');

var activityService = require('../../services/activityService.js');

module.exports = angular.module('myApp.components.activity', [
	activityService.name
])
.directive('myActivity', function (
	$sce
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyActivityCtrl',
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
.controller('MyActivityCtrl', function (
	ActivityService,
	$scope
) {


	ActivityService.getActivity().then(function (data) {
			console.log(data);

			$scope.activity = data.activity;
		})
		.catch(function (exception) {
			$scope.errorMessage = 'Error fetching activity from APIs';
		});
});