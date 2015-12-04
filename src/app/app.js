
'use strict';

var angular = require('angular');
var uiRouter = require('angular-ui-router');

var filters = require('./filters');
var localisationService = require('./services/localisationService');
var analyticsService = require('./services/analyticsService');

var viewAbout = require('./views/about/about');
var viewProjects = require('./views/projects/projects');
var viewProject = require('./views/project/project');
var viewPlay = require('./views/play/play');
var viewTax = require('./views/tax/tax');

angular.module('myApp', [
	filters.name,
	localisationService.name,
	analyticsService.name,
	viewAbout.name,
	viewProjects.name,
	viewProject.name,
	viewPlay.name,
	viewTax.name,
	'ui.router'
])
.constant('STATE_URL_HOME_REDIRECT', '/')
.constant('STATE_URL_ABOUT', '/about')
.constant('STATE_URL_PROJECTS', '/projects')
.constant('STATE_URL_PROJECT', '/project/:projectKey')
.constant('STATE_URL_PLAY', '/play')
.constant('STATE_URL_TAX', '/tax')
.constant('STATE_NAME_HOME_REDIRECT', 'home')
.constant('STATE_NAME_ABOUT', 'about')
.constant('STATE_NAME_PROJECTS', 'projects')
.constant('STATE_NAME_PROJECT', 'project')
.constant('STATE_NAME_PLAY', 'play')
.constant('STATE_NAME_TAX', 'tax')
.constant('DEFAULT_PROJECT_KEY', null)
.config(function (
	$stateProvider,
	$urlRouterProvider,
	$provide,
	STATE_URL_HOME_REDIRECT,
	STATE_URL_ABOUT,
	STATE_URL_PROJECTS,
	STATE_URL_PROJECT,
	STATE_URL_PLAY,
	STATE_URL_TAX,
	STATE_NAME_HOME_REDIRECT,
	STATE_NAME_ABOUT,
	STATE_NAME_PROJECTS,
	STATE_NAME_PROJECT,
	STATE_NAME_PLAY,
	STATE_NAME_TAX,
	DEFAULT_PROJECT_KEY
) {
	// If 404 - go home...
	$urlRouterProvider.otherwise(STATE_URL_HOME_REDIRECT);

	// Define the states used in the app
	$stateProvider
		.state(STATE_NAME_HOME_REDIRECT, {
			url: STATE_URL_HOME_REDIRECT,
			controller: function($state, STATE_NAME_ABOUT) {
				$state.go(STATE_NAME_ABOUT);
			}
		})
		.state(STATE_NAME_ABOUT, {
			url: STATE_URL_ABOUT,
			template: '<my:view-about></my:view-about>'
		})
		.state(STATE_NAME_PROJECTS, {
			url: STATE_URL_PROJECTS,
			template: '<my:view-projects></my:view-projects>'
		})
		.state(STATE_NAME_PROJECT, {
			url: STATE_URL_PROJECT,
			template: '<my:view-project></my:view-project>',
			params: {
				projectKey: DEFAULT_PROJECT_KEY
			}
		})
		.state(STATE_NAME_PLAY, {
			url: STATE_URL_PLAY,
			template: '<my:view-play></my:view-play>'
		})
		.state(STATE_NAME_TAX, {
			url: STATE_URL_TAX,
			template: '<my:view-tax></my:view-tax>'
		});

	// decorate the $q service with 'allSettled' which unlike 'all' resolves if a promise fails
	$provide.decorator('$q', function($delegate) {
		var $q = $delegate;
		$q.allSettled = function(promises) {
			return $q.all(promises.map(function(promise) {
				return promise.then(function(value) {
					return { state: 'fulfilled', value: value };
				}, function(reason) {
					return { state: 'rejected', reason: reason };
				});
			}));
		};
		return $q;
	});
})
.run(function (
	$filter,
	LocalisationService,
	AnalyticsService
) {
	LocalisationService.init('en-GB')
		.then(function () {
			var successMsg = $filter('localise')('myApp_localisationInitSuccess');
		})
		.catch(function (err) {
			console.error(err);
		});

	AnalyticsService.init();
});