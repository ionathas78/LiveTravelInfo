
var myKey = "FfGQyFVlBphWzW7wWdUNrZ5pxRZ46Y6d";
$.ajax({
    url: "https://api.windy.com/api/webcams/v2/list?show=countries" + `&key=${myKey}`,
    method: 'GET'
}
).then(function(data){
    console.log(data);
});





var userInput= 
$.ajax({
    url: "https://api.windy.com/api/webcams/v2/list?show=webcams:image,location;categories" + `&key=${myKey}`,
    method: 'GET',
}
).then(function(data){
    console.log(data)
});
