//  Uses the citiesData const from the cities.js file

const _TEST_CITYNAME = "Austin";
const _TEST_COUNTRYCODE = "";
const _DEFAULT_COUNTRYCODE = "US";

// const _CORS_SERVER = "https://polar-bayou-73801.herokuapp.com/";
// const citiesURL = "https://github.com/SabrinaCat/LiveTravelInfo/blob/master/Assets/cities.json";
// const citiesURL = "https://github.com/SabrinaCat/LiveTravelInfo/master/Assets/cities.json";

// var _request = new XMLHttpRequest();
var _citiesDB;
var _queryStart = new Date();

/**
 * Returns city data from the cities DB file or _null_ if the city isn't found
 * @param {*} cityName Name of city for which to search
 * @param {*} countryCode Name of country in which the city falls. Uses "US" by default.
 */
function returnCityInfo(cityName, countryCode) {
    // let startTime = Date.now();
    let returnObject = null;

    if (!countryCode) {
        countryCode = "";
    };

    for (var city of citiesData) {
        if ((city.name == cityName) && ((city.country_code == countryCode) || (countryCode == ""))) {
            returnObject = new CityData(city.name, city.country_code, city.code, city.coordinates.lat, city.coordinates.lon, city.time_zone);
            break;
        };
    };

    // let endTime = Date.now();
    // console.log("Lookup operation took " + (endTime - startTime) + " seconds.");
    return returnObject;
};

/**
 * Use with the NEW keyword to create a new instance of a CityData container object
 * @param {Text} cityName Name of city
 * @param {Text} countryName Name of country in which the city resides
 * @param {Text} cityCode IATA city code
 * @param {Number} cityLatitude Latitude of city's coordinates
 * @param {Number} cityLongitude Longitude of city's coordinates
 * @param {Text} cityTimeZone Time Zone in which the city falls
 */
function CityData(cityName, countryName, cityCode, cityLatitude, cityLongitude, cityTimeZone) {
    return {
        name: cityName,
        state: "",
        country: countryName,
        code: cityCode,
        coords: {
            lat: cityLatitude,
            lon: cityLongitude
        },
        timeZone: cityTimeZone
    };
};

/**
 * Given a city and its expected country, displays the results to the page.
 * @param {*} findCity 
 * @param {*} findCountry 
 */
function renderCity (findCity, findCountry) {
    let textBox = $("#text-display");
    let existingText = textBox.text() + "\n\n";
    
    let cityResult = returnCityInfo(findCity, findCountry);
    let msgOutput = "Results of city code lookup:\n";
    let queryEnd = new Date();
    let queryLength = queryEnd.getTime() - _queryStart.getTime();

    if (cityResult) {
        msgOutput += cityResult.name + ", " + cityResult.country + " (" + cityResult.code + "). " +
                    "LatLon: (" + cityResult.coords.lat + ", " + cityResult.coords.lon + "). " +
                    "Time Zone: " + cityResult.timeZone + "\n" +
                    "Search took " + queryLength + " milliseconds.";
    } else {
        let userInput = findCity;
        if (findCountry) {
            userInput += ", " + findCountry
        }
        msgOutput += "Couldn't find '" + userInput + "'!"
    }
    
    textBox.text(existingText + msgOutput);
    };

/**
 * Test bed for DB search function.
 */
function testCityDB() {
    let testCity = returnCityInfo(_TEST_CITYNAME, _TEST_COUNTRYCODE);
    console.log(testCity);
    let userInput, msgOutput;

    userInput = prompt("City to search?", "Austin, US");
        
    while (userInput) {
        let userCity = "";
        let userState = "";
        let commaPos = -1;
        let startTime, endTime, elapsedTime;
        
        if (userInput) {
            commaPos = userInput.indexOf(",");
        }

        if (commaPos > -1) {
            userCity = userInput.substring(0, commaPos).trim();
            userState = userInput.substring(commaPos + 1).trim();
        } else {
            userCity = userInput;
        };

        startTime = new Date();
        testCity = returnCityInfo(userCity, userState);
        endTime = new Date();
        elapsedTime = (endTime.getMilliseconds() - startTime.getMilliseconds())

        if (testCity) {
        msgOutput = testCity.name + ", " + testCity.country + " (" + testCity.code + ")\n" +
                    "LatLon: (" + testCity.coords.lat + ", " + testCity.coords.lon + ")\n" +
                    "Time Zone: " + testCity.timeZone + "\n" +
                    "Search took " + elapsedTime + " milliseconds.";
        } else {
            msgOutput = "Couldn't find '" + userInput + "'!"
        }
        alert(msgOutput);

        userInput = prompt("City to search?", "Austin, US");
    };


    // _request = new XMLHttpRequest();
    // _request.open("GET", _CORS_SERVER + citiesURL);
    // // _request.responseType = "json";
    // _request.send();

//     sendAjax_CORS(citiesURL);
};

/**
 * Runs when the user clicks the Get City Code button
 */
function runCitySearch() {
    let userInput = $("#city-search").val();
    
    let commaPos = -1;
    let userCity = "";
    let userCountry = "";

    if (userInput) {
        commaPos = userInput.indexOf(",");
    };

    if (commaPos > -1) {
        userCity = userInput.substring(0, commaPos).trim();
        userCountry = userInput.substring(commaPos + 1).trim();
    } else {
        userCity = userInput.trim();
    }

    _queryStart = new Date();
    renderCity(userCity, userCountry);
}

// _request.onload = function() {
//     _citiesDB = _request.response;
//     console.log(_request);
//     console.log(_citiesDB);
// };

// /**
//  * Send specified Ajax query
//  * @param {*} queryString Full API Call, including http(s)://
//  */
// // function sendAjax_CORS(queryString) {
//     queryString = _CORS_SERVER + queryString;

//     $.ajax({
//         method: "GET",
//         url: queryString,
//         // headers: {"X-Access-Token": _AIRLINE_TOKEN}
//     }).then(function (response) {
//         _citiesDB = response;
//         console.log(response);
//     });
// };


// testCityDB();
