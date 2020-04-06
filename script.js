//  **  Functions

/**
 * Runs when the user clicks the Search button on the Index page
 */
function runCitySearch() {
    let cityInput = $("#city-input").val();
    let countryInput = $("#country-select").val();

	searchCityAndCountry(cityInput, countryInput);		//	from iataDBase.js
};

/**
 * Runs when the user clicks the Get Current Weather Button
 */
function runCurrentWeather() {
    let userDestination = JSON.parse(localStorage.getItem("travelDestination"));
    let finalDestination = userDestination[userDestination.length - 1];
    
    let destinationLatitude = finalDestination.coords.lat;
    let destinationLongitude = finalDestination.coords.lon;

    currentWeatherByLatLon(destinationLatitude, destinationLongitude);
};

/**
 * Runs when the user clicks the Get Weather Forecast Button
 */
function runWeatherForecast() {
    let userDestination = JSON.parse(localStorage.getItem("travelDestination"));
    let finalDestination = userDestination[userDestination.length - 1];
    
    let destinationLatitude = finalDestination.coords.lat;
    let destinationLongitude = finalDestination.coords.lon;

    weatherForecastByLatLon(destinationLatitude, destinationLongitude);
};

/**
 * Runs when the user clicks the Get UV Index button
 */
function runUVIndex() {
    let userDestination = JSON.parse(localStorage.getItem("travelDestination"));
    let finalDestination = userDestination[userDestination.length - 1];
    
    let destinationLatitude = finalDestination.coords.lat;
    let destinationLongitude = finalDestination.coords.lon;

    uvIndexByLatLon(destinationLatitude, destinationLongitude);
};

/**
 * Runs when the CitySearch page loads
 */
function populateCitySearchPage() {
    let userDestination = JSON.parse(localStorage.getItem("travelDestination"));
    
    let finalDestination = userDestination[userDestination.length - 1];
    let destinationCountry = returnCountryInfo(finalDestination.country);
    
    let destinationText = finalDestination.name;
    let maximumCountryLength = 12;

    let sourceCurrency = "USD";
    let sourceCurrencyName = "Dollar"
    let destinationCurrency = "";
    let destinationCurrencyName = "";

    let destinationLatitude = finalDestination.coords.lat;
    let destinationLongitude = finalDestination.coords.lon;
    let maximumDistance = 25;

    if (destinationCountry) {
        destinationCurrency = destinationCountry.currencyCode;
        destinationCurrencyName = destinationCountry.currencyName;
        if (destinationCountry.name.length <= maximumCountryLength) {
            destinationText += ", " + destinationCountry.name;
        } else {
            destinationText += ", " + destinationCountry.code;
        };
    };

    console.log(finalDestination);
    $("#city-name").text(destinationText);
    $("#from-currency").val(sourceCurrencyName);
    $("#to-currency").val(destinationCurrencyName);

    runCurrencyExchangeQuery(sourceCurrency, destinationCurrency);

    getNearbyWebcams(destinationLatitude, destinationLongitude, maximumDistance);
};

/**
 * Runs when the Flights page loads
 */
function populateFlightsPage () {
    runWhereAmI();

    let userDestination = JSON.parse(localStorage.getItem("travelDestination"));
    
    let finalDestination = userDestination[userDestination.length - 1];
    let inputDestination = $("#destination-city");
    inputDestination.val(finalDestination.code);
};

function runTicketQuery () {
    let sourceCity = $("#source-city").val();
    let destinationCity = $("#destination-city").val();

    ticketQueryByOriginAndDestination(sourceCity, destinationCity);
};