'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.twitterService', [
]).service('TwitterService', function (
	$q,
	$http,
	$filter
) {
	var mCache = {};

	// The BlogService requires certain properties such as postType and timestamp
	// so this method restructures the raw tweet
	// TODO: Handle photos in tweets - only handling the text at the moment
	function _getPostObject (tweet) {
		// schema = {
		// 	postType: 'string',
		// 	timeStamp: 'number',
		// 	html: {
		// 		caption: 'string',
		// 		postInfo: 'string'
		// 	}
		// };
		var post = {};

		post.postType = 'TWEET';
		post.timeStamp = tweet.created_at * 1000;
		post.html = {};

		post.html.caption = tweet.text;

		// replace urls
		tweet.entities.urls.forEach(function (oUrl) {
			post.html.caption = post.html.caption.replace(new RegExp(oUrl.url), '<a href="' + oUrl.url +'">' + oUrl.url +'</a>');
		});

		// replace tags
		tweet.entities.hashtags.forEach(function (oTag) {
			post.html.caption = post.html.caption.replace(new RegExp('#' + oTag.text), '<a href="https://twitter.com/search?q=%23' + oTag.text +'&src=hash">#' + oTag.text + '</a>');
		});

		// replace usersTags
		tweet.entities.user_mentions.forEach(function (oTag) {
			post.html.caption = post.html.caption.replace(new RegExp('@' + oTag.screen_name), '<a title="' + oTag.name + '" href="https://twitter.com/' + oTag.screen_name + '">@' + oTag.screen_name + '</a>');
		});

		post.html.postInfo = 'Tweeted on ' + ($filter('date')(post.timeStamp, 'dd MMM yyyy'));

		return post;
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
							window.console.warn('Error getting tweets.', 'Expecting an array of tweets');
							deferred.reject();
							return;
						}

						aData.forEach(function (tweet) {
							posts.push(_getPostObject(tweet));
						});

						mCache.tweets = posts;

						deferred.resolve(posts);
					})
					.error(function(data, status, headers, config) {
						// log error
						window.console.warn('Error getting tweets', arguments);
						deferred.reject();
					});
			}

			return deferred.promise;
		}
	};
});
