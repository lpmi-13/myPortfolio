'use strict';

var angular = require('angular');
var template = require('./tax.html');
// services

// sub header
var headerComponent = require('../../components/header/header');
var footerComponent = require('../../components/footer/footer');
var taxCalculatorComponent = require('../../components/taxCalculator/taxCalculator');

// directive name:
//		namespaceTypeName (examples: wtComponentAvatar or dinoViewDetail )
// 
// template use:
// <namespace:type-name></namespace:type-name> (examples: <wt:component-avatar></wt:component-avatar> or <dino:view-detail></dino:view-detail> )

module.exports = angular.module('myApp.views.tax', [
	headerComponent.name,
	footerComponent.name,
	taxCalculatorComponent.name
])
.directive('myViewTax', function (
) {

	return {
		restrict: 'E',
		template: template,
		controller: 'MyViewTaxCtrl',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {

			
		}
	};
})
.controller('MyViewTaxCtrl', function (
	$scope
) {

});