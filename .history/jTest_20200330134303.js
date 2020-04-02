// http://api.travelpayouts.com/v1/prices/cheap?origin=MOW&destination=HKT&depart_date=2020-04&return_date=2020-04&token=83fa8527d64346234a08793dc2258fe5


const airlineAPIBase = "http://api.travelpayouts.com/v1";
const airlineAPICheapestTickets = "/prices/cheap";          //  Needs '?' after
const airlineAPIOrigin = "origin=%CITY%";                   //  Where %CITY% is the city code
const airlineAPIDestination = "destination=%CITY%";         //  Where %CITY% is the city code
const airlineDepartDate = "depart_date=%YEAR%-%MONTH%";     //  Where %YEAR% is the year and %MONTH% is the month
const airlineReturnDate = "return_date=%YEAR%-%MONTH%";     //  Where %YEAR% is the year and %MONTH% is the month
const airlineAPIKey = "token=83fa8527d64346234a08793dc2258fe5"



