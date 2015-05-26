'use strict';

var angular = require('angular');
var locales = {
	'en-GB': require('../../data/localisation/en-GB.json'),
	'en-US': require('../../data/localisation/en-US.json')
};

module.exports = angular.module('myApp.services.localisationService', [
])
.service('LocalisationService', function (
	$http,
	$log,
	$q
) {
	function LocalisationService () {

		var self = this;
		var mLocale;
		var mLocaleDB;
		var mNeedLocalisingList = [];

		this.init = function (locale) {
			var deferred = $q.defer();
			mLocale = locale;
			mLocaleDB = locales[locale];

			if (mLocaleDB) {
				deferred.resolve();
			}
			else {
				deferred.reject('Localisation Service unable to init - cannot find DB: "' + locale + '"');
			}

			return deferred.promise;
		};

		this.localise = function (localeKey, params) {
			var ret = localeKey;

			// return '<<§>>';

			function _replacePlaceholder (text, placeholder, value) {

				if (angular.isUndefined(value) || value === null) {
					value = '';
				}

				text = text.replace(new RegExp('#{' + placeholder + '}', 'gi'), value);

				return text;
			}

			if (localeKey) {

				if (mLocaleDB[localeKey]) {

					ret = mLocaleDB[localeKey];

					if (!angular.isString(ret)) {
						/* We have prob got an array of object of strings here.
						 * This is used when there are variations of a string.
						 * ie
						 *		"localeKey": [
						 *			"No things",
						 *			"A single thing",
						 *			"Two of these things"
						 *		]
						 *
						 * or
						 *		"localeKey": {
						 *			"single"   : "One thing",
						 *			"multiple" : "#{count} things"
						 *		}
						 *
						 * There should be a special '_index' param - else, default to zero.
						 */
						var index = params._index || params._key || 0;
						ret = mLocaleDB[localeKey][index] || '';
					}

					if (params) {
						// Replace placeholders with values
						for (var key in params) {
							ret = _replacePlaceholder(ret, key, params[key]);
						}
					}
				}
				else {
					if (mNeedLocalisingList.indexOf(localeKey) === -1) {
						// key not found in the localisation data
						mNeedLocalisingList.push(localeKey);

						$log.warn(self.localise('localisation_keyMissing', {
							key: localeKey,
							locale: mLocale
						}));
					}
				}
			}

			return ret;
		};
	}

	return new LocalisationService();
})
.filter('localise', function (
	$sce,
	LocalisationService
) {
	return function (localeKey, params) {
		var ret = LocalisationService.localise(localeKey, params);
		return $sce.trustAsHtml(ret);
	};
});
