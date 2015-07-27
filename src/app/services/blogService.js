'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.blogService', [

]).service('BlogService', function (
	$q,
	$http,
	$timeout,
	$filter
) {

	var mCache = {};
	var m_Accounts = {
		tumblr : {
			name  : 'sirkettle',
			key   : 'vmNUaWxCt9rGA83Jk5x0S4Mh7kqpDkBKM6t8HESW1CT7AVP5xr',
			limit : 5
		}
	};

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

	function resampleTumblrPost (tumblrPost) {
		tumblrPost.__postType = 'TUMBLR';
		tumblrPost.__timeStamp = tumblrPost.timestamp * 1000;

		tumblrPost.__html = {};
		tumblrPost.__html.caption = tumblrPost.caption;
		tumblrPost.__html.postInfo = 'Posted on ' + ($filter('date')(tumblrPost.__timeStamp, 'dd MMM yyyy'));
		tumblrPost.__imageModel = tumblrPost.photos[0].alt_sizes[0];

		return tumblrPost;
	}

	function getTweets (useCache) {
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

	function getTumblr (useCache) {
		var deferred = $q.defer();

		if (Boolean(useCache && mCache.tumblrPosts)) {
			deferred.resolve(mCache.tumblrPosts);
		}
		else {

			var tumblrGetUrl = 'http://api.tumblr.com/v2/blog/' + m_Accounts.tumblr.name +
								'.tumblr.com/posts?callback=JSON_CALLBACK' +
								'&limit=' + m_Accounts.tumblr.limit +
								'&api_key=' + m_Accounts.tumblr.key;

			$http.jsonp(tumblrGetUrl)
				.success(function(aData, status, headers, config) {
					var posts = [];

					if (!Boolean(aData.response && aData.response.posts.length > 0)) {
						deferred.resolve(posts);
						return;
					}

					// filter post types
					aData.response.posts = aData.response.posts.filter(function (post) {
						if (post.type === 'text') {
							return true;
						}
						if (post.type === 'photo') {
							return true;
						}
						return false;
					});

					aData.response.posts.forEach(function (tumblrPost, index) {
						if (index < m_Accounts.tumblr.limit) {
							posts.push(resampleTumblrPost(tumblrPost));
						}
					});

					deferred.resolve(posts);
				})
				.error(function(data, status, headers, config) {
					// log error
					window.console.warn('error getting tumblr posts');
					deferred.reject();
				});
		}

		return deferred.promise;
	}


	return {

		getPosts: function () {
			var deferred = $q.defer();
			var posts = [];
			var tweetsPromise = getTweets().then(function (tweets) {
				posts = posts.concat(tweets);
			});

			var tumblrPromise = getTumblr().then(function (tumblrPosts) {
				posts = posts.concat(tumblrPosts);
			});

			$q.allSettled([tweetsPromise, tumblrPromise]).finally(function () {
				// sort the posts
				posts = posts.sort(function (a, b) {
					return b.__timeStamp - a.__timeStamp;
				});

				deferred.resolve(posts);
			});

			return deferred.promise;
		}
	};
});
