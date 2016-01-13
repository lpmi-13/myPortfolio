'use strict';

var angular = require('angular');
var template = require('./activity.html');

var activityService = require('../../services/activityService.js');
// sub components
var blogPostComponent = require('../../components/blogPost/blogPost');

module.exports = angular.module('myApp.components.activity', [
	activityService.name,
	blogPostComponent.name
])
.directive('myActivity', function (
	$sce
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyActivityCtrl as ctrl',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, ctrl) {

			scope._getEventSummary = function (eventModel) {
				return $sce.trustAsHtml(eventModel.summary);
			};
		}
	};
})
.controller('MyActivityCtrl', function (
	ActivityService,
	$scope,
	$interval
) {
	var ctrl = this;
	var activityFeed;
	var intervalMilliseconds = 5000;
	var intervalId = $interval(_highlightNextActivity, intervalMilliseconds);
	var currentHighlightedIndex = -1;
	var activitySubscription = ActivityService.feeds.activity.subscribe(_handleFeedSubscriptionUpdated, _handleFeedSubscriptionError);
	$scope.$on('$destroy', _onDestroyed);


	/* ************************************
		EVENT HANDLERS / PRIVATE METHODS
	************************************ */

	function _handleFeedSubscriptionUpdated (feed) {
		activityFeed = feed.sort(function (a, b) {
			return a.__props.timeStamp < b.__props.timeStamp ? 1 : -1;
		});
		window.console.log(feed);
		$scope.$evalAsync();
	}

	function _handleFeedSubscriptionError (error) {
		window.console.error(error);
	}

	function _highlightNextActivity () {
		if (angular.isArray(activityFeed)) {

			currentHighlightedIndex += 1;

			if (!activityFeed[currentHighlightedIndex]) {
				currentHighlightedIndex = 0;
			}
		}
	}

	function _onDestroyed () {
		// activitySubscription.dispose();

		if (intervalId) {
			$interval.cancel(intervalId);
		}
	}

	$scope.getHighlightedItem = function () {
		var item = activityFeed && activityFeed[currentHighlightedIndex];
		console.log(item);
		return item;
	};
});