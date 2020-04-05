//  **  Declarations

const _WHEREIS_APIBASE = "http://www.travelpayouts.com/whereami";

const _WHEREIS_LOCALE = "locale=%LOCALE%";            //  Where %LOCALE% is the locale code (i.e., 'en')
const _WHEREIS_CALLBACK = "callback=%NAME%";            //  Where %NAME% is the name for the response object (e.g., 'useriata')
const _WHEREIS_IPADDRESS = "ip=%ADDRESS%";              //  Where %ADDRESS% is the user's IP address

const _US_LOCALE = "en";
const _CALLBACK_NAME = "useriata";

var _startTime = Date.now();
var _response;
var _userCityCode = "";

//  **  Functions

function runWhereAmI () {
    sendAjaxQuery_WhereAmI(makeWhereAmIQueryString());
}

/**
 * Send specified Ajax query
 * @param {Text} queryString Full API Call, including http(s)://
 */
function sendAjaxQuery_WhereAmI(queryString) {
    console.log(queryString);

    $.ajax({
        method: "GET",
        url: queryString
    }).then(function (response) {
        _response = response;
        renderWhereIAm(response);
    });
};

function renderWhereIAm(response) {
    let textBox = $("#source-city");

    let resultCityCode = response.iata;
    // let resultCityName = response.name;
    // let resultCountryName = response.country_name;
    
    textBox.val(resultCityCode);
};

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
    
    // returnString = baseString + "?" +
    //             localeString + "&" +
    //             callbackString;
    
    returnString = baseString + "?" +
                localeString;

    if (ipString != "") {
        returnString += "&" + ipString;
    }

    return returnString;
};

/**
 * Send specified Ajax query
 * @param {Text} queryString Full API Call, including http(s)://
 * @param {Boolean} doRender Render results to page?
 */
function sendAjaxTest(queryString, doRender) {
    console.log(queryString);

    $.ajax({
        method: "GET",
        url: queryString
    }).then(function (response) {
        _response = response;
        _userCityCode = response.iata;
        console.log(response);
        if (doRender) {
            renderWhereIAmTest(response);
        };
    });
};



/**
 * Runs when the user presses the Where Am I? button on the Test page
 */
function testWhereAmI() {

    _startTime = Date.now();
    sendAjaxTest(makeWhereAmIQueryString(), true);
};

/**
 * Populates the global variable _userCityCode with the resulting IATA code without displaying the
 * results to screen.
 */
function getWhereAmI() {
    sendAjaxTest(makeWhereAmIQueryString(), false);
};

/**
 * Displays result to the screen.
 * @param {*} response API response
 */
function renderWhereIAmTest (response) {
    let textBox = $("#text-display");
    let existingText = textBox.text() + "\n\n";

    let msgResponse = "Where Am I results:\n";
    let queryEnd = new Date();
    let queryLength = queryEnd.getTime() - _queryStart.getTime();

    let resultCityCode = response.iata;
    let resultCityName = response.name;
    let resultCountryName = response.country_name;
    let resultCoords = response.coordinates;

    let colonPos = -1;
    let resultLat = "";
    let resultLon = "";

    if (resultCoords) {
        colonPos = resultCoords.indexOf(":");
    };
    if (colonPos > -1) {
        resultLat = resultCoords.substring(0, colonPos);
        resultLon = resultCoords.substring(colonPos + 1);
    }
    
    let msgLine = "User location: " + resultCityName + " (" + resultCityCode + ") in " + resultCountryName + ".";
    if (resultLat != "") {
        msgLine += " Coordinates (Latitude, Longitude): " + resultLat + ", " + resultLon + "."
    };
    
    msgLine += " Query took " + queryLength + " milliseconds.";
    msgResponse += msgLine + "\n";
    
    $("#text-display").text(existingText + msgResponse);
}

//  **  Events


//  **  Logic

// sendAjax(makeWhereAmIQueryString());

getWhereAmI();



