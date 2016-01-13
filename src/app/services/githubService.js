'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.githubService', [
])
.constant('GITHUB_BASE_URL', 'https://github.com/')
.constant('GITHUB_API_BASE_URL', 'https://api.github.com/')
.constant('GITHUB_USER', 'SirKettle')
.service('GithubService', function (
	$q,
	$http,
	$filter,

	GITHUB_BASE_URL,
	GITHUB_API_BASE_URL,
	GITHUB_USER
) {
	var mCache = {};
	var mActiveRequests = [];

	function _getUserObject (user) {
		var userModel = user;

		return userModel;
	}

	function _getEventObject (eventData) {
		var eventModel = {
			__props: {

			}
		};

		eventModel.timeStamp = new Date(eventData.created_at).getTime();

		if (eventData.type === 'PushEvent') {

			eventModel.repo = {
				name: eventData.repo.name,
				url: GITHUB_BASE_URL + eventData.repo.name
			};

			eventModel.commits = eventData.payload.commits.map(function (commitData) {
				return {
					message: commitData.message,
					url: eventModel.repo.url + '/commit/' + commitData.sha
				};
			});
				
			eventModel.summary = (eventModel.commits.length === 1 ? '1 commit ' : eventModel.commits.length + ' commits ') + ' pushed on ' +
				($filter('date')(eventModel.timeStamp, 'dd MMM yyyy'));

			var captionHtml = '<ul class="-list">' + eventModel.commits.map(function (commit) {
					return '<li><a href="' + commit.url +'">' + commit.message + '</a></li>'
				}).join('') + '</ul>';
			

			// normalize - matching params with blog posts for mixed feeds
			eventModel.__props.type = 'GITHUB';
			eventModel.__props.timeStamp = eventModel.timeStamp;
			eventModel.__props.html = {};
			// eventModel.__props.html.caption = captionText;
			eventModel.__props.html.caption = captionHtml;
			eventModel.__props.html.postInfo = eventModel.summary + ' - <a href="' + eventModel.repo.url +'">' + eventModel.repo.name + '</a>';

		}

		return eventModel;
	}

	function _requestActivity (useCache) {
		var deferred = $q.defer();

		// store active requests so we can piggy back on the same request is active one already
		mActiveRequests.push(deferred);

		if (Boolean(useCache && mCache.user && mCache.activity)) {
			_resolveActiveRequests(mCache);
		}
		else {
			if (mActiveRequests.length === 1) {
				$http.get(GITHUB_API_BASE_URL + 'users/' + GITHUB_USER)
					.success(function(user, status, headers, config) {

						mCache.user = _getUserObject(user);

						$http.get(GITHUB_API_BASE_URL + 'users/' + GITHUB_USER + '/events')
							.success(function(aData, status, headers, config) {
								var activity = [];

								if (!angular.isArray(aData)) {
									window.console.warn('error getting github activity');
									deferred.reject();
									return;
								}

								activity = aData.filter(function (eventData) {
									return eventData.type === 'PushEvent';
								}).map(function (eventData) {
									return _getEventObject(eventData);
								});

								mCache.activity = activity;
								_resolveActiveRequests(mCache);
							})
							.error(function(data, status, headers, config) {
								// log error
								window.console.warn('error getting activity', data);
								_rejectActiveRequests(data);
							});

					})
					.error(function(data, status, headers, config) {
						// log error
						window.console.warn('error getting user', data);
						_rejectActiveRequests(data);
					});
			}
		}

		return deferred.promise;
	}

	function _resolveActiveRequests (data) {
		mActiveRequests.forEach(function (deferredRequest) {
			deferredRequest.resolve(data);
		});
		mActiveRequests = [];
	}

	function _rejectActiveRequests (data) {
		mActiveRequests.forEach(function (deferredRequest) {
			deferredRequest.reject(data);
		});
		mActiveRequests = [];
	}

	return {
		getActivity: function (useCache) {
			return _requestActivity(useCache);
		}
	};

	return api;
});
