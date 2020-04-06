//  Uses the citiesData const from the cities.js file and the countriesData const from countries.js

const _TEST_CITYNAME = "Austin";                            //  For test purposes only.
const _TEST_COUNTRYCODE = "";                               //      ibid.
const _FUZZYMATCH_THRESHOLD = 0.65;                         //  Percentage threshold for a misspelling to make a fuzzy match
const _DESTINATIONSET_MAXLENGTH = 5;                        //  Number of historical results to store
const _DEFAULT_DESTINATION_COUNTRYCODE = "AF";              //  Default country on the main page. Used to prioritize exact matching.

var _citiesDB;
var _queryStart = new Date();                               //  For test purposes only

//  **      Functions

/**
 * Runs when the user clicks the Search button on the Index page
 * @param {Text} cityName Name of city for which to search
 * @param {Text} countryName Name of country in which to search for city
 */
function searchCityAndCountry(cityName, countryName) {
    let commaPos = -1;
    let userCity = "";
    let userCountry = "";

    if (cityName) {
        commaPos = cityName.indexOf(",");
    }

    if (commaPos > -1) {
        userCity = cityName.substring(0, commaPos).trim();
        let locatedCountry = returnCountryInfo(cityName.substring(commaPos + 1).trim());
        if (locatedCountry) {
            userCountry = locatedCountry.code;
        };
    } else {
        userCity = cityName.trim();
        userCountry = countryName;
    }

    let cityPick = returnCityInfo(userCity, userCountry, _DEFAULT_DESTINATION_COUNTRYCODE, true);
    if (!cityPick) {
        let pError = $("#error-text");
        let errorMsg = "Couldn't find city '" + userCity + ", " + userCountry + "'!";
        
        pError.text(errorMsg);
        pError.show();  
        return;
    };

    let destinationSet = localStorage.getItem("travelDestination");
    if (!destinationSet) {
        destinationSet = [];
    } else {
        destinationSet = JSON.parse(destinationSet);
    }

    destinationSet.push(cityPick);
    if (destinationSet.length > _DESTINATIONSET_MAXLENGTH) {
        destinationSet.shift();
    }

    localStorage.setItem("travelDestination", JSON.stringify(destinationSet));
    window.location.href = "citySearch.html";
}

/**
 * Use with the NEW keyword to create a new instance of a CityData container object
 * @param {Text} cityName Name of city
 * @param {Text} countryCode Code of country in which the city resides
 * @param {Text} cityCode IATA city code
 * @param {Number} cityLatitude Latitude of city's coordinates
 * @param {Number} cityLongitude Longitude of city's coordinates
 * @param {Text} cityTimeZone Time Zone in which the city falls
 */
function CityData(cityName, countryCode, cityCode, countryCurrency, cityLatitude, cityLongitude, cityTimeZone) {
    return {
        name: cityName,
        state: "",
        country: countryCode,
        code: cityCode,
        currency: countryCurrency,
        coords: {
            lat: cityLatitude,
            lon: cityLongitude
        },
        timeZone: cityTimeZone
    };
};

/**
 * Returns city data from the cities DB file or _null_ if the city isn't found
 * @param {Text} cityName Name of city for which to search
 * @param {Text} countryCode Name of country in which the city falls. Uses "US" by default.
 * @param {Text} defaultCountryCode If provided, weights fuzzy logic by city differently.
 * @param {Boolean} doIgnoreCountryToMatch FALSE by default. If TRUE, will omit the country code to find a city match.
 */
function returnCityInfo(cityName, countryCode, defaultCountryCode, doIgnoreCountryToMatch) {
    let returnObject = null;

    if (!countryCode) {
        countryCode = "";
    };

    for (var city of citiesData) {
        if ((city.name == cityName) && ((city.country_code == countryCode) || (countryCode == ""))) {
            returnObject = new CityData(city.name, city.country_code, city.code, "" ,city.coordinates.lat, city.coordinates.lon, city.time_zone);
            break;
        };
    };

    if ((!returnObject) && (defaultCountryCode == countryCode) && (countryCode != "")) {
        returnCityInfo(cityName, "", "X", false);
    };

    if (!returnObject) {
        let matchCity;
        let matchPercent = 0;
        for (var fuzzyCity of citiesData) {
            if ((countryCode == fuzzyCity.country_code) || (countryCode == "")) {
                let testPercent = textPercentMatch(cityName, fuzzyCity.name)

                if (testPercent > matchPercent) {
                    matchPercent = testPercent;
                    matchCity = fuzzyCity;
                };
            };
        };

        if (matchPercent >= _FUZZYMATCH_THRESHOLD) {
            returnObject = new CityData(matchCity.name, matchCity.country_code, matchCity.code, "", matchCity.coordinates.lat, matchCity.coordinates.lon, matchCity.time_zone);
        };
    };

    if (!returnObject && doIgnoreCountryToMatch && (countryCode != "")) {
        returnObject = returnCityInfo(cityName, "", "X", false);           
    };

    if (returnObject) {
        let countryCurrency = returnCountryInfo(returnObject.countryCode);
        returnObject.currencyCode = countryCurrency;
    };

    return returnObject;
};

/**
 * Return information on the given country
 * @param {Text} countryName Name of country for which to search
 */
