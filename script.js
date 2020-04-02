// GET https://prime.exchangerate-api.com/v5/YOUR-API-KEY/latest/USD
// APIkey: 09e9c25cfea5c28f56798f1c

const _EXCHANGERATE_APIKEY = "09e9c25cfea5c28f56798f1c";
const _EXCHANGERATE_BASE = "https://prime.exchangerate-api.com/v5";
const _EXCHANGERATE_PAIRREQUEST = "pair";								//	Followed by "USD/EUR" to convert $$ to €
const _EXCHANGERATE_LATESTREQUEST = "latest";							//	Followed by "USD" for a list of $$ conversions

const _DEFAULT_SOURCECURRENCY = "USD";

var queryStart = new Date();
var _sourceCurrency = "";
var _destinationCurrency = "";

// {
// 	"result": "success",
// 	"documentation": "https://www.exchangerate-api.com/docs",
// 	"terms_of_use": "https://www.exchangerate-api.com/terms",
// 	"time_zone": "UTC",
// 	"time_last_update": 1580947200,
// 	"time_next_update": 1580950860,
// 	"base": "USD",
// 	"conversion_rates": {
// 		"USD": 1,
// 		"AUD": 1.4817,
// 		"BGN": 1.7741,
// 		"CAD": 1.3168,
// 		"CHF": 0.9774,
// 		"CNY": 6.9454,
// 		"EGP": 15.7361,
// 		"EUR": 0.9013,
// 		"GBP": 0.7679,
// 		"...": 7.8536,
// 		"...": 1.3127,
// 		"...": 7.4722, etc. etc.
// 	}
// }

/**
 * Constructs query string for API call for pair exchange rates. PAID SUBSCRIPTION ONLY!
 * @param {Text} convertFrom 3-letter code for source currency
 * @param {Text} convertTo 3-letter code for destination currency
 */
function makeCurrencyPairQuery(convertFrom, convertTo) {
	var apiCall = _EXCHANGERATE_BASE;
	var queryType = _EXCHANGERATE_PAIRREQUEST;

    var queryString = "";

    var apiKey = _EXCHANGERATE_APIKEY;
    
	queryString = apiCall + "/" + apiKey + "/" + queryType + "/" + convertFrom + "/" + convertTo;
	
	return queryString;
}

/**
 * Constructs query string for API call for general exchange rates
 * @param {Text} convertFrom 3-letter code for source currency
 */
function makeCurrencyLatestQuery(convertFrom) {
	var apiCall = _EXCHANGERATE_BASE;
	var queryType = _EXCHANGERATE_LATESTREQUEST;

    var queryString = "";

    var apiKey = _EXCHANGERATE_APIKEY;
    
	queryString = apiCall + "/" + apiKey + "/" + queryType + "/" + convertFrom;
	
	return queryString;
}

/**
 * Makes the API call
 * @param {Text} queryString Query to pose to API
 */
function sendAjax_Exchange(queryString) {
    $.ajax({
        method: "GET",
        url: queryString,
    }).then(function (response) {
		returnCurrencyConversion(response);
    });
};

/**
 * Builds and runs the API call to get the current exchange rates for the source currency
 * @param {Text} convertFrom 3-letter Code for source currency
 * @param {Text} convertTo 3-letter Code for destination currency.
 */
function getCurrencyConversion(convertFrom, convertTo) {
	_sourceCurrency = convertFrom;
	_destinationCurrency = convertTo;

	sendAjax_Exchange(makeCurrencyLatestQuery(convertFrom));
}

/**
 * Displays Exchange Rate to screen
 * @param {Object} apiResponse Response package from API call
 */
