
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

    let sourceCurrency = "USD";
    let destinationCurrency = "";

    let destinationLatitude = finalDestination.coords.lat;
    let destinationLongitude = finalDestination.coords.lon;
    let maximumDistance = 25;

    if (destinationCountry) {
        destinationCurrency = destinationCountry.currency;
        destinationText += ", " + destinationCountry.name;
    }

    console.log(finalDestination);
    $("#city-name").text(destinationText);

    // $("#us-currency").val(1.00);
    // $("#foreign-currency").val();


    runCurrencyExchangeQuery(sourceCurrency, destinationCurrency);


    getNearbyWebcams(destinationLatitude, destinationLongitude, maximumDistance);

	// runTicketQuery("AUS", finalDestination.code);
	
    // runCurrencyExchangeQuery();         //  from exchange.js
}
