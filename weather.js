//  **  Declarations

//  The _QTYPE group serves to identify the type of query inside the fetch and show functions
const _QTYPE_CURRENT_WEATHER = 1;
const _QTYPE_FORECAST_WEATHER = 2;
const _QTYPE_UVINDEX = 3;
const _QTYPE_INLINE_UVINDEX = 4;
const _QTYPE_PLACE = 5;                         //  For testing purposes only

//  OpenWeather API
const _OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";           
const _OPENWEATHER_CURRENT_APICALL = "/weather";                                //  For current weather conditions
const _OPENWEATHER_5DAY_APICALL = "/forecast";                                  //  For the 5-day forecast    
const _OPENWEATHER_UV_APICALL = "/uvi";                                         //  For the UV Index
const _OPENWEATHER_APIKEY = "&appid=e986f4791a0ed4a43eb9ec657994cadf";          //  API key

//  For forecast by city
const _OPENWEATHER_CITY_QUERY = "?q=%CITY%";                                    //  where %CITY% is the city name
const _OPENWEATHER_CITYSTATE_QUERY = "?q=%CITY%,%STATE%";                       //  where %CITY% is the city name and %STATE% is the name of the state.
//  You can also call by city ID or geographic coordinates
const _OPENWEATHER_LATLON_QUERY = "?lat=%LAT%&lon=%LON%";                       //  where %LAT% is latitude and %LON% is longitude.
//  or by ZIP Code
const _OPENWEATHER_ZIP_QUERY = "?zip=%ZIP%,us";                                 //   where %ZIP% is the code

//  MapQuest API
const _MAPQUEST_GEOCODE_BASE = "http://open.mapquestapi.com/geocoding/v1";   
const _MAPQUEST_REVERSE_APICALL = "/reverse";                                       //  Reverse geocoding
const _MAPQUEST_FORWARD_APICALL = "/forward";                                       //  Forward geocoding 
const _MAPQUEST_ADDRESS_APICALL = "/address";                                       //  For address lookup
const _MAPQUEST_LATLON = "?location=%LAT%,%LON%";                             //  where %LAT% is latitude and %LON% is longitude.
const _MAPQUEST_CITYSTATE = "?location=%CITY%,%STATE%";                         //  where %CITY% is the city name and %STATE% is the state.
const _MAPQUEST_APIKEY = "&key=s57L9cRQk0CZGiyqnipytbVrVQw9j2Dn";               //  API Key

var _queryStart = new Date();                                                   //  For testing purposes only
var _currentWeather, _weatherForecast, _uvIndex, _currentPlace;

//  **  Functions

/**
 * Run when the user clicks the 'Get Current Weather' button on the citySearch page
 * @param {Number} targetLatitude Latitude of target point
 * @param {Number} targetLongitude Longitude of target point
 */
function currentWeatherByLatLon(targetLatitude, targetLongitude) {
    queryWeather(targetLatitude, targetLongitude, _QTYPE_INLINE_UVINDEX);           //  Also run a non-displayed UV search
    queryWeather(targetLatitude, targetLongitude, _QTYPE_CURRENT_WEATHER);
};

/**
 * Run when the user clicks the 'Get Forecast' button on the CitySearch page
 * @param {Number} targetLatitude Latitude of target point
 * @param {Number} targetLongitude Longitude of target point
 */
function weatherForecastByLatLon(targetLatitude, targetLongitude) {
    queryWeather(targetLatitude, targetLongitude, _QTYPE_FORECAST_WEATHER);
};

/**
 * Run when the user clicks the 'Get UV Index' button on the CitySearch page
 * @param {Number} targetLatitude Latitude of target point
 * @param {Number} targetLongitude Longitude of target point
 */
function uvIndexByLatLon(targetLatitude, targetLongitude) {
    queryWeather(targetLatitude, targetLongitude, _QTYPE_UVINDEX);
};

