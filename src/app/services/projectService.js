'use strict';

var angular = require('angular');
var dataService = require('./dataService');

module.exports = angular.module('myApp.services.projectService', [
	dataService.name
])
.service('MyProjectService', function (
	$q,
	$rootScope,
	DataService
) {

	var mURL = DataService.apiRoot() + 'projects';

	var _validateResponse = function (deferred, data, method) {
		// validation
		if (angular.isObject(data)) {
			DataService.resolve(deferred, data);
		}
		else {
			DataService.reject(deferred, {
				message: 'invalid data',
				data: data
			});
		}
	};

	return {
		get: function (key) {
			var deferred = $q.defer();

			DataService.get(mURL + '/' + key)
				.then(function (data) {
					_validateResponse(deferred, data, 'get');
				})
				.catch(function (err) {
					DataService.reject(deferred, err);
				});

			return deferred.promise;
		},
		getAll: function (params) {
			var deferred = $q.defer();

			DataService.get(mURL, params)
				.then(function (data) {
					_validateResponse(deferred, data, 'getAll');
				})
				.catch(function (err) {
					DataService.reject(deferred, err);
				});

			return deferred.promise;

		},
		create: function (data) {
			var deferred = $q.defer();

			// TODO: validate data before publishing

			DataService.create(mURL, data)
				.then(function (data) {
					_validateResponse(deferred, data, 'create');
				})
				.catch(function (err) {
					DataService.reject(deferred, err);
				});

			return deferred.promise;
		},
		update: function (key, data) {
			var deferred = $q.defer();

			// TODO: validate data before publishing

			DataService.update(mURL + '/' + key, data)
				.then(function (data) {
					_validateResponse(deferred, data, 'update');
				})
				.catch(function (err) {
					DataService.reject(deferred, err);
				});

			return deferred.promise;
		},
		delete: function (key) {
			var deferred = $q.defer();

			DataService.delete(mURL + '/' + key)
				.then(function (data) {
					_validateResponse(deferred, data, 'delete');
				})
				.catch(function (err) {
					DataService.reject(deferred, err);
				});

			return deferred.promise;
		}
	};
});
