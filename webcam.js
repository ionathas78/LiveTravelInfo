//my current working api key, someone told me api keys were specific to a device but I don't think thats true
var myKey = "FfGQyFVlBphWzW7wWdUNrZ5pxRZ46Y6d";

const _WINDY_BASE = "https://api.windy.com/api/webcams/v2";
const _WINDY_NEARBY_ENDPOINT = "list/nearby=%LAT%,%LON%,%DISTANCE%";
const _WINDY_WEBCAMS = "show=webcams:location,image,player";
const _WINDY_SORTBY = "orderby=%SORT%";
const _WINDY_APIKEY = "key=FfGQyFVlBphWzW7wWdUNrZ5pxRZ46Y6d";

var _camList = [];

//this call pulls the full list of countries that have available webcams. The format however is
//alpha 2 letter codes for each country
//URL format is " https://api.windy.com/api/webcams/v2" + "/list?show=countries" ex: a specific country
//would be "https://api.windy.com/api/webcams/v2/list/country=DE" DE being the alpha 2 code for Germany

// getNearbyWebcams(30.267, -97.733, 10);

function getCountryList() {
    $.ajax({
        url: "https://api.windy.com/api/webcams/v2/list?show=countries" + `&key=${myKey}`,
        method: 'GET'
    }
    ).then(function(data){
        console.log(data);
    });
};


function getNearbyWebcams (latitudeValue, longitudeValue, maxDistance) {
    let apiBase = _WINDY_BASE;
    let nearbyEndpoint = _WINDY_NEARBY_ENDPOINT.replace("%LAT%", latitudeValue);
    nearbyEndpoint = nearbyEndpoint.replace("%LON%", longitudeValue);
    nearbyEndpoint = nearbyEndpoint.replace("%DISTANCE%", maxDistance);
    let webcamsQuery = _WINDY_WEBCAMS;
    let sortByPopularity = _WINDY_SORTBY.replace("%SORT%", "popularity");
    let queryString = apiBase + "/" + nearbyEndpoint + "?" + webcamsQuery + "&" + sortByPopularity + `&key=${myKey}`;
    console.log(queryString);

    $.ajax({
        url: queryString,
        method: "GET"
    }).then (function (response) {
        console.log(response);
        populateWebcamList(response);
    })
}


function populateWebcamList (response) {
    let camSelect = $("#select-cam");
    camSelect.empty();
    _camList = [];

    for (var i = 0; i < response.result.webcams.length; i++) {
        let camId = response.result.webcams[i].id;
        let camTitle = response.result.webcams[i].title + "-" + i;
        let camEmbedLink = availablePlayerLink(response.result.webcams[i].player);

        if (camEmbedLink != "") {
            let camOption = $('<option value="' + camId + '">' + camTitle + '</option>');
            _camList.push({id: camId, url: camEmbedLink});
            camSelect.append(camOption);
        };
    };
};

function availablePlayerLink(playerObject) {
    let returnString = "";
    if (playerObject.live.available) {
        returnString = playerObject.live.embed;
    } else if (playerObject.day.available) {
        returnString = playerObject.day.embed;
    } else if (playerObject.month.available) {
        returnString = playerObject.month.embed;
    } else if (playerObject.year.available) {
        returnString = playerObject.year.embed;
    } else if (playerObject.lifetime.available) {
        returnString = playerObject.lifetime.embed;
    };
    return returnString;
};

function showCam () {
    let camId = $("#select-cam").val();
    if (!camId) {
        return;
    };

    let urlString = "";
    for (var obj of _camList) {
        if (obj.id == camId) {
            urlString = obj.url;
            break;
        };
    };

    $("iframe").attr("src", urlString);
};

//I have a variable for user input that I would like to sync to my selector menu in the html
//My thoughts were to use a code that makes the alpha 2 lettering = to its alpha 3 counterpart for each
//country.
//var userInput= { 