/**
 * Run the API query
 * @param {Number} targetLatitude Latitude of target point
 * @param {Number} targetLongitude Longitude of target point
 * @param {*} queryType _QTYPE enumeration designating the type of API call
 */
function queryWeather(targetLatitude, targetLongitude, queryType) {
    var apiCall = "";
    var apiKey = _OPENWEATHER_APIKEY;
    var searchString = "";

    switch (queryType) {
        case _QTYPE_CURRENT_WEATHER:
            apiCall = _OPENWEATHER_CURRENT_APICALL;
            break;
        case _QTYPE_FORECAST_WEATHER:
            apiCall = _OPENWEATHER_5DAY_APICALL;
            break;
        case _QTYPE_UVINDEX:
            apiCall = _OPENWEATHER_UV_APICALL;
            break;
        case _QTYPE_INLINE_UVINDEX:
            _uvIndex = -1;                          //  So we'll know if we don't get the result back in time.
            apiCall = _OPENWEATHER_UV_APICALL;
            break;
        default:
    };

    searchString = _OPENWEATHER_LATLON_QUERY.replace("%LAT%", targetLatitude);
    searchString = searchString.replace("%LON%", targetLongitude);

    queryString = _OPENWEATHER_BASE + apiCall + searchString + apiKey;
    runAjaxQuery_Weather(queryString, queryType);
};

/**
 * Execute API call
 * @param {Text} queryString URL to query
 * @param {Number} queryType 1 - Current Weather, 2 - 5-Day Forecast...
 */
function runAjaxQuery_Weather(queryString, queryType) {
    $.ajax({
        url: queryString,
        method: "GET"
    }).then(function(response) {
        switch (queryType) {
            case _QTYPE_CURRENT_WEATHER:
                _currentWeather = response;
                break;

            case _QTYPE_FORECAST_WEATHER:
                _weatherForecast = response;
                break;

            case _QTYPE_UVINDEX, _QTYPE_INLINE_UVINDEX:
                _uvIndex = response;
                break;
            
            default:
        };
        renderResult(queryType);
    })
};

/**
 * Display results on screen.
 * @param {Number} queryType 1 - Current Weather, 2 - 5-day Forecast, 3 - UV Index
 */
function renderResult (queryType) {
    if (queryType == _QTYPE_INLINE_UVINDEX) {
        return;                         //  This one isn't displayed onscreen.
    }

    let textBox = $("#text-display");
    let existingText = textBox.text() + "\n\n";
    
    let msgOutput = " ";
    let cityName, weatherDescription, weatherTemperature, weatherHumidity, weatherWindSpeed;
    let dayName, msgLine;

    switch (queryType) {
        case _QTYPE_CURRENT_WEATHER:
            cityName = _currentWeather.name;
            weatherDescription = _currentWeather.weather[0].description;
            weatherTemperature = kelvinToFahrenheit(_currentWeather.main.temp).toFixed(1);
            weatherHumidity = _currentWeather.main.humidity;
            weatherWindSpeed = metersPerSecondToMilesPerHour(_currentWeather.wind.speed).toFixed(1);
            
            msgOutput += cityName + " - Current Weather Conditions:\n" +
                weatherDescription + "; Temp: " + weatherTemperature + "\xB0F; Rel. Humidity: " + weatherHumidity + "%; " +
                "Wind Speed: " + weatherWindSpeed + "mph."    

            if (_uvIndex > -1) {
                msgOutput += " UV Index: " + _uvIndex + ".";
            };

            break;

        case _QTYPE_FORECAST_WEATHER:
            cityName = _weatherForecast.city.name;
            msgOutput += cityName + " - 5-day Forecast:\n";
            
            for (var i = 4; i < _weatherForecast.list.length; i += 8) {
                dayName = dayOfWeek(new Date(_weatherForecast.list[i].dt_txt).getDay());
                if (dayName === undefined) {
                    dayName = dayOfWeek(new Date().getDay() + (i - 4) / 8 + 1);
                }
                weatherDescription = _weatherForecast.list[i].weather[0].description;
                weatherTemperature = kelvinToFahrenheit(_weatherForecast.list[i].main.temp).toFixed(1);
                weatherHumidity = _weatherForecast.list[i].main.humidity;
        
                // let backgroundImage = getWeatherIconURL(_weatherForecast.list[i].weather[0].icon);
                
                // let imageSize = "100%";
                // if (window.screen.availWidth < 450) {
                //     imageSize = "66%";
                // }
        
                // let styleCSS = "background-image: url(" + backgroundImage + "); " +
                //             "background-position: top; background-repeat: no-repeat;" +
                //             "background-size: " + imageSize + ";";
        
                msgLine = dayName + ": " + weatherDescription + "; Temp. " + weatherTemperature + "\xB0F; " +
                            "Rel. Humidity: " + weatherHumidity + "%.\n";
                
                msgOutput += msgLine;
            };        
            break;

        case _QTYPE_UVINDEX:
            msgOutput += "Current UV Index:\n";

            msgOutput += _uvIndex.value + "\n";
            break;

        default:            
    }
    
    textBox.text(existingText + msgOutput);
};


