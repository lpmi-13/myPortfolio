'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.activityService', [
])
.constant('GITHUB_BASE_URL', 'https://github.com/')
.constant('GITHUB_API_BASE_URL', 'https://api.github.com/')
.constant('GITHUB_USER', 'SirKettle')
.service('ActivityService', function (
	$q,
	$http,
	$filter,

	GITHUB_BASE_URL,
	GITHUB_API_BASE_URL,
	GITHUB_USER
) {
	var mCache = {};

	function _getUserObject (user) {
		var userModel = user;

		return userModel;
	}

	function _getEventObject (eventData) {
		var eventModel = {};

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
		}

		return eventModel;
	}

	return {
		getActivity: function (useCache) {
			var deferred = $q.defer();

			if (Boolean(useCache && mCache.user && mCache.activity)) {
				deferred.resolve(mCache);
			}
			else {

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

								aData.forEach(function (eventData) {
									activity.push(_getEventObject(eventData));
								});

								mCache.activity = activity;

								deferred.resolve(mCache);
							})
							.error(function(data, status, headers, config) {
								// log error
								window.console.warn('error getting activity', data);
								deferred.reject(data);
							});

					})
					.error(function(data, status, headers, config) {
						// log error
						window.console.warn('error getting user', data);
						deferred.reject(data);
					});
			}

			return deferred.promise;
		}
	};
});