// var select= {
// AF: "Afghanistan",
// AX: "Åland Islands",
// AL: "Albania",
// DZ: "Algeria",
// AD: "Andorra",
// AO: "Angola",
// AI: "Anguilla",
// AQ: "Antarctica",
// AG: "Antigua and Barbuda",
// AR: "Argentina",
// AM: "Armenia",
// AW: "Aruba",
// AS: "American Samoa",
// AU: "Australia",
// AT: "Austria",
// AZ: "Azerbaijan",
// BS: "Bahamas",
// BH: "Bahrain",
// BD: "Bangladesh",
// BB: "Barbados",
// BY: "Belarus",
// BE: "Belgium",
// BZ: "Belize",
// BJ: "Benin",
// BM: "Bermuda",
// BT: "Bhutan",
// BO: "Bolivia",
// BQ: "Bonaire, Sint Eustatius and Saba",
// BA: "Bosnia and Herzegovina",
// BW: "Botswana",
// BV: "Bouvet Island",
// BR: "Brazil",
// IO: "British Indian Ocean Territory",
// BN: "Brunei",
// BG: "Bulgaria",
// BF: "Burkina Faso",
// BI: "Burundi",
// KH: "Cambodia",
// CM: "Cameroon",
// CA: "Canada",
// CV: "Cape Verde",
// KY: "Cayman Islands",
// CF: "Central African Republic",
// TD: "Chad",
// CL: "Chile",
// CN: "China",
// CX: "Christmas Island",
// CC: "Cocos (Keeling) Islands",
// CO: "Colombia",
// KM: "Comoros",
// CD: "DR Congo",
// CG: "Congo",
// CK: "Cook Islands",
// CI: "Côte d'Ivoire",
// CR: "Costa Rica",
// HR: "Croatia",
// CU: "Cuba",
// CW: "Curaçao",
// CY: "Cyprus",
// CZ: "Czech Republic",
// DK: "Denmark",
// DJ: "Djibouti",
// DM: "Dominica",
// DO: "Dominican Republic",
// EC: "Ecuador",
// EG: "Egypt",
// SV: "El Salvador",
// GQ: "Equitorial Guinea",
// ER: "Eritrea",
// EE: "Estonia",
// SZ: "Eswatini",
// ET: "Ethiopia",
// FK: "Falkland Islands",
// FO: "Faroe Islands",
// FJ: "Fiji",
// FI: "Finland",
// FR: "France",
// GF: "French Guiana",
// PF: "French Polynesia",
// TF: "French Southern Territories",
// GA: "Gabon",
// GM: "Gambia",
// GE: "Georgia",
// DE: "Germany",
// GH: "Ghana",
// GI: "Gibraltar",
// GR: "Greece",
// GL: "Greenland",
// GD: "Grenada",
// GP: "Guadeloupe",
// GU: "Guam",
// GT: "Guatemala",
// GG: "Guernsey", 
// GN: "Guinea",
// GW: "Guinea-Bissau",
// GY: "Guyana",
// HT: "Haiti",
// HM: "Heard Islands",
// VA: "Holy See",
// HN: "Honduras",
// HK: "Hong Kong",
// HU: "Hungary",
// IS: "Iceland",
// ID: "India",
// IN: "Indonesia",
// IR: "Iran",
// IQ: "Iraq",
// IE: "Ireland",
// IM: "Isle of Man",
// IL: "Israel",
// IT: "Italy",
// JM: "Jamaica",
// JP: "Japan",
// JE: "Jersey",
// JO: "Jordan",
// KZ: "Kazakhstan",
// KE: "Kenya",
// KI: "Kiribati",
// KP: "North Korea",
// KR: "South Korea",
// KW: "Kuwait",
// KG: "Kyrgyzstan",
// LA: "Laos",
// LV: "Latvia",
// LB: "Lebanon",
// LS: "Lesotho",
// LR: "Liberia",
// LY: "Libya",
// LI: "Liechtenstein",
// LT: "Lithuania",
// LU: "Luxembourg",
// MO: "Macao",
// MG: "Madagascar",
// MW: "Malawi",
// MY: "Malaysia",
// MV: "Maldives",
// ML: "Mali",
// MT: "Malta",
// MH: "Marshall Islands",
// MQ: "Martinique",
// MR: "Mauritania",
// MU: "Mauritius",
// YT: "Mayotte",
// MX: "Mexico",
// FM: "Micronesia",
// MD: "Moldova",
// MC: "Monaco",
// MN: "Mongolia",
// ME: "Montenegro",
// MS: "Montserrat",
// MA: "Morocco",
// MZ: "Mozambique",
// MM: "Myanmar",
// NA: "Namibia",
// NR: "Nauru",
// NP: "Nepal",
// NL: "Netherlands",
// NC: "New Caledonia",
// NZ: "New Zealand",
// NI: "Nicaragua",
// NE: "Niger",
// NG: "Nigeria",
// NU: "Niue",
// NF: "Norfolk Island",
// MP: "Northern Mariana Islands",
// NO: "Norway",
// OM: "Oman",
// PK: "Pakistan",
// PW: "Palau",
// PS: "Palestine",
// PA: "Panama",
// PG: "Papua New Guinea",
// PY: "Paraguay",
// PE: "Peru",
// PH: "Philippines",
// PN: "Pitcairn",
// PL: "Poland",
// PT: "Portugal",
// PR: "Puerto Rico",
// QA: "Qatar",
// MK: "Republic of Northern Macedonia",
// RO: "Romania",
// RU: "Russia",
// RW: "Rwanda",
// RE: "Réunion",
// BL: "Saint Barthélemy",
// SH: "Saint Helena, Ascension and Tristan da Cunha",
// KN: "Saint Kitts and Nevis",
// LC: "Saint Lucia",
// MF: "Saint Martin",
// PM: "Saint Pierre and Miquelon",
// VC: "Saint Vincent and the Grenadines",
// WS: "Samoa",
// SM: "San Marino",
// ST: "Sao Tome and Principe",
// SA: "Saudi Arabia",
// SN: "Senegal",
// RS: "Serbia",
// SC: "Seychelles",
// SL: "Sierra Leone",
// SG: "Singapore",
// SX: "Sint Maarten",
// SK: "Slovakia",
// SI: "Slovenia",
// SB: "Solomon Islands",
// SO: "Somalia",
// ZA: "South Africa",
// GS: "South Georgia and the South Sandwich Islands",
// SS: "South Sudan",
// ES: "Spain",
// LK: "Sri Lanka", 
// SD: "Sudan",
// SR: "Suriname",
// SJ: "Svalbard and Jan Mayen",
// SE: "Sweden",
// CH: "Switzerland",
// SY: "Syria",
// TW: "Taiwan",
// TJ: "Tajikistan",
// TZ: "Tanzania",
// TH: "Thailand",
// TL: "Timor-Leste",
// TG: "Togo",
// TK: "Tokelau",
// TO: "Tonga",
// TT: "Trinidad and Tobago",
// TN: "Tunisia",
// TR: "Turkey",
// TM: "Turkmenistan",
// TC: "Turks and Caicos Islands",
// TV: "Tuvalu",
// UG: "Uganda",
// UE: "Ukraine",
// AE: "United Arab Emirates",
// GB: "United Kingdom of Great Britain and Northern Ireland",
// UM: "United States Minor Outlying Islands",
// US: "United States",
// UY: "Uruguay",
// UZ: "Uzbekistan",
// VU: "Vanuatu",
// VE: "Venezuela",
// VN: "Vietnam",
// VG: "Virgin Islands (British)",
// VI:"Virgin Islands (US)",
// WF: "Wallis and Futuna",
// EH: "Western Sahara",
// YE: "Yemen",
// ZM: "Zambia",
// ZW: "Zimbabwe"
// };



