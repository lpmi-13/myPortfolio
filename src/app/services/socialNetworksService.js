'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.socialNetworksService', [
])
.service('SocialNetworksService', function (
	$q
) {
	return {

		getSocialNetworks: function () {
			var deferred = $q.defer();
			var networks = [
				{
					id: 'github',
					name: 'GitHub',
					url: 'https://github.com/SirKettle'
				},
				{
					id: 'linkedin',
					name: 'LinkedIn',
					url: 'https://www.linkedin.com/in/thirkettle'
				},
				{
					id: 'twitter',
					name: 'Twitter',
					url: 'https://twitter.com/thirkettle'
				}
			];
			
			deferred.resolve(networks);

			return deferred.promise;
		}
	};
});