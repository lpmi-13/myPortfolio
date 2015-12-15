'use strict';

var angular = require('angular');

var twitterService = require('./twitterService.js');
var tumblrService = require('./tumblrService.js');

module.exports = angular.module('myApp.services.blogService', [
	twitterService.name,
	tumblrService.name
]).service('BlogService', function (
	$q,
	$http,
	$filter,

	TwitterService,
	TumblrService
) {

	return {
		getPosts: function () {
			var deferred = $q.defer();
			var posts = [];
			var tweetsPromise = TwitterService.getTweets().then(function (tweets) {
				posts = posts.concat(tweets);
			});

			var tumblrPromise = TumblrService.getPosts().then(function (tumblrPosts) {
				posts = posts.concat(tumblrPosts);
			});

			// the blog posts are a mixture of tumblr posts and tweets
			$q.allSettled([tweetsPromise, tumblrPromise]).finally(function () {
				// initially sort the posts chronologically- most recent first 
				posts = posts.sort(function (a, b) {
					return b.__props.timeStamp - a.__props.timeStamp;
				});

				deferred.resolve(posts);
			});

			return deferred.promise;
		}
	};
});
