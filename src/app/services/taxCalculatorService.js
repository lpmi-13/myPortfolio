'use strict';

var angular = require('angular');

module.exports = angular.module('myApp.services.companyTaxService', [
])
// related constants
.constant('TAX_RATE_VAT', 0.2)
.constant('TAX_RATE_VAT_FLAT_RATE', 0.145)
.constant('TAX_RATE_CORPORATION_TAX', 0.2)
// the service
.service('CompanyTaxService', function (
	TAX_RATE_VAT,
	TAX_RATE_VAT_FLAT_RATE,
	TAX_RATE_CORPORATION_TAX
) {

	return {
		calculate: function (netInvoiceTotalPounds, expensesPounds, salaryPounds, altCorporationTaxRate) {

			var totals = {};

			totals.netIncome = netInvoiceTotalPounds;
			totals.grossIncome = netInvoiceTotalPounds * (1 + TAX_RATE_VAT);
			totals.vatPayable = totals.grossIncome * TAX_RATE_VAT_FLAT_RATE;

			var netAfterVat = totals.grossIncome - totals.vatPayable;

			totals.profit = netAfterVat - salaryPounds - expensesPounds;

			var corpTaxRate = altCorporationTaxRate || TAX_RATE_CORPORATION_TAX;

			totals.corporationTaxPayable = totals.profit * corpTaxRate;

			totals.maxDividends = totals.profit - totals.corporationTaxPayable;


			return totals;
		}
	};
})
// related constants
.constant('INCOME_TAX_ALLOWANCE', 11000)
.constant('DIVIDEND_ALLOWANCE', 5000)
.constant('DIVIDEND_HIGHER_TIER', 32000)
.constant('DIVIDEND_TAX_RATE', 0.075)
.constant('DIVIDEND_TAX_HIGHER_RATE', 0.325)
// the service
.service('PersonalTaxService', function (
	INCOME_TAX_ALLOWANCE,
	DIVIDEND_ALLOWANCE,
	DIVIDEND_HIGHER_TIER,
	DIVIDEND_TAX_RATE,
	DIVIDEND_TAX_HIGHER_RATE
) {
	var isFirstCalculation = true;

	function _addDividedTotals (totals, srcKey, destKey, dividedBy) {
		var field;

		totals[destKey] = {};
		
		for (field in totals[srcKey]) {
			totals[destKey][field] = totals[srcKey][field] / dividedBy;
		}

		return totals;
	}

	return {
		calculate: function (annualDividendsPounds, annualSalaryPounds, altBasicDivTaxRate, altHigherDivTaxRate, altDivAllowance) {

			var totals = {
				annual: {}
			};

			if (isFirstCalculation) {
				window.console.warn('Needs to be checked with accountant');
				window.console.log('Things to consider:');
				window.console.log(' 1) National Insurance contributions allowance.');
				window.console.log(' 2) Personal allowance and optimum salary');
				isFirstCalculation = false;
			}

			totals.annual.dividends = annualDividendsPounds;
			totals.annual.salary = annualSalaryPounds;
			totals.annual.grossIncome = annualDividendsPounds + annualSalaryPounds;

			var divAllowance = angular.isDefined(altDivAllowance) ? altDivAllowance : DIVIDEND_ALLOWANCE;
			var basicDivTaxRate = angular.isDefined(altBasicDivTaxRate) ? altBasicDivTaxRate : DIVIDEND_TAX_RATE;
			var higherDivTaxRate = angular.isDefined(altHigherDivTaxRate) ? altHigherDivTaxRate : DIVIDEND_TAX_HIGHER_RATE;

			var dividendBasicRateTaxable = Math.max(DIVIDEND_HIGHER_TIER, annualDividendsPounds) - divAllowance;
			var dividendBasicRateTax = dividendBasicRateTaxable * basicDivTaxRate;

			var dividendHigherRateTaxable = Math.max(annualDividendsPounds - DIVIDEND_HIGHER_TIER, 0);
			var dividendHigherRateTax = dividendHigherRateTaxable * higherDivTaxRate;

			totals.annual.dividendTaxPayable = dividendBasicRateTax + dividendHigherRateTax;
			// do I need to add income tax on salary here???
			totals.annual.incomeTaxPayable = totals.annual.dividendTaxPayable;
			totals.annual.netIncome = totals.annual.grossIncome - totals.annual.incomeTaxPayable;

			_addDividedTotals(totals, 'annual', 'monthly', 12);
			_addDividedTotals(totals, 'annual', 'weekly', 52);
			_addDividedTotals(totals, 'annual', 'daily', 52 * 5);

			return totals;
		}
	};
})
// the service
.service('TaxCalculatorService', function (
	CompanyTaxService,
	PersonalTaxService
) {

	return {
		calculate: function (companyDayRatePounds, numWeeksOperating, expensesPounds, people, optimumSalary, altCorporationTaxRate, altBasicDivTaxRate, altHigherDivTaxRate, altDivAllowance) {

			var totalCompanySalary = 0;
			var maxCompanyDividends;
			var netInvoiceTotalPounds = companyDayRatePounds * 5 * numWeeksOperating;

			var totals = {
				people: people.slice()
			};

			totals.people.forEach(function (person) {
				totalCompanySalary += person.hasSalary ? optimumSalary : 0;
			});

			totals.company = CompanyTaxService.calculate(netInvoiceTotalPounds, expensesPounds, totalCompanySalary, altCorporationTaxRate);

			maxCompanyDividends = totals.company.maxDividends;

			totals.people.forEach(function (person) {
				var annualDividendsPounds = maxCompanyDividends * person.share;
				person.tax = PersonalTaxService.calculate(annualDividendsPounds, person.hasSalary ? optimumSalary : 0, altBasicDivTaxRate, altHigherDivTaxRate, altDivAllowance);
			});

			var totalAnnualNetIncome = 0;

			totalAnnualNetIncome = 0;

			totals.people.forEach(function (person) {
				totalAnnualNetIncome += person.tax.annual.netIncome;
			});

			totals.peopleCombined = {};
			totals.peopleCombined.annualNetIncome = totalAnnualNetIncome;
			totals.peopleCombined.takeHomePercentage = totals.peopleCombined.annualNetIncome / netInvoiceTotalPounds;
			totals.peopleCombined.monthlyNetIncome = totals.peopleCombined.annualNetIncome / 12;
			totals.peopleCombined.weeklyNetIncome = totals.peopleCombined.annualNetIncome / 52;
			totals.peopleCombined.dailyNetIncome = totals.peopleCombined.weeklyNetIncome / 5;

			return angular.copy(totals);
		}
	};
});
