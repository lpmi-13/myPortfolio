'use strict';

var angular = require('angular');
var template = require('./taxCalculator.html');
// services
var taxCalculatorService = require('../../services/taxCalculatorService');
var clientStorage = require('../../../services/clientStorage');

module.exports = angular.module('myApp.components.taxCalculator', [
	taxCalculatorService.name
])
.directive('myTaxCalculator', function (
) {

	return {
		restrict: 'E',
		template: template,
		controller: 'MyTaxCalculatorCtrl as Tax',
		replace: true,
		scope: {
		},
		link: function (scope, elem, attrs, controller) {
			
		}
	};
})
.controller('MyTaxCalculatorCtrl', function (
	$scope,
	TaxCalculatorService,
	ClientStorage
) {
	var Tax = this;

	Tax.companyDayRatePounds = ClientStorage.get('tax_companyDayRatePounds') || 100;
	Tax.numWeeksOperating = ClientStorage.get('tax_numWeeksOperating') || 46;
	Tax.expensesPounds = ClientStorage.get('tax_expensesPounds') || 1000;

	// TODO: Get this from localStorage

	$scope.$watchCollection('[Tax.companyDayRatePounds, Tax.numWeeksOperating, Tax.expensesPounds, Tax.people[0].share, Tax.people[0].hasSalary, Tax.people[1].share, Tax.people[1].hasSalary]', _calculate);

	Tax.calculations = [
		{
			description: '2015',
			corpTaxRate: 0.2,
			divAllowance: 0,
			basicDivTaxRate: 0,
			higherDivTaxRate: 0.25,
			optimumSalary: 8060,
			notes: '(2015) Current tax rates with optimum salary of £8,060'
		},
		{
			description: '2016 (Apr)',
			corpTaxRate: 0.2,
			divAllowance: 5000,
			basicDivTaxRate: 0.075,
			higherDivTaxRate: 0.325,
			optimumSalary: 11000,
			notes: 'Tax rates as declared in Tory budget with salary of £11,000.  No NIC allowance (??)'
		},
		{
			description: '2017',
			corpTaxRate: 0.19,
			divAllowance: 5000,
			basicDivTaxRate: 0.075,
			higherDivTaxRate: 0.325,
			optimumSalary: 11000,
			notes: 'Tax rates as declared in Tory budget with salary of £11,000.  Corp Tax lowered to 19%'
		},
		{
			description: '2020',
			corpTaxRate: 0.18,
			divAllowance: 5000,
			basicDivTaxRate: 0.075,
			higherDivTaxRate: 0.325,
			optimumSalary: 11000,
			notes: 'Tax rates as declared in Tory budget with salary of £11,000.  Corp Tax lowered to 18%'
		}
	];

	// default people
	Tax.people = [
		{
			name: 'Will',
			share: 0.7,
			hasSalary: true
		},
		{
			name: 'Vicky',
			share: 0.3,
			hasSalary: false
		}
	];

	function _storeValues () {
		ClientStorage.set('tax_companyDayRatePounds', Tax.companyDayRatePounds);
		ClientStorage.set('tax_numWeeksOperating', Tax.numWeeksOperating);
		ClientStorage.set('tax_expensesPounds', Tax.expensesPounds);
	}

	function _calculate () {

		_storeValues();

		Tax.calculations.forEach(function (calc) {
			calc.totals = TaxCalculatorService.calculate(
				Tax.companyDayRatePounds, Tax.numWeeksOperating, Tax.expensesPounds, Tax.people,
				calc.optimumSalary, calc.corpTaxRate, calc.basicDivTaxRate, calc.higherDivTaxRate, calc.divAllowance);
		});

		window.console.log(Tax.calculations);
	}
});