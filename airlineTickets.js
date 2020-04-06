//  **  Declarations

const _CORS_SERVER = "https://polar-bayou-73801.herokuapp.com/";
const _AIRLINE_APIBASE = "https://api.travelpayouts.com/v2";
const _AIRLINE_APILATEST = "/prices/latest";                //  Needs '?' after
const _AIRLINE_CURRENCY = "currency=%CURRENCY%";            //  Where %CURRENCY% is the currency code
const _AIRLINE_ORIGIN = "origin=%CITY%";                    //  Where %CITY% is the city code
const _AIRLINE_DESTINATION = "destination=%CITY%";          //  Where %CITY% is the city code
const _AIRLINE_DEPART = "depart_date=%YEAR%-%MONTH%";       //  Where %YEAR% is the year and %MONTH% is the month
const _AIRLINE_RETURN = "return_date=%YEAR%-%MONTH%";       //  Where %YEAR% is the year and %MONTH% is the month
const _AIRLINE_APIKEY = "token=%TOKEN%";                    //  Where %TOKEN% is the user's token
const _AIRLINE_TOKEN = "83fa8527d64346234a08793dc2258fe5";
const _AUSTIN_IATACODE = "AUS";
const _USDOLLAR_CURRENCYCODE = "USD";

var _response;
var _queryStart = new Date();                               //  For test purposes only

//  **  Functions

/**
 * Get ticket results for Flights page
 * @param {Text} originCity City Code for departure city
 * @param {Text} destinationCity City Code for arrival city
 */
function ticketQueryByOriginAndDestination(originCity, destinationCity) {
    sendAjax_CORS_Airline(makeAirlineQueryString(originCity, destinationCity));
}

/**
 * Send specified Ajax query
 * @param {Text} queryString Full API Call, including http(s)://
 */
function sendAjax_CORS_Airline(queryString) {
    queryString = _CORS_SERVER + queryString;
    // console.log(queryString);

    $.ajax({
        method: "GET",
        url: queryString,
        headers: {"X-Access-Token": _AIRLINE_TOKEN}
    }).then(function (response) {
        _response = response;

        renderTicketResults(response);

        // console.log(response);
    });
};

/**
 * Display results to Flights page
 * @param {Object} response API response to ticket query
 */
function renderTicketResults (response) {
    let textBox = $("#text-display");
    let existingText = textBox.text() + "\n\n";
    let resultArray = response.data;
    let msgResponse = "Ticket Price fetch:\n";

    for (var i = 0; i < resultArray.length; i++) {
        let resultOrigin = resultArray[i].origin;
        let resultDestination = resultArray[i].destination;
        let resultDepart = resultArray[i].depart_date;
        let resultReturn = resultArray[i].return_date;
        let resultPrice = resultArray[i].value;
        let resultClass = returnTripClass(resultArray[i].trip_class);

        let msgLine = i + ": " + resultOrigin + " to " + resultDestination;
        
        if (!((resultDepart == "0001-01-01") || (resultDepart == ""))) {                 //  Placeholder value
            msgLine += " (depart " + resultDepart;

            if (!((resultReturn == "0001-01-01") || (resultReturn == ""))) {
                msgLine += ", return " + resultReturn;
            }

            msgLine += ")";
        };

        msgLine += ": $" + resultPrice + ", " + resultClass + " class.";

        msgResponse += msgLine + "\n";
    };
    if (resultArray.length < 1) {
        msgResponse += "No tickets found!";
    }

    textBox.text(existingText + msgResponse);

};

/**
 * Construct the API query string for the cheapest ticket search
 * @param {Text} originCode IATA code for the origin city (or blank for Austin)
 * @param {Text} destinationCode IATA code for the destination city
 * @param {Date} departDate Date to schedule departure
 * @param {Date} returnDate Date to schedule return
 */
function makeAirlineQueryString(originCode, destinationCode, departDate, returnDate) {
    var returnString = "";

    var queryBase = _AIRLINE_APIBASE;
    var apiCall = _AIRLINE_APILATEST;
    var currencySpec = _AIRLINE_CURRENCY.replace("%CURRENCY%", _USDOLLAR_CURRENCYCODE);
    var originSpec = "";
    var destinationSpec = _AIRLINE_DESTINATION.replace("%CITY%", destinationCode);
    var departSpec = "";
    var returnSpec = "";

    var originCity = "";

    if (!((originCode == "") || (originCode == null))) {
        originCity = originCode;
    } else {
        originCity = _AUSTIN_IATACODE;
    };

    originSpec = _AIRLINE_ORIGIN.replace("%CITY%", originCity);

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
                destinationSpec;

    if (departSpec != "") {
        returnString += "&" + departSpec;

        if (returnSpec != "") {
            returnString += "&" + returnSpec;
        };
    };

    return returnString;
};

//  **  Test Functions

/**
 * Send specified Ajax query
 * @param {Text} queryString Full API Call, including http(s)://
 */
function sendAjax_CORS_AirlineTest(queryString) {
    queryString = _CORS_SERVER + queryString;
    // console.log(queryString);

    $.ajax({
        method: "GET",
        url: queryString,
        headers: {"X-Access-Token": _AIRLINE_TOKEN}
    }).then(function (response) {
        _response = response;

        renderTicketTest(response);

        console.log(response);
    });
};

/**
 * Called when the user presses the 'Get Tickets' button on the Test Page
 */
function testTicketQuery() {
    let userInput = $("#test-tickets").val();

    _queryStart = new Date();
    sendAjax_CORS_AirlineTest(makeAirlineQueryString("", userInput));
};

/**
 * Displays the ticket results on the test page
 * @param {Object} response API response package
 */
function renderTicketTest(response) {
    let textBox = $("#text-display");
    let existingText = textBox.text() + "\n\n";
    let resultArray = response.data;
    let msgResponse = "Ticket Price fetch:\n";
    let queryEnd = new Date();
    let queryLength = queryEnd.getTime() - _queryStart.getTime();

    for (var i = 0; i < resultArray.length; i++) {
        let resultOrigin = resultArray[i].origin;
        let resultDestination = resultArray[i].destination;
        let resultDepart = resultArray[i].depart_date;
        let resultReturn = resultArray[i].return_date;
        let resultPrice = resultArray[i].value;
        let resultClass = returnTripClass(resultArray[i].trip_class);

        let msgLine = i + ": " + resultOrigin + " to " + resultDestination;
        
        if (!((resultDepart == "0001-01-01") || (resultDepart == ""))) {                 //  Placeholder value
            msgLine += " (depart " + resultDepart + ")";

            if (!((resultReturn == "0001-01-01") || (resultReturn == ""))) {
                msg += " (return " + resultReturn + ")";
            }
        };

        msgLine += ": $" + resultPrice + ", " + resultClass + " class.";

        msgResponse += msgLine + "\n";
    };
    if (resultArray.length < 1) {
        msgResponse += "No tickets found!";
    }
    msgResponse += "Query took: " + queryLength + " milliseconds."

    textBox.text(existingText + msgResponse);
};

//  **      Utility Functions

/**
 * Given the TravelPayouts API Ticket Class code, returns the name of the class
 * @param {Number} classCode Ticket Class code from the API response
 */
function returnTripClass(classCode) {
    let returnString = "";
    switch (classCode) {
        case 0:
            returnString = "Economy";
            break;
        case 1:
            returnString = "Business";
            break;
        case 2:
            returnString = "First";
        default:
    }
    return returnString;
};

//  **  Events


//  **  Logic





