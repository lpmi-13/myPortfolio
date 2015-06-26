'use strict';

var angular = require('angular');
var template = require('./tweet.html');

module.exports = angular.module('myApp.components.tweet', [
])
.directive('myTweet', function (
	$sce
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyTweetCtrl as Post',
		replace: true,
		scope: {
			model: '=?'
		},
		link: function (scope, elem, attrs, controller) {
			
			scope._getTweetHtml = function () {

				var tweetHtml = scope.model.text;

				// replace urls
				scope.model.entities.urls.forEach(function (oUrl) {
					tweetHtml = tweetHtml.replace(new RegExp(oUrl.url), '<a href="' + oUrl.url +'">' + oUrl.url +'</a>');
				});

				// replace tags
				scope.model.entities.hashtags.forEach(function (oTag) {
					tweetHtml = tweetHtml.replace(new RegExp('#' + oTag.text), '<a href="https://twitter.com/search?q=%23' + oTag.text +'&src=hash">#' + oTag.text + '</a>');
				});

				// replace usersTags
				scope.model.entities.user_mentions.forEach(function (oTag) {
					tweetHtml = tweetHtml.replace(new RegExp('@' + oTag.screen_name), '<a title="' + oTag.name + '" href="https://twitter.com/' + oTag.screen_name + '">@' + oTag.screen_name + '</a>');
				});

				return $sce.trustAsHtml(tweetHtml);
			};
		}
	};
})
.controller('MyTweetCtrl', function (
	$scope
) {
	var Post = this;

	Post.model = $scope.model;
});