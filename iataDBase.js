//  Uses the citiesData const from the cities.js file

const _TEST_CITYNAME = "Austin";
const _TEST_COUNTRYCODE = "";

// const _CORS_SERVER = "https://polar-bayou-73801.herokuapp.com/";
// const citiesURL = "https://github.com/SabrinaCat/LiveTravelInfo/blob/master/Assets/cities.json";
// const citiesURL = "https://github.com/SabrinaCat/LiveTravelInfo/master/Assets/cities.json";

// var _request = new XMLHttpRequest();
var _citiesDB;

/**
 * Returns city data from the cities DB file or _null_ if the city isn't found
 * @param {*} cityName Name of city for which to search
 * @param {*} countryCode Name of country in which the city falls. Uses "US" by default.
 */
function returnCityInfo(cityName, countryCode) {
    let startTime = Date.now();

    let returnObject = null;

    if ((!countryCode) ||(countryCode == "")) {
        countryCode = "US";
    };

    for (var city of citiesData) {
        if ((city.name == cityName) && (city.country_code == countryCode)) {
            returnObject = new CityData(city.name, city.country_code, city.code, city.coordinates.lat, city.coordinates.lon, city.time_zone);
            break;
        };
    };

    let endTime = Date.now();
    console.log("Lookup operation took " + (endTime - startTime) + " seconds.");
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

function main() {
    let testCity = returnCityInfo(_TEST_CITYNAME, _TEST_COUNTRYCODE);
    console.log(testCity);
    let userInput, msgOutput;

    do {
        userInput = prompt("City to search?", "Austin, US");
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
        elapsedTime = (endTime.getSeconds() - startTime.getSeconds())

        if (testCity) {
        msgOutput = testCity.name + ", " + testCity.country + "(" + testCity.code + ")\n" +
                    "LatLon: (" + testCity.coords.lat + ", " + testCity.coords.lon + ")\n" +
                    "Time Zone: " + testCity.timeZone + "\n" +
                    "Search took " + elapsedTime + " milliseconds.";
        } else {
            msgOutput = "Couldn't find '" + userInput + "'!"
        }
        alert(msgOutput);
    } while (userInput);


    // _request = new XMLHttpRequest();
    // _request.open("GET", _CORS_SERVER + citiesURL);
    // // _request.responseType = "json";
    // _request.send();

//     sendAjax_CORS(citiesURL);
};


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


main();
