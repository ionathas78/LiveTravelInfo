// http://api.travelpayouts.com/v1/prices/cheap?origin=MOW&destination=HKT&depart_date=2020-04&return_date=2020-04&token=83fa8527d64346234a08793dc2258fe5


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

function makeAirlineQuery(destinationCode, departDate, returnDate) {
    var returnString = "";

    var queryBase = _AIRLINE_APIBASE;
    var apiCall = _AIRLINE_APICHEAPEST;
    var 
}