//  **      Test Functions

/**
 * Run when the user clicks the 'Get Current Weather' button on the test page
 */
function testCurrentWeather() {
    let userInput = $("#weather-search").val();

    _queryStart = new Date();
    queryWeatherTest(userInput, _QTYPE_CURRENT_WEATHER);
};

/**
 * Run when the user clicks the 'Get 5-day forecast' button
 */
function testWeatherForecast() {
    let userInput = $("#weather-search").val();

    _queryStart = new Date();
    queryWeatherTest(userInput, _QTYPE_FORECAST_WEATHER);
};

/**
 * Run when the user clicks the 'Get UV Index' button
 */
function testUVIndex() {
    let userInput = $("#weather-search").val();

    _queryStart = new Date();

    var userCity = userInput;
    var userState = "";
    var commaPos = -1;

    if (userInput) {
        commaPos = userInput.indexOf(",");
    };

    if (commaPos > -1) {
        userCity = userInput.substring(0, commaPos).trim();
        userState = userInput.substring(commaPos + 1).trim();
    };

    if (isNaN(userCity)) {
        queryPlaceByCityState(userCity, userState);
    } else {
        queryPlaceByLatLon(userCity, userState);
    };
};

// /**
//  * Run OpenWeather API Query for current and 5-day forecast
//  * @param {Text} searchTerm Specific Search Term to query in call
//  */
// function queryOpenweather(searchTerm) {

//     queryWeatherTest(searchTerm, _QTYPE_CURRENT_WEATHER);
//     queryWeatherTest(searchTerm, _QTYPE_FORECAST_WEATHER);
// };

/**
 * Given Search Term and the base API call, parses term into search query and execute search
 * @param {Text} searchTerm Term to call for search
 * @param {Number} queryType 1: Current Weather, 2: 5-Day Forecast, 3: UV Index, 4: Place Details
 */
function queryWeatherTest(searchTerm, queryType) {
    var apiCall = "";
    switch (queryType) {
        case _QTYPE_CURRENT_WEATHER:
            apiCall = _OPENWEATHER_CURRENT_APICALL;
            break;
        case _QTYPE_FORECAST_WEATHER:
            apiCall = _OPENWEATHER_5DAY_APICALL;
            break;
        case _QTYPE_UVINDEX:
            apiCall = _OPENWEATHER_UV_APICALL;
            break;
        default:
    };

    var apiKey = _OPENWEATHER_APIKEY;
    var searchString = "";
    var commaIndex = searchTerm.indexOf(",");
    var queryString = "";
    var term1 = searchTerm;
    var term2 = "";

    if (commaIndex > -1) {
        term1 = searchTerm.substring(0, commaIndex).trim();
        term2 = searchTerm.substring(commaIndex + 1).trim();
    };

    if (isNaN(term1)) {
        if (term2 != "") {
            searchString = _OPENWEATHER_CITYSTATE_QUERY.replace("%CITY%", term1);
            term2 = stateFullName(term2);                   //  OpenWeather doesn't work with state abbreviations
            searchString = searchString.replace("%STATE%", term2);
        } else {
            searchString = _OPENWEATHER_CITY_QUERY.replace("%CITY%", term1);
        };

    } else {
        if (term2 != "") {
            searchString = _OPENWEATHER_LATLON_QUERY.replace("%LAT%", term1);
            searchString = searchString.replace("%LON%", term2);
        } else {
            searchString = _OPENWEATHER_ZIP_QUERY.replace("%ZIP%", term1);
        };
    };

    queryString = _OPENWEATHER_BASE + apiCall + searchString + apiKey;
    runAjaxQuery_WeatherTest(queryString, queryType);
    // console.log(queryString);
};

