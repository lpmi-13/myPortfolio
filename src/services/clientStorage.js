'use strict';

var angular = require('angular');

module.exports = angular.module('services.clientStorage', [
])
.service('ClientStorage', function(
) {
	var ClientStorage = function () {

		var self = this;

		this.has = function (key) {

			return !!self.get(key);

		};

		this.get = function (key) {

			var ret = null, storeValue;
				
			if (angular.isString(key)) {
				ret = window.localStorage.getItem(key);

				if (angular.isString(ret)) {
					storeValue = JSON.parse(ret);

					if (angular.isDefined(storeValue.data)) {
						ret = storeValue.data;
					}
				}
			}
		
			return ret;
		};

		this.set = function (key, newData) {

			var serialisedValue;

			if (angular.isString(key) && angular.isDefined(newData)) {
				serialisedValue = JSON.stringify({ data: newData });
				window.localStorage.setItem(key, serialisedValue);
			}

		};

		this.remove = function (key) {

			if (angular.isString(key)) {
				window.localStorage.removeItem(key);
			}

		};

		return this;
	};
	
	return new ClientStorage();
});