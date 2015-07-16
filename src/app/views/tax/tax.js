'use strict';

var angular = require('angular');
var template = require('./tax.html');
// services
var taxCalculatorService = require('../../services/taxCalculatorService');
// sub components
var headerComponent = require('../../components/header/header');
var footerComponent = require('../../components/footer/footer');

// directive name:
//		namespaceTypeName (examples: wtComponentAvatar or dinoViewDetail )
// 
// template use:
// <namespace:type-name></namespace:type-name> (examples: <wt:component-avatar></wt:component-avatar> or <dino:view-detail></dino:view-detail> )

module.exports = angular.module('myApp.views.tax', [
	taxCalculatorService.name,
	headerComponent.name,
	footerComponent.name
])
.directive('myViewTax', function (
) {

	return {
		restrict: 'E',
		template: template,
		controller: 'MyViewTaxCtrl as Tax',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {

			
		}
	};
})
.controller('MyViewTaxCtrl', function (
	$scope,
	TaxCalculatorService
) {
	var Tax = this;

	Tax.companyDayRatePounds = 400;
	Tax.numWeeksOperating = 46;
	Tax.expensesPounds = 4500;

	$scope.$watchCollection('[Tax.companyDayRatePounds, Tax.numWeeksOperating, Tax.expensesPounds, Tax.people[0].share, Tax.people[0].salary, Tax.people[1].share, Tax.people[1].salary]', _calculate);

	Tax.calculations = [
		{
			description: '2015',
			corpTaxRate: 0.2,
			divAllowance: 0,
			basicDivTaxRate: 0,
			higherDivTaxRate: 0.25
		},
		{
			description: '2016 (Apr)',
			corpTaxRate: 0.2,
			divAllowance: 5000,
			basicDivTaxRate: 0.075,
			higherDivTaxRate: 0.325
		},
		{
			description: '2017',
			corpTaxRate: 0.19,
			divAllowance: 5000,
			basicDivTaxRate: 0.075,
			higherDivTaxRate: 0.325
		},
		{
			description: '2020',
			corpTaxRate: 0.18,
			divAllowance: 5000,
			basicDivTaxRate: 0.075,
			higherDivTaxRate: 0.325
		}
	];

	// default people
	Tax.people = [
		{
			name: 'Will',
			share: 0.7,
			salary: (670 * 12)
		},
		{
			name: 'Vicky',
			share: 0.3
		}
	];

	function _calculate () {

		Tax.calculations.forEach(function (calc) {
			calc.totals = TaxCalculatorService.calculate(
				Tax.companyDayRatePounds, Tax.numWeeksOperating, Tax.expensesPounds, Tax.people,
				calc.corpTaxRate, calc.basicDivTaxRate, calc.higherDivTaxRate, calc.divAllowance);

			window.console.log(calc);
		});
	}
});