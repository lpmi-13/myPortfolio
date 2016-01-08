'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.twitterService', [
]).service('TwitterService', function (
	$q,
	$http,
	$filter
) {
	var mCache = {};

	function replaceLink (text) {

		if (text.indexOf('http') === 0) {
			text = '<a href="' + text + '">' + text + '</a>';
		}

		return text;
	}

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
		var post = {
			__props: {

			}
		};

		post.__props.type = 'TWEET';
		post.__props.timeStamp = tweet.created_at * 1000;
		post.__props.html = {};

		// set inital caption text and replace urls in the text
		post.__props.html.caption = tweet.text.split(' ').map(replaceLink).join(' ');

		// add urls from the entities
		tweet.entities.urls.forEach(function (oUrl) {
			post.__props.html.caption = post.__props.html.caption.replace(new RegExp(oUrl.url), '<a href="' + oUrl.url +'">' + oUrl.url +'</a>');
		});

		// replace tags
		tweet.entities.hashtags.forEach(function (oTag) {
			post.__props.html.caption = post.__props.html.caption.replace(new RegExp('#' + oTag.text), '<a href="https://twitter.com/search?q=%23' + oTag.text +'&src=hash">#' + oTag.text + '</a>');
		});

		// replace usersTags
		tweet.entities.user_mentions.forEach(function (oTag) {
			post.__props.html.caption = post.__props.html.caption.replace(new RegExp('@' + oTag.screen_name), '<a title="' + oTag.name + '" href="https://twitter.com/' + oTag.screen_name + '">@' + oTag.screen_name + '</a>');
		});

		post.__props.html.postInfo = 'Tweeted on ' + ($filter('date')(post.__props.timeStamp, 'dd MMM yyyy'));

		if (tweet.entities.media) {
			var photo = tweet.entities.media.filter(function (oMedia) {
				return oMedia.type === 'photo';
			})[0];

			if (photo) {
				post.__props.imageModel = {
					url: photo.media_url,
					width: photo.sizes.medium.w,
					height: photo.sizes.medium.h
				}
			}
		}

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