/**
 * Uses given latlon to retrieve detailed location data
 * @param {Number} latitudeValue Latitude of target area
 * @param {Number} longitudeValue Longitude of target area
 */
function queryPlaceByLatLon(latitudeValue, longitudeValue) {
    var apiCall = _MAPQUEST_GEOCODE_BASE;
    var queryString = "";

    var apiKey = _MAPQUEST_APIKEY;
    var locationString = _MAPQUEST_LATLON.replace("%LAT%", latitudeValue);
    locationString = locationString.replace("%LON%", longitudeValue);

    queryString = apiCall + _MAPQUEST_REVERSE_APICALL + locationString + apiKey;

    runAjaxQuery_WeatherTest(queryString, _QTYPE_PLACE);
};

/**
 * Uses given city and state to retrieve detailed location data
 */
function queryPlaceByCityState(cityName, stateName) {
    var apiCall = _MAPQUEST_GEOCODE_BASE;
    var queryString = "";

    var apiKey = _MAPQUEST_APIKEY;
    var locationString = _MAPQUEST_CITYSTATE.replace("%CITY%", cityName);
    locationString = locationString.replace("%STATE%", stateName);

    queryString = apiCall + _MAPQUEST_ADDRESS_APICALL + locationString + apiKey;

    runAjaxQuery_WeatherTest(queryString, _QTYPE_PLACE);

};

/**
 * Parses given weather object to retrieve location data for UV query
 * @param {Number} latitudeValue Target latitude for query
 * @param {Number} longitudeValue Target longitude for query
 */
function queryUVIndex(latitudeValue, longitudeValue) {
    var apiCall = _OPENWEATHER_BASE;
    var queryString = "";

    var apiKey = _OPENWEATHER_APIKEY;
    var latLonString = _OPENWEATHER_LATLON_QUERY.replace("%LAT%", latitudeValue);
    latLonString = latLonString.replace("%LON%", longitudeValue);

    queryString = apiCall + _OPENWEATHER_UV_APICALL + latLonString + apiKey;

    runAjaxQuery_WeatherTest(queryString, _QTYPE_UVINDEX);
}

/**
 * Execute API call
 * @param {Text} queryString URL to query
 * @param {Number} queryType 1 - Current Weather, 2 - 5-Day Forecast
 */
function runAjaxQuery_WeatherTest(queryString, queryType) {
    $.ajax({
        url: queryString,
        method: "GET"
    }).then(function(response) {
        switch (queryType) {
            case _QTYPE_CURRENT_WEATHER:
                _currentWeather = response;

                queryPlaceByLatLon(response);
                queryUVIndex(response);

                renderCurrentTest();
                break;

            case _QTYPE_FORECAST_WEATHER:
                _forecastWeather = response;

                renderFiveDayTest();
                break;

            case _QTYPE_UVINDEX:
                _uvIndex = response;

                renderUVIndexTest(response);
                break;

            case _QTYPE_PLACE:
                _currentPlace = response;
                var responseLat = response.results[0].locations[0].latLng.lat;
                var responseLon = response.results[0].locations[0].latLng.lng;
                queryUVIndex(responseLat, responseLon);
                break;
            
            default:
        };
        renderResultTest(queryType);
    })
};

