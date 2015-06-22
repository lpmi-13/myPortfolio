'use strict';

var angular = require('angular');
var $ = require('jquery');
// var dataHandler = require('../../services/mockDataHandler');

module.exports = angular.module('myApp.services.blogService', [
	// dataHandler.name
])
.service('BlogService', function (
	$q
) {

	var mCache = {};
	var m_Accounts = {
		tumblr : {
			name  : 'sirkettle',
			key   : 'vmNUaWxCt9rGA83Jk5x0S4Mh7kqpDkBKM6t8HESW1CT7AVP5xr',
			limit : 5
		}
	};

	function resampleTweet (tweet) {


		// var createdDate = new Date(oTweet.created_at * 1000),
		// $post = $('<div>').addClass('blogpost')
		// .html('<hr><small>Tweeted on ' + getDateHtml(createdDate) + '</span>'),
		// tweetHtml = oTweet.text;

		// // replace urls
		// _.each(oTweet.entities.urls, function (oUrl) {
		// tweetHtml = tweetHtml.replace(new RegExp(oUrl.url), '<a href="' + oUrl.url +'">' + oUrl.url +'</a>');
		// });

		// // replace tags
		// _.each(oTweet.entities.hashtags, function (oTag) {
		// tweetHtml = tweetHtml.replace(new RegExp('#' + oTag.text), '<a href="https://twitter.com/search?q=%23' + oTag.text +'&src=hash">#' + oTag.text + '</a>');
		// });

		// // replace usersTags
		// _.each(oTweet.entities.user_mentions, function (oTag) {
		// tweetHtml = tweetHtml.replace(new RegExp('@' + oTag.screen_name), '<a title="' + oTag.name + '" href="https://twitter.com/' + oTag.screen_name + '">@' + oTag.screen_name + '</a>');
		// });

		// $post.append($('<p>').html(tweetHtml));


		// need to add some common attributes for sorting
		tweet.__postType = 'TWEET';
		tweet.__timeStamp = tweet.created_at * 1000;

		return tweet;
	}

	function resampleTumblrPost (tumblrPost) {
		// var splitDate = tumblrPost.date.split(" "),
		// dateParts = splitDate[0].split("-"),
		// timeParts = splitDate[1].split(":");
		// createdDate = new Date(dateParts[0],(dateParts[1]-1),dateParts[2],timeParts[0],timeParts[1],timeParts[2]),
		// $post = $('<div>').addClass('blogpost')
		// .html('<hr><small>Posted on ' + getDateHtml(createdDate) + '</span>');

		// tumblrPost.

		// switch (tumblrPost.type) {
		// case 'text':
		// $post.append($('<h3>').text(tumblrPost.title), tumblrPost.body);
		// break;
		// case 'photo':
		// $post.append('<img class="image" src="' + tumblrPost.photos[0].alt_sizes[0].url + '">', tumblrPost.caption);
		// break;
		// case 'link':
		// break;
		// case 'video':
		// break;
		// };

		// need to add some common attributes for sorting
		tumblrPost.__postType = 'TUMBLR';
		tumblrPost.__timeStamp = tumblrPost.timestamp * 1000;

		return tumblrPost;
	}

	function getTweets (useCache) {
		var deferred = $q.defer();

		if (Boolean(useCache && mCache.tweets)) {
			deferred.resolve(mCache.tweets);
		}
		else {
			$.getJSON('/server/getTweets.php', function (tweets) {
				var posts = [];

				console.log(tweets);

				tweets.forEach(function (tweet) {
					posts.push(resampleTweet(tweet));
				});

				mCache.tweets = posts;

				deferred.resolve(posts);
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

			$.getJSON('http://api.tumblr.com/v2/blog/' + m_Accounts.tumblr.name + '.tumblr.com/posts?callback=?', {
				api_key: m_Accounts.tumblr.key,
				limit : m_Accounts.tumblr.limit
			}, function (aData) {

				var posts = [];
				console.log(aData);

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

				aData.response.posts.forEach(function (tumblrPost) {
					posts.push(resampleTumblrPost(tumblrPost));
				});

				deferred.resolve(posts);
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

			$q.all([tweetsPromise, tumblrPromise]).finally(function () {
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