function returnCurrencyConversion(apiResponse) {
	let conversionRates = apiResponse.conversion_rates;
	
	let sourceRate = "1";
	let destinationRate = conversionRates[_destinationCurrency];
	let exchangeFloat = parseFloat(destinationRate).toFixed(3);

	let textBox = $("#text-display");
    let existingText = textBox.text() + "\n\n";
    let msgResponse = "Currency Rate fetch:\n";
 
	let queryEnd = new Date();
    let queryLength = queryEnd.getTime() - _queryStart.getTime();

    msgResponse += _sourceCurrency + " to " + _destinationCurrency + " exchange rate is " + sourceRate + ":" + exchangeFloat + ".\n";
    msgResponse += "Query took: " + queryLength + " milliseconds."

    textBox.text(existingText + msgResponse);
}


/**
 * Runs when the user clicks the 'Get Currency Exchange' button
 */
function runCurrencyConversionTest() {
	var userInput = $("#destination-currency").val();
	var defaultSourceCurrency = _DEFAULT_SOURCECURRENCY;

	_queryStart = new Date();
	getCurrencyConversion(defaultSourceCurrency, userInput);
}

// Currency Code	Currency Name	Country
// AED	UAE Dirham	United Arab Emirates
// ARS	Argentine Peso	Argentina
// AUD	Australian Dollar	Australia
// BGN	Bulgarian Lev	Bulgaria
// BRL	Brazilian Real	Brazil
// BSD	Bahamian Dollar	Bahamas
// CAD	Canadian Dollar	Canada
// CHF	Swiss Franc	Switzerland
// CLP	Chilean Peso	Chile
// CNY	Chinese Renminbi	China
// COP	Colombian Peso	Colombia
// CZK	Czech Koruna	Czech Republic
// DKK	Danish Krone	Denmark
// DOP	Dominican Peso	Dominican Republic
// EGP	Egyptian Pound	Egypt
// EUR	Euro	Germany
// EUR	Euro	Austria
// EUR	Euro	Belgium
// EUR	Euro	Cyprus
// EUR	Euro	Estonia
// EUR	Euro	Finland
// EUR	Euro	France
// EUR	Euro	Greece
// EUR	Euro	Ireland
// EUR	Euro	Italy
// EUR	Euro	Latvia
// EUR	Euro	Lithuania
// EUR	Euro	Luxembourg
// EUR	Euro	Malta
// EUR	Euro	Netherlands
// EUR	Euro	Portugal
// EUR	Euro	Slovakia
// EUR	Euro	Slovenia
// EUR	Euro	Spain
// FJD	Fiji Dollar	Fiji
// GBP	Pound Sterling	United Kingdom
// GTQ	Guatemalan Quetzal	Guatemala
// HKD	Hong Kong Dollar	Hong Kong
// HRK	Croatian Kuna	Croatia
// HUF	Hungarian Forint	Hungary
// IDR	Indonesian Rupiah	Indonesia
// ILS	Israeli New Shekel	Israel
// INR	Indian Rupee	India
// ISK	Icelandic Krona	Iceland
// JPY	Japanese Yen	Japan
// KRW	South Korean Won	South Korea
// KZT	Kazakhstani Tenge	Kazakhstan
// MXN	Mexican Peso	Mexico
// MYR	Malaysian Ringgit	Malaysia
// NOK	Norwegian Krone	Norway
// NZD	New Zealand Dollar	New Zealand
// PAB	Panamanian Balboa	Panama
// PEN	Peruvian Sol	Peru
// PHP	Philippine Peso	Philippines
// PKR	Pakistani Rupee	Pakistan
// PLN	Polish Zloty	Poland
// PYG	Paraguayan Guarani	Paraguay
// RON	Romanian Leu	Romania
// RUB	Russian Ruble	Russia
// SAR	Saudi Riyal	Saudi Arabia
// SEK	Swedish Krona	Sweden
// SGD	Singapore Dollar	Singapore
// THB	Thai Baht	Thailand
// TRY	Turkish Lira	Turkey
// TWD	New Taiwan Dollar	Taiwan
// UAH	Ukrainian Hryvnia	Ukraine
// USD	United States Dollar	United States
// UYU	Uruguayan Peso	Uruguay
// ZAR	South African Rand	South Africa
