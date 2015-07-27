'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.tumblrService', [
]).service('TumblrService', function (
	$q,
	$http,
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

	// __postType - ie. 'TUMBLR'
	// __timeStamp - ie. 1243253253
	// __html.caption - ie. 'This is an example tumblr about <a href="somelink">some one</a>'
	// __html.postInfo - ie. Posted on 17 Jul 2015

	function resampleTumblrPost (tumblrPost) {
		tumblrPost.__postType = 'TUMBLR';
		tumblrPost.__timeStamp = tumblrPost.timestamp * 1000;

		tumblrPost.__html = {};
		tumblrPost.__html.caption = tumblrPost.caption;
		tumblrPost.__html.postInfo = 'Posted on ' + ($filter('date')(tumblrPost.__timeStamp, 'dd MMM yyyy'));
		tumblrPost.__imageModel = tumblrPost.photos[0].alt_sizes[0];

		return tumblrPost;
	}

	return {

		getPosts: function (useCache) {
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
	};
});