/**
 * Displays the current weather conditions to the screen
 */
function renderCurrentTest() {
    let textBox = $("#text-display");
    let existingText = textBox.text() + "\n\n";
    
    let msgOutput = "Results of current weather lookup:\n";
    let queryEnd = new Date();
    let queryLength = queryEnd.getTime() - _queryStart.getTime();

    let cityName = _currentWeather.name;
    let cityCode = _currentWeather.id;
    let weatherDescription = _currentWeather.weather[0].description;
    let weatherTemperature = kelvinToFahrenheit(_currentWeather.main.temp).toFixed(1);
    let weatherHumidity = _currentWeather.main.humidity;
    let weatherWindSpeed = metersPerSecondToMilesPerHour(_currentWeather.wind.speed).toFixed(1);

    msgOutput += cityName + " (" + cityCode + ") Current Weather Conditions:\n" +
                weatherDescription + "; Temp: " + weatherTemperature + "\xB0F; Rel. Humidity: " + weatherHumidity + "%; " +
                "Wind Speed: " + weatherWindSpeed + "mph." +
                "Search took " + queryLength + " milliseconds.";
    
    textBox.text(existingText + msgOutput);
};

/**
 * Displays the Five-Day forecast to the screen.
 */
function renderFiveDayTest() {
    let textBox = $("#text-display");
    let existingText = textBox.text() + "\n\n";
    
    let msgOutput = "Results of 5-day weather forecast:\n";
    let queryEnd = new Date();
    let queryLength = queryEnd.getTime() - _queryStart.getTime();

    for (var i = 4; i < _forecastWeather.list.length; i += 8) {
        let dayName = dayOfWeek(new Date(_forecastWeather.list[i].dt_txt).getDay());
        let weatherDescription = _forecastWeather.list[i].weather[0].description;
        let weatherTemperature = kelvinToFahrenheit(_forecastWeather.list[i].main.temp).toFixed(1);
        let weatherHumidity = _forecastWeather.list[i].main.humidity;

        let backgroundImage = getWeatherIconURL(_forecastWeather.list[i].weather[0].icon);
        
        let imageSize = "100%";
        if (window.screen.availWidth < 450) {
            imageSize = "66%";
        }

        let styleCSS = "background-image: url(" + backgroundImage + "); " +
                    "background-position: top; background-repeat: no-repeat;" +
                    "background-size: " + imageSize + ";";

        let msgLine = dayName + ": " + weatherDescription + "; Temp. " + weatherTemperature + "\xB0F; " +
                    "Rel. Humidity: " + weatherHumidity + "%.\n";
        
        msgOutput += msgLine;
    };

    msgOutput += "Search took " + queryLength + " milliseconds.";
    
    textBox.text(existingText + msgOutput);
};

/**
 * Displays the UV Index to the screen.
 * @param {Object} response Response from API call
 */
function renderUVIndexTest(response) {
    let textBox = $("#text-display");
    let existingText = textBox.text() + "\n\n";
    
    let msgOutput = "Results of UV Index call:\n";
    let queryEnd = new Date();
    let queryLength = queryEnd.getTime() - _queryStart.getTime();

    msgOutput += "Current UV Index: " + response.value + ".\n";
    msgOutput += "Search took " + queryLength + " milliseconds.";

    textBox.text(existingText + msgOutput);
};

/**
 * Commit results to screen
 * @param {Number} queryType 1 - Current Weather, 2 - 5-Day Forecast
 */
function renderResultTest(queryType) {
    switch (queryType) {
        case _QTYPE_CURRENT_WEATHER:
            console.log(_currentWeather[_searchIndex]);
            //  output result to weather pane.
            break;
        case _QTYPE_FORECAST_WEATHER:
            console.log(_forecastWeather[_searchIndex]);
            //  output result to forecast pane.
            break;
        case _QTYPE_PLACE:
            break;
        default:
    }
};