//var countrySelect = getElementById("container");
//fillSelector();

//console.log($("select"));


//this pulls all the webcams available for the site currently the limit is set to to 10 which can be changed by
// URL format " https://api.windy.com/api/webcams/v2" + "/list/limit=20,60" or limit=5,10 if we want to 
//the first number is how many cam feeds we want to return and the second number after the comma is our offset which
//means that we will start at the 60th (actually 59th because array starts at zero)camera and show 20 feeds from that starting point. Or the other example
//start at the 10th camera (actually the 9th) and get 5 feeds from that 10th starting point, ugh so confusing!
//keep in mind the limit is 50 at a time which is why this would be time consuming!
//so logging all the available webcams isn't feasible for the current 31,084 (last I checked) cam feeds.

// So you have a list of webcams (a smaller number like 6) but probably want the more popular ones on the site
//you can use "/api/webcams/v2/list/orderby=popularity,desc" and this will sort the most popular feeds in descending order.
// how to take that and apply it directly to a specific country's webcam set is not yet understood by me

function getCategoriesList() {
    $.ajax({
        url: "https://api.windy.com/api/webcams/v2/list?show=webcams:image,location;categories" + `&key=${myKey}`,
        method: 'GET',
    }
    ).then(function(data){
        console.log(data)
    });
};


//So what I was currently working through was how to call a specific country, then get the list of webcam IDs
//from that country (currently I receive a count of how many cam feeds but not the specific id for each cam)
//When you call for webcams like in the way that I did above you will receive this info for each webcam id

//0:
//id: "1000550952"
//status: "active"
//title: "Beinwil am See: Hallwilersee Nord"
//image:
//current: {icon: "https://images-webcams.windy.com/52/1000550952/current/icon/1000550952.jpg", thumbnail: "https://images-webcams.windy.com/52/1000550952/current/thumbnail/1000550952.jpg", preview: "https://images-webcams.windy.com/52/1000550952/current/preview/1000550952.jpg", toenail: "https://images-webcams.windy.com/52/1000550952/current/thumbnail/1000550952.jpg"}
//sizes: {icon: {…}, thumbnail: {…}, preview: {…}, toenail: {…}}
//daylight: {icon: "https://images-webcams.windy.com/52/1000550952/daylight/icon/1000550952.jpg", thumbnail: "https://images-webcams.windy.com/52/1000550952/daylight/thumbnail/1000550952.jpg", preview: "https://images-webcams.windy.com/52/1000550952/daylight/preview/1000550952.jpg", toenail: "https://images-webcams.windy.com/52/1000550952/daylight/thumbnail/1000550952.jpg"}
//update: 1585763174
//__proto__: Object
//location: {city: "Beinwil am See", region: "Canton of Aargau", region_code: "CH.AG", country: "Switzerland", country_code: "CH", …}


// I found this most useful because it has all the variables we need in one place! The thumbnails for our cam feeds,
//the country the feed is from, and also the region and city!

//so what I've found so far is a way to call a specfic region within a country "/api/webcams/v2/list/region=CH.ZH"
//I have not seen what this returns yet so its worth a look ( hopefully it gives webcam ids that we can sort by popularity)
// side note we can call a specific  webcam ID using "/api/webcams/v2/list/webcam=1361879037,1171032474"
//just make sure to seperate each id with a comma. 

//Hope this helps, after reading the documentation I feel like I took on more than I bargained for!