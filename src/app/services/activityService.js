'use strict';

var angular = require('angular');
var Rx = require('rx');

var twitterService = require('./twitterService.js');
var githubService = require('./githubService.js');
var tumblrService = require('./tumblrService.js');

module.exports = angular.module('myApp.services.activityService', [
	twitterService.name,
	githubService.name,
	tumblrService.name
])
.service('ActivityService', function (
	$q,
	$http,
	$filter,
	GithubService,
	TwitterService,
	TumblrService
) {
	var mActivityFeed = Rx.Observable.create(function (observer) {

		var feed = [];

		GithubService.getActivity(true).then(function (data) {
			feed = feed.concat(data.activity);
			observer.onNext(feed);
		});

		TwitterService.getTweets(true).then(function (tweets) {
			feed = feed.concat(tweets);
			observer.onNext(feed);
		});

		TumblrService.getPosts(true).then(function (posts) {
			feed = feed.concat(posts);
			observer.onNext(feed);
		});

		return function () {
			window.console.log('Activity feed - observer - disposal called');
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