/**
 * Commit search history to the screen
 * @param {object} historyItem 
 */
function renderHistoryTest() {

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

    for (var i = 0; i < _cityHistory.length; i++) {
        childI = $("#history-item" + i);

        let historicalWeather = _currentWeather[_cityHistory[i].index];

        let cityName = _cityHistory[i].name 
        if (cityName.length < 11) {
            cityName += ", " + _cityHistory[i].state;
        }   
        let weatherDescription = historicalWeather.weather[0].description;
        let weatherTemperature = kelvinToFahrenheit(historicalWeather.main.temp).toFixed(1) + "\xB0F";
        let weatherHumidity = historicalWeather.main.humidity + "%";

        let backgroundImage = getWeatherIconURL(historicalWeather.weather[0].icon);
        
        childI.find(".history-city").text(cityName);
        childI.find(".history-description").text(weatherDescription);
        childI.find(".history-temperature").text(weatherTemperature);
        childI.find(".history-humidity").text(weatherHumidity);

        let imageSize = "80%";
        if (window.screen.availWidth < 450) {
            imageSize = "50%";
        }

        let styleCSS = "background-image: url(" + backgroundImage + "); " +
                    "background-position: top; background-repeat: no-repeat;" +
                    "background-size: " + imageSize + ";";
        
        childI.attr("style", styleCSS);
    };

}

//  **      Utility Functions

/**
 * Given an index, returns the name of the day of the week.
 * @param {Number} index Nonnegative whole number of day number to return
 */
function dayOfWeek(index) {
    if (index > 6) {
        index %= 7;
    };

    const weekdays = [
        "Sunday",
        "Monday", 
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]

    return weekdays[index];
};

/**
 * Convert Kelvin temperatures to Fahrenheit
 * @param {Number} degreesKelvin Temperature in Kelvin
 */
function kelvinToFahrenheit(degreesKelvin) {
    return (degreesKelvin - 273.15) * 9/5 + 32;
}

/**
 * Convert M/S measurements to MPH
 * @param {Number} metersPerSecond Meters per second
 */
function metersPerSecondToMilesPerHour(metersPerSecond) {
    return (metersPerSecond * 2.2369);
}

/**
 * Given state abbreviation, return full name
 * @param {Text} stateAbbreviation Abbreviation of state
 */