function returnCountryInfo (countryName) {
    let returnObject = {name: "", code: "", currency: "", currencyName: ""};

    for (var country of countriesData) {
        if (country.name == countryName) {
            returnObject.name = country.name;
            returnObject.code = country.code;
            returnObject.currencyCode = country.currencyCode;
            returnObject.currencyName = country.currency;
            break;
        };
    };

    if (returnObject.code == "") {
        for (var country of countriesData) {
            if (country.code == countryName) {
                returnObject.name = country.name;
                returnObject.code = country.code;
                returnObject.currencyCode = country.currencyCode;
                returnObject.currencyName = country.currency;
                break;
            };
        };
    };

    if (returnObject.code == "") {
        let matchName = "";
        let matchCode = "";
        let matchCurrencyCode = "";
        let matchCurrencyName = "";
        let matchPercent = 0;

        for (var country of countriesData) {
            let testPercent = textPercentMatch(countryName, country.name);
            if (testPercent > matchPercent) {
                matchPercent = testPercent;

                matchName = country.name;
                matchCode = country.code;
                matchCurrencyCode = country.currencyCode;
                matchCurrencyName = country.currency;
            };
        };

        if (matchPercent >= _FUZZYMATCH_THRESHOLD) {
            returnObject.name = matchName;
            returnObject.code = matchCode;
            returnObject.currencyCode = matchCurrencyCode;
            returnObject.currencyName = matchCurrencyName;
        }
    };

    return returnObject;
};

//  **      Test Functions

/**
 * Test bed for DB search function.
 */
function testCityDB() {
    let testCity = returnCityInfo(_TEST_CITYNAME, _TEST_COUNTRYCODE, true);
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
        testCity = returnCityInfo(userCity, userState, false);
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
};

/**
 * Runs when the user clicks the Get City Code button on the Test Page.
 */
function testCitySearch() {
    let userInput = $("#city-search").val();
    
    let commaPos = -1;
    let userCity = "";
    let userCountry = "";

    if (userInput) {
        commaPos = userInput.indexOf(",");
    };

    if (commaPos > -1) {
        userCity = userInput.substring(0, commaPos).trim();
        let locatedCountry = returnCountryInfo(userInput.substring(commaPos + 1).trim());
        if (locatedCountry) {
            userCountry = locatedCountry.code;
        };
    } else {
        userCity = userInput.trim();
    }

    _queryStart = new Date();
    renderCityTest(userCity, userCountry);
}

/**
 * Given a city and its expected country, displays the results to the test bed page.
 * @param {Text} findCity Name of city for which to search
 * @param {Text} findCountry Name of country for which to search
 */
function renderCityTest (findCity, findCountry) {
    let textBox = $("#text-display");
    let existingText = textBox.text() + "\n\n";
    
    let cityResult = returnCityInfo(findCity, findCountry, false);
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

//  **      Utility Functions

/**
 * Compares two strings and returns the percentage of similarity.
 * Works best if the two strings are comparable in length; this is mainly designed to catch misspellings.
 * Uses countString() because I couldn't find a better equivalent in vanilla JS.
 * @param {Number} txt1 First string to compare
 * @param {Number} txt2 Second string to compare
 * Original algorithm copyright 2015 by Jonathan Andrews; open for use per MIT license.
 */
function textPercentMatch (txt1, txt2) {
    //  Returns a number between 0 and 1 approximating the similarity between two given strings.
    //      1 is reserved for an exact match. Any differences will max out the match at 0.995.
    let returnPercent = -1;

    if (txt1 == txt2) {                     
        returnPercent = 1;

    } else if ((!txt1) || (!txt2)) {        
        returnPercent = (txt1 === txt2);
        
    } else {                                
        let longString, shortString;

        if (txt1.length >= txt2.length) {
            longString = txt1;
            shortString = txt2;
        } else {
            longString = txt2;
            shortString = txt1;
        };
        
        let startPos = 0;
        let charactersMatched = 0;
        let endPosShort = shortString.length - 1;
        let resultIncrement = 995 / (longString.length - countString(longString, " ")); 
                    //  Working in whole(ish) numbers to avoid floating point madness
        
        //      Work through the shorter string, comparing it to the longer
        while (startPos <= endPosShort) {
            let matchString = "";
            let matchLength = 0;
            let significantLength = 0;
            
            do {
                matchLength++;
                matchString = shortString.substr(startPos, matchLength);
            } while ((startPos + matchLength <= endPosShort) && (longString.indexOf(matchString) > -1));

            if (startPos + matchLength < endPosShort) {
                //      Remove the unmatched character from the match count
                matchLength--;
            };

            significantLength = matchLength - countString(matchString, " ");
            if (significantLength > 1) {
                //      Take the matched string out of our comparison rubric so it doesn't get counted again
                charactersMatched += significantLength;
                matchString = matchString.substr(0, matchLength);
                longString = longString.replace(matchString, "");
            };
            
            if (matchLength > 1) {
                startPos += matchLength;
            } else {
                startPos++;
            };
        };

        returnPercent = charactersMatched * resultIncrement / 1000;
    };

    return returnPercent;
};

/**
 * Counts the instances of given string inside another string
 * @param {Text} baseText Text in which to search for the search string
 * @param {Text} searchText Text for which to search
 */
function countString(baseText, searchText) {
    let returnCount = 0;
    let characterPos = 0;
    let endPos = baseText.length - 1;
    do {
        characterPos = baseText.indexOf(searchText, characterPos + 1);
        if (characterPos > 0) {
            returnCount++;
        };
    } while ((characterPos > -1) && (characterPos < endPos));
    return returnCount;
};
