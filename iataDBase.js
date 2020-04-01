const _CORS_SERVER = "https://polar-bayou-73801.herokuapp.com/";
// const citiesURL = "https://github.com/SabrinaCat/LiveTravelInfo/blob/master/Assets/cities.json";
const citiesURL = "https://github.com/SabrinaCat/LiveTravelInfo/master/Assets/cities.json";

// var _request = new XMLHttpRequest();
var _citiesDB;


function main() {
    // _request = new XMLHttpRequest();
    // _request.open("GET", _CORS_SERVER + citiesURL);
    // // _request.responseType = "json";
    // _request.send();

    sendAjax_CORS(citiesURL);
};


// _request.onload = function() {
//     _citiesDB = _request.response;
//     console.log(_request);
//     console.log(_citiesDB);
// };

/**
 * Send specified Ajax query
 * @param {*} queryString Full API Call, including http(s)://
 */
function sendAjax_CORS(queryString) {
    queryString = _CORS_SERVER + queryString;

    $.ajax({
        method: "GET",
        url: queryString,
        // headers: {"X-Access-Token": _AIRLINE_TOKEN}
    }).then(function (response) {
        _citiesDB = response;
        console.log(response);
    });
};


main();
