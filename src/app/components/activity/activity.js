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
	// var activitySubscription = ActivityService.feeds.activity.subscribe(_handleFeedSubscriptionUpdated, _handleFeedSubscriptionError);
	ActivityService.getActivity(true).then(_onActivityLoaded).catch(_onActivityLoadedError);
	$scope.$on('$destroy', _onDestroyed);


	/* ************************************
		EVENT HANDLERS / PRIVATE METHODS
	************************************ */

	function _onActivityLoaded (data) {
		window.console.log(data);
		$scope.activity = data.activity;
	}

	function _onActivityLoadedError (exception) {
		$scope.errorMessage = 'Error fetching activity from APIs';
	}

	function _handleFeedSubscriptionUpdated (feed) {
		window.console.log(feed);
	}

	function _handleFeedSubscriptionError (error) {
		window.console.error(error);
	}

	function _onDestroyed () {
		activitySubscription.dispose();
	}
});