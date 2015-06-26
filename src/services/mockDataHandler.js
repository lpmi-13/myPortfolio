
'use strict';

var angular = require('angular');
var clientStorage = require('./clientStorage');
var initMockData = {
	projects: require('../data/portfolio.json')
};

module.exports = angular.module('services.mockDataHandler', [
	clientStorage.name
])
.service('DataHandler', function(
	$q,
	ClientStorage
) {

	// initialise data
	var dataCache = {};

	// To get ius started, we will get the columns from localstorage.
	// If they don't exist, populate them with the initial stub data
	for (var column in initMockData) {

		// if (!ClientStorage.has(column)) {
			ClientStorage.set(column, initMockData[column]);
		// }

		dataCache[column] = ClientStorage.get(column) || [];

	}

	var DataCommands = {

		updateColumn: function (column) {
			ClientStorage.set(column, dataCache[column]);
		},

		assignKey: function (entry) {
			entry.id = '' + Math.floor(Math.random() * 10000000000);
			return entry;
		},

		getIsKeyMatch: function (entry, key) {
			return entry.id === key; // key from url will be a string
		},

		hasColumn: function (column) {


			return angular.isDefined(dataCache[column]);
		},

		getColumn: function (column) {
			return angular.copy(dataCache[column]);
		},

		getItem: function (column, key, returnOriginal) {

			var item;

			dataCache[column].some(function (entry) {
				var isMatch = DataCommands.getIsKeyMatch(entry, key);

				if (isMatch) {
					item = entry;
				}

				return isMatch;
			});

			if (returnOriginal) {
				return item;
			}

			return angular.copy(item);
		},

		updateItem: function (column, key, params) {

			var item = this.getItem(column, key, true);

			item = angular.extend(item, params);

			DataCommands.updateColumn(column);

			return angular.copy(item);
		},

		createItem: function (column, params) {
			dataCache[column].push(DataCommands.assignKey(params));

			DataCommands.updateColumn(column);

			return params;
		},

		deleteItem: function (column, key) {
			var itemIndex;

			dataCache[column].some(function (entry, index) {
				var isMatch = DataCommands.getIsKeyMatch(entry, key);

				if (isMatch) {
					itemIndex = index;
				}

				return isMatch;
			});

			if (angular.isNumber(itemIndex)) {
				return dataCache[column].splice(itemIndex, 1);
			}

			DataCommands.updateColumn(column);

			return false;
		}

	};

	var DataHandler = function () {

		var self = this,
			mVersion = 't0.1',

			_getLatency = function () {

				return 1; // we're live now - lets make this instant // TODO - create liveDataHandler and use actual db

				var from = 20, to = 300;
				return Math.random() * (to - from) + from;
			},

			_simulateDBLookUp = function (callback, delay) {
				window.setTimeout(callback, delay || _getLatency());
			},

			urlHelper = {
				getParts: function (url) {
					var urlSplit = url.split(self.getApiRoot());
					var urlParts = urlSplit[1].split('/');
					return urlParts || [];
				},
				getColumn: function (url) {
					var urlParts = urlHelper.getParts(url);

					return urlParts[0] || null;
				},
				getKey: function (url) {
					var urlParts = urlHelper.getParts(url);

					return urlParts[1] || null;
				}
			};
		
		this.getVersion = function () {
			return mVersion;
		};

		this.getApiRoot = function () {
			return '/api/mock/';
		};

		this.create = function (url, params) {
			var deferred = $q.defer();
			
			_simulateDBLookUp(function () {
				var key,
					newItem,
					column = urlHelper.getColumn(url);

				if (column) {
					if (DataCommands.hasColumn(column)) {
						newItem = DataCommands.createItem(column, params);
						deferred.resolve(newItem);
					}
					else {
						deferred.reject({
							message: 'Create: Data column not found: ' + column
						});
					}
				}
				else {
					deferred.reject({
						message: 'Create: Url - column not found: ' + url
					});
				}
			});

			return deferred.promise;
		};

		this.get = function (url, params) {

			var deferred = $q.defer();

			var _getSingleItem = function (column, key) {

				var item = DataCommands.getItem(column, key);

				if (item) {
					deferred.resolve(item);
				}
				else {
					deferred.reject({
						message: 'Get: "' + key + '" not found in column: ' + column
					});
				}

			};

			var _getList = function (column, params) {

				var list;

				if (angular.isObject(params)) {
					// for now, just return a simple match look up on params passed in.
					// this could be extended for special params such as _range, _page, _search ??
					// Also could have _fields param with list of fields to return
					list = DataCommands.getColumn(column);
					deferred.resolve(list.filter(function (entry) {
						var isMatch = false;

						for (var key in params) {
							if (!isMatch && params[key] === entry[key]) {
								isMatch = true;
							}
						}

						return isMatch;
					}));
				}
				else {
					list = DataCommands.getColumn(column);
					deferred.resolve(list);
				}

			};

			_simulateDBLookUp(function () {

				var key,
					column = urlHelper.getColumn(url);

				if (column) {
					if (DataCommands.hasColumn(column)) {
						key = urlHelper.getKey(url);
						if (key) {
							// we are after a single item
							_getSingleItem(column, key);
						}
						else {
							// return a list of items
							_getList(column, params);
						}
					}
					else {
						deferred.reject({
							message: 'Get: Data column not found: ' + column
						});
					}
				}
				else {
					deferred.reject({
						message: 'Get: Url - column not found: ' + url
					});
				}
			});

			return deferred.promise;
		};

		this.update = function (url, params) {
			var deferred = $q.defer();
			
			_simulateDBLookUp(function () {

				var key,
					column = urlHelper.getColumn(url);

				if (column) {
					if (DataCommands.hasColumn(column)) {
						key = urlHelper.getKey(url);
						if (key) {
							// we are after a single item
							var item = DataCommands.getItem(column, key);

							if (item) {
								item = DataCommands.updateItem(column, key, params);
								deferred.resolve(item);
							}
							else {
								deferred.reject({
									message: 'Update: "' + key + '" not found in column: ' + column
								});
							}
						}
						else {
							deferred.reject({
								message: 'Update: Url - key not found: ' + url
							});
						}
					}
					else {
						deferred.reject({
							message: 'Update: Data column not found: ' + column
						});
					}
				}
				else {
					deferred.reject({
						message: 'Update: Url - column not found: ' + url
					});
				}
			});

			return deferred.promise;
		};

		this.delete = function (url) {
			var deferred = $q.defer();
			
			_simulateDBLookUp(function () {

				var key,
					column = urlHelper.getColumn(url);

				if (column) {
					if (DataCommands.hasColumn(column)) {
						key = urlHelper.getKey(url);
						if (key) {
							// we are after a single item
							var item = DataCommands.deleteItem(column, key);

							if (item) {
								deferred.resolve(item);
							}
							else {
								deferred.reject({
									message: 'Delete: "' + key + '" not found in column: ' + column
								});
							}
						}
						else {
							deferred.reject({
								message: 'Delete: Url - key not found: ' + url
							});
						}
					}
					else {
						deferred.reject({
							message: 'Delete: Data column not found: ' + column
						});
					}
				}
				else {
					deferred.reject({
						message: 'Delete: Url - column not found: ' + url
					});
				}
			});

			return deferred.promise;
		};
	};
	
	return new DataHandler();
});