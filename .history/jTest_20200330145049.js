//  **  Declarations

const _AIRLINE_APIBASE = "http://api.travelpayouts.com/v1";
const _AIRLINE_APICHEAPEST = "/prices/cheap";          //  Needs '?' after
const _AIRLINE_CURRENCY = "currency=%CURRENCY%";            //  Where %CURRENCY% is the currency code
const _AIRLINE_ORIGIN = "origin=%CITY%";                   //  Where %CITY% is the city code
const _AIRLINE_DESTINATION = "destination=%CITY%";         //  Where %CITY% is the city code
const _AIRLINE_DEPART = "depart_date=%YEAR%-%MONTH%";     //  Where %YEAR% is the year and %MONTH% is the month
const _AIRLINE_RETURN = "return_date=%YEAR%-%MONTH%";     //  Where %YEAR% is the year and %MONTH% is the month
const _AIRLINE_APIKEY = "token=83fa8527d64346234a08793dc2258fe5"

const _AUSTIN_IATACODE = "AUS";
const _USDOLLAR_CURRENCYCODE = "USD";

var _response;

//  **  Functions

/**
 * Construct the API query string for the cheapest ticket search
 * @param {*} originCode IATA code for the origin city (or blank for Austin)
 * @param {*} destinationCode IATA code for the destination city
 * @param {*} departDate Date to schedule departure
 * @param {*} returnDate Date to schedule return
 */
function makeAirlineQueryString(originCode, destinationCode, departDate, returnDate) {
    var returnString = "";

    var queryBase = _AIRLINE_APIBASE;
    var apiCall = _AIRLINE_APICHEAPEST;
    var currencySpec = _AIRLINE_CURRENCY.replace("%CURRENCY%", _USDOLLAR_CURRENCYCODE);
    var originSpec = "";
    var destinationSpec = _AIRLINE_DESTINATION.replace("%CITY%", destinationCode);
    var departSpec = "";
    var returnSpec = "";

    var originCity = _AUSTIN_IATACODE;

    if ((originCode == "") || (originCode === null)) {
        originCity = originCode;
    };

    originSpec = originSpec.replace("%CITY%", originCity);

    if (departDate >= Date.now()) {
        let departMonth = departDate.getMonth();
        let departYear = departDate.getYear();
        departSpec = _AIRLINE_DEPART.replace("%YEAR%", departYear);
        departSpec = departSpec.replace("%MONTH%", departMonth);
    };

    if (returnDate >= departDate) {
        let returnMonth = returnDate.getMonth();
        let returnYear = returnDate.getYear();
        returnSpec = _AIRLINE_RETURN.replace("%YEAR%", returnYear);
        returnSpec = returnSpec.replace("%MONTH%", returnMonth);
    };

    returnString = queryBase + apiCall + "?" + 
                currencySpec + "&" +
                originSpec + "&" +
                destinationCode;

    if (departSpec != "") {
        returnString += "&" + departSpec;

        if (returnSpec != "") {
            returnString += "&" + returnSpec;
        };
    };

    returnString += "&" + _AIRLINE_APIKEY;

    return returnString;
};

/**
 * Send specified Ajax query
 * @param {*} queryString Full API Call, including http(s)://
 */
function sendAjax(queryString) {
    console.log(queryString);

    $.ajax({
        method: "GET",
        url: queryString
    }).then(function (response) {
        _response = response;
        console.log(response);
    });
};

/**
 * Handle CORS conflicts
 * taken from Rob Wu's cors-anywhere repository at:
 * https://github.com/Rob--W/cors-anywhere
 */
jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

//  **  Events

//  **  Logic

sendAjax(makeAirlineQueryString("", "MEX"));

