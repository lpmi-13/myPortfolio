```
var conf = {
	dividends: 80000,
	people: [
		{ share: 0.7, sal: 8060 },
		{ share: 0.3, sal: 20000 }
	]
};

var dvdOutput = ( sa, dvd ) => {
	const total = sa + dvd;
	const TAX_FREE_ALLOWANCE = 11000;
	const DIVIDEND_ALLOWANCE = 5000;
	const DIVIDEND_BASIC_LIMIT = 32000;
	const DIVIDEND_HIGHER_LIMIT = 100000;

	const rates = {
		FREE: 0,
		BASIC: 0.075,
		HIGHER: 0.325,
		ADDITIONAL: 0.381
	};

	const bands = {
		FREE: TAX_FREE_ALLOWANCE + DIVIDEND_ALLOWANCE,
		BASIC: TAX_FREE_ALLOWANCE + DIVIDEND_BASIC_LIMIT,
		HIGHER: TAX_FREE_ALLOWANCE + DIVIDEND_HIGHER_LIMIT
	}

	const conf = [
		{ range: [ 0, bands.FREE ], rate: rates.FREE },
		{ range: [ bands.FREE, bands.BASIC ], rate: rates.BASIC },
		{ range: [ bands.BASIC, bands.HIGHER ], rate: rates.HIGHER },
		{ plus: bands.HIGHER, rate: rates.ADDITIONAL }
	];

	var tax = 0;

	conf.forEach( tb => {
		const { range, rate, plus } = tb;
		if ( range && range[0] < total ) {
			const taxable = Math.min( total, range[1] ) - range[0];
			tax += taxable * rate;
		}
		if ( plus && total > plus ) {
			tax += (total - plus) * rate;
		}
	});

	return tax;
}

var totalTax = 0;

conf.people.forEach( person => {
	totalTax += dvdOutput( person.sal, person.share * conf.dividends );
} )

console.log( totalTax );
```
