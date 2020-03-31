//  **  Declarations

const _WHEREIS_APIBASE = "http://www.travelpayouts.com/whereami";

const _WHEREIS_LOCALE = "locale=%LOCALE%";            //  Where %LOCALE% is the locale code (i.e., 'en')
const _WHEREIS_CALLBACK = "callback=%NAME%";            //  Where %NAME% is the name for the response object (e.g., 'useriata')
const _WHEREIS_IPADDRESS = "ip=%ADDRESS%";              //  Where %ADDRESS% is the user's IP address

const _US_LOCALE = "en";
const _CALLBACK_NAME = "useriata";

var _response;

//  **  Functions

/**
 * Construct the API query string for the cheapest ticket search
 * @param {*} originCode IATA code for the origin city (or blank for Austin)
 * @param {*} destinationCode IATA code for the destination city
 * @param {*} departDate Date to schedule departure
 * @param {*} returnDate Date to schedule return
 */
function makeWhereAmIQueryString(localeCode, callbackName, ipAddress) {
    var returnString = "";

    if ((!localeCode) || (localeCode == "")) {
        localeCode = _US_LOCALE;
    };

    if ((!callbackName) || (callbackName == "")) {
        callbackName = _CALLBACK_NAME;
    };

    if (!ipAddress) {
        ipAddress = "";
    }

    var baseString = _WHEREIS_APIBASE;
    var localeString = _WHEREIS_LOCALE.replace("%LOCALE%", _US_LOCALE);
    var callbackString = _WHEREIS_CALLBACK.replace("%NAME%", _CALLBACK_NAME);
    var ipString = "";

    if (ipAddress != "") {
        ipString = _WHEREIS_IPADDRESS.replace("%ADDRESS%", ipAddress);
    }
    
    returnString = baseString + "?" +
                localeString + "&" +
                callbackString;
    
    if (ipString != "") {
        returnString += "&" + ipString;
    }

    return returnString;
};

/**
 * Send specified Ajax query
 * @param {*} queryString Full API Call, including http(s)://
 */
function sendAjax(queryString) {
    console.log(queryString);
    // queryString = _CORS_SERVER + queryString;

    $.ajax({
        method: "GET",
        url: queryString
        // headers: {"X-Access-Token": _AIRLINE_TOKEN}
    }).then(function (response) {
        _response = response;
        console.log(response);
    });
};

//  **  Events


//  **  Logic

sendAjax(makeWhereAmIQueryString());




