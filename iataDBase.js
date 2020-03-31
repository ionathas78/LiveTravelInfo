const _citiesURL = "./Assets/cities.json";
var _request = new XMLHttpRequest;
var _citiesDB;

function main() {
    _request = new XMLHttpRequest();
    _request.open("GET", _citiesURL);
    _request.responseType = "json";
    _request.send();
}

_request.onload = function () {
    _citiesDB = _request.response;
    console.log(_citiesDB_);
}

main();