function stateFullName(stateAbbreviation) {
    var returnString = "";
    stateAbbreviation = stateAbbreviation.replace(/./g, "");
    stateAbbreviation = stateAbbreviation.replace(/ /g, "");

    switch (stateAbbreviation.toUpperCase()) {
        case "AL", "ALA", "ALABAMA":
            returnString = "Alabama";
        case "AK", "ALASKA":
            returnString = "Alaska";
        case "AS", "AMERICANSAMOA":
            returnString = "American Samoa";
        case "AZ", "ARIZ", "ARIZONA":
            returnString = "Arizona";
        case "AR", "ARK", "ARKANSAS":
            returnString = "Arkansas";
        case "CA", "CALIF", "CALIFORNIA":
            returnString = "California";
        case "CO", "COLO", "COLORADO":
            returnString = "Colorado";
        case "CT", "CONN", "CONNECTICUT":
            returnString = "Connecticut";
        case "DE", "DEL", "DELAWARE":
            returnString = "Delaware";
        case "DC", "WASHINGTONDC", "DISTRICTOFCOLUMBIA":
            returnString = "District of Columbia";
        case "FL", "FLA", "FLORIDA":
            returnString = "Florida";
        case "GA", "GEORGIA":
            returnString = "Georgia";
        case "GU", "GUAM":
            returnString = "Guam";
        case "HI", "HAWAII":
            returnString = "Hawaii";
        case "ID", "IDAHO":
            returnString = "Idaho";
        case "IL", "ILL", "ILLINOIS":
            returnString = "Illinois";
        case "IN", "IND", "INDIANA":
            returnString = "Indiana";
        case "IA", "IOWA":
            returnString = "Iowa";
        case "KS", "KANS", "KANSAS":
            returnString = "Kansas";
        case "KY", "KENTUCKY":
            returnString = "Kentucky";
        case "LA", "LOUISIANA":
            returnString = "Louisiana";
        case "ME", "MAINE":
            returnString = "Maine";
        case "MD", "MARYLAND":
            returnString = "Maryland";
        case "MH", "MARSHALLISLANDS":
            returnString = "Marshall Islands";
        case "MA", "MASS", "MASSACHUSETTS":
            returnString = "Massachusetts";
        case "MI", "MICH", "MICHIGAN":
            returnString = "Michigan";
        case "FM", "MICRONESIA":
            returnString = "Micronesia";
        case "MN", "MINN", "MINNESOTA":
            returnString = "Minnesota";
        case "MS", "MISS", "MISSISSIPPI":
            returnString = "Mississippi";
        case "MO", "MISSOURI":
            returnString = "Missouri";
        case "MT", "MONT", "MONTANA":
            returnString = "Montana";
        case "NE", "NEBR", "NEBRASKA":
            returnString = "Nebraska";
        case "NV", "NEV", "NEVADA":
            returnString = "Nevada";
        case "NH", "NEWHAMPSHIRE":
            returnString = "New Hampshire";
        case "NJ", "NEWJERSEY":
            returnString = "New Jersey";
        case "NM", "NEWMEXICO":
            returnString = "New Mexico";
        case "NY", "NEWYORK":
            returnString = "New York";
        case "NC", "NORTHCAROLINA":
            returnString = "North Carolina";
        case "ND", "NORTHDAKOTA":
            returnString = "North Dakota";
        case "MP", "NORTHERNMARIANAS":
            returnString = "Northern Marianas";
        case "OH", "OHIO":
            returnString = "Ohio";
        case "OK", "OKLA", "OKLAHOMA":
            returnString = "Oklahoma";
        case "OR", "ORE", "OREGON":
            returnString = "Oregon";
        case "PW", "PALAU":
            returnString = "Palau";
        case "PA", "PENNSYLVANIA":
            returnString = "Pennsylvania";
        case "PR", "PUERTORICO":
            returnString = "Puerto Rico";
        case "RI", "RHODEISLAND":
            returnString = "Rhode Island";
        case "SC", "SOUTHCAROLINA":
            returnString = "South Carolina";
        case "SD", "SOUTHDAKOTA":
            returnString = "South Dakota";
        case "TN", "TENN", "TENNESSEE":
            returnString = "Tennessee";
        case "TX", "TEX", "TEXAS":
            returnString = "Texas";
        case "UT", "UTAH":
            returnString = "Utah";
        case "VT", "VERMONT":
            returnString = "Vermont";
        case "VA", "VIRGINIA":
            returnString = "Virginia";
        case "VI", "VIRGINISLANDS":
            returnString = "Virgin Islands";
        case "WA", "WASH", "WASHINGTON":
            returnString = "Washington";
        case "WV", "WVA", "WESTVIRGINIA":
            returnString = "West Virginia";
        case "WI", "WIS", "WISCONSIN":
            returnString = "Wisconsin";
        case "WY", "WYO", "WYOMING":
            returnString = "Wyoming";
        default:    
    };
    return returnString;
};

/**
 * Get URL for weather icon PNG
 * @param {Number} weatherCode OpenWeatherMap weather code
 * @param {Number} sizeScale 2x is standard (?)
 */
function getWeatherIconURL(iconName) {
    const iconURL = "http://openweathermap.org/img/wn/";
    const urlScale = "@2x.png";

    // var iconName = weatherIcon(weatherCode);

    return iconURL + iconName + urlScale;
}




//  **  Events




//  **  Logic


