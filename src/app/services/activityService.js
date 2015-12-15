'use strict';

var angular = require('angular');
var Rx = require('rx');

var twitterService = require('./twitterService.js');
var githubService = require('./githubService.js');

module.exports = angular.module('myApp.services.activityService', [
	twitterService.name,
	githubService.name
])
.service('ActivityService', function (
	$q,
	$http,
	$filter,
	GithubService
) {
	var mActivityFeed = Rx.Observable.create(function (observer) {

		var feed = ['A lovely quote', 'Interesting tweet', 'A git commit...'];
		var feedIndex = 0;
		var updateIntervalSeconds = 1;

		var intervalId = window.setInterval(function () {
			try {

				feedIndex++;

				if (!feed[feedIndex]) {
					feedIndex = 0;
				}

				// Call this to update the feed
				observer.onNext(feed[feedIndex]);

				// If we are completeing the feed (?), call this
				// observer.onCompleted();
			} catch (error) {
				observer.onError(error);
			}

		}, updateIntervalSeconds * 1000);

		// TODO: lets get all my tweets and git hub activity, and then every 5 seconds
		// update the feed with a new random message and mayeb a random quote thrown in

		api.getActivity(true).then(function (data) {
			feed = feed.concat(data.activity.map(function (eventModel) {
				return eventModel;
			}));
		});

		return function () {
			window.console.log('Activity feed - observer - disposal called');
			clearInterval(intervalId);
		};
	});

	var api = {
		getActivity: function (useCache) {
			return GithubService.getActivity(useCache);
		},
		feeds: {
			activity: mActivityFeed
		}
	};

	return api;
});
