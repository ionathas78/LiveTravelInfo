//  **  Declarations

const _AIRLINE_APIBASE = "https://api.travelpayouts.com/v1";
const _AIRLINE_APICHEAPEST = "/prices/cheap";          //  Needs '?' after
const _AIRLINE_CURRENCY = "currency=%CURRENCY%";            //  Where %CURRENCY% is the currency code
const _AIRLINE_ORIGIN = "origin=%CITY%";                   //  Where %CITY% is the city code
const _AIRLINE_DESTINATION = "destination=%CITY%";         //  Where %CITY% is the city code
const _AIRLINE_DEPART = "depart_date=%YEAR%-%MONTH%";     //  Where %YEAR% is the year and %MONTH% is the month
const _AIRLINE_RETURN = "return_date=%YEAR%-%MONTH%";     //  Where %YEAR% is the year and %MONTH% is the month
const _AIRLINE_APIKEY = "token=%TOKEN%";                    //  Where %TOKEN% is the user's token
const _AIRLINE_TOKEN = "83fa8527d64346234a08793dc2258fe5";
const _AUSTIN_IATACODE = "AUS";
const _USDOLLAR_CURRENCYCODE = "USD";

var _response;
var _corsObject = createCORSRequest("GET", "google.com");

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

    // returnString += "&" + _AIRLINE_APIKEY;

    return returnString;
};

/**
 * Send specified Ajax query
 * @param {*} queryString Full API Call, including http(s)://
 */
function sendAjax(queryString) {
    console.log(queryString);

    // const proxyURL = "https://polar-bayou-73801.herokuapp.com";

    // _corsObject = createCORSRequest("GET", proxyURL + queryString);
    // // _corsObject.withCredentials = false;

    // // _corsObject.origin = "http://www.kystra.com";
    // _corsObject.onreadystatechange = corsLoad;

    // _corsObject.setRequestHeader("X-Access-Token", _AIRLINE_TOKEN);
    // _corsObject.setRequestHeader("Access-Control-Allow-Origin", "http://www.kystra.com");
    // _corsObject.setRequestHeader("Access-Control-Request-Method", "GET");
    // _corsObject.setRequestHeader("Access-Control-Request-Headers", "X-Access-Token");

    // console.log(_corsObject);

    // _corsObject.send();

    // jQuery.ajaxPrefilter(function(options) {
    //     if (options.crossDomain && jQuery.support.cors) {
    //         options.url = 'https://polar-bayou-73801.herokuapp.com/' + options.url;
    //         // options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    //     }
    // });
    
    queryString = "polar-bayou-73801.heroku.com/" + queryString;

    $.ajax({
        method: "GET",
        url: queryString,
        headers: {"X-Access-Token": _AIRLINE_TOKEN}
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
// jQuery.ajaxPrefilter(function(options) {
//     // let serverURL = 'https://cors-anywhere.herokuapp.com/';
//     let serverURL = 'cors-anywhere.js'
//     if (options.crossDomain && jQuery.support.cors) {
//         options.url = serverURL + options.url;
//     }
// });


function corsLoad() {
    console.log("corsLoad:");
    console.log(_corsObject);
    console.log(_corsObject.response);
}

//  **  Events

_corsObject.onload = function () {
    console.log("onload:");
    console.log(_corsObject);
};

//  **  Logic

sendAjax(makeAirlineQueryString("", "MEX"));




/**
 * Block to Handle CORS conflicts
 * taken from Rob Wu's cors-anywhere repository at:
 * https://github.com/Rob--W/cors-anywhere
 */
// // Listen on a specific host via the HOST environment variable
// var host = process.env.HOST || '0.0.0.0';
// // Listen on a specific port via the PORT environment variable
// var port = process.env.PORT || 8080;

// var cors_proxy = require('cors-anywhere');
// cors_proxy.createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// }).listen(port, host, function() {
//     console.log('Running CORS Anywhere on ' + host + ':' + port);
// });


/**
 * from Nicholas Zakas at
 * https://humanwhocodes.com/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing/
 * @param {*} method 
 * @param {*} url 
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
  
      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
    //   xhr.open(method, url, true);
    xhr.open(method, url);
  
    } else if (typeof XDomainRequest != "undefined") {
  
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
  
    } else {
  
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
  
    }
    return xhr;
  }
  
//   var xhr = createCORSRequest('GET', url);
//   if (!xhr) {
//     throw new Error('CORS not supported');
//   }