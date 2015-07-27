'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.twitterService', [
]).service('TwitterService', function (
	$q,
	$http,
	$filter
) {
	var mCache = {};

	// all our posts require the following:

	// __postType - ie. 'TWEET'
	// __timeStamp - ie. 1243253253
	// __html.caption - ie. 'This is an example tweet about <a href="somelink">some one</a>'
	// __html.postInfo - ie. Posted on 17 Jul 2015

	function resampleTweet (tweet) {
		tweet.__postType = 'TWEET';
		tweet.__timeStamp = tweet.created_at * 1000;
		tweet.__html = {};

		tweet.__html.caption = tweet.text;

		// replace urls
		tweet.entities.urls.forEach(function (oUrl) {
			tweet.__html.caption = tweet.__html.caption.replace(new RegExp(oUrl.url), '<a href="' + oUrl.url +'">' + oUrl.url +'</a>');
		});

		// replace tags
		tweet.entities.hashtags.forEach(function (oTag) {
			tweet.__html.caption = tweet.__html.caption.replace(new RegExp('#' + oTag.text), '<a href="https://twitter.com/search?q=%23' + oTag.text +'&src=hash">#' + oTag.text + '</a>');
		});

		// replace usersTags
		tweet.entities.user_mentions.forEach(function (oTag) {
			tweet.__html.caption = tweet.__html.caption.replace(new RegExp('@' + oTag.screen_name), '<a title="' + oTag.name + '" href="https://twitter.com/' + oTag.screen_name + '">@' + oTag.screen_name + '</a>');
		});

		tweet.__html.postInfo = 'Tweeted on ' + ($filter('date')(tweet.__timeStamp, 'dd MMM yyyy'));

		return tweet;
	}

	return {
		getTweets: function (useCache) {
			var deferred = $q.defer();

			if (Boolean(useCache && mCache.tweets)) {
				deferred.resolve(mCache.tweets);
			}
			else {
				$http.get('http://server.willthirkettle.co.uk/api/tweets.php')
					.success(function(aData, status, headers, config) {
						var posts = [];

						if (!angular.isArray(aData)) {
							window.console.warn('error getting tweets - prob running node server');
							deferred.reject();
							return;
						}

						aData.forEach(function (tweet) {
							posts.push(resampleTweet(tweet));
						});

						mCache.tweets = posts;

						deferred.resolve(posts);
					})
					.error(function(data, status, headers, config) {
						// log error
						window.console.warn('error getting tweets');
						deferred.reject();
					});
			}

			return deferred.promise;
		}
	};
});
