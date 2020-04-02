//my current working api key, someone told me api keys were specific to a device but I don't think thats true
var myKey = "FfGQyFVlBphWzW7wWdUNrZ5pxRZ46Y6d";

//this call pulls the full list of countries that have available webcams. The format however is
//alpha 2 letter codes for each country
//URL format is " https://api.windy.com/api/webcams/v2" + "/list?show=countries" ex: a specific country
//would be "https://api.windy.com/api/webcams/v2/list/country=DE" DE being the alpha 2 code for Germany
$.ajax({
    url: "https://api.windy.com/api/webcams/v2/list?show=countries" + `&key=${myKey}`,
    method: 'GET'
}
).then(function(data){
    console.log(data);
});

//I have a variable for user input that I would like to sync to my selector menu in the html
//My thoughts were to use a code that makes the alpha 2 lettering = to its alpha 3 counterpart for each
//country.
var userInput= 

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

$.ajax({
    url: "https://api.windy.com/api/webcams/v2/list?show=webcams:image,location;categories" + `&key=${myKey}`,
    method: 'GET',
}
).then(function(data){
    console.log(data)
});

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