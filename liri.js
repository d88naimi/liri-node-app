// * @param my-tweets
//  * @param spotify-this-song
//  * @param movie-this
//  * @param do-what-it-says

// node start
// allows node library functionality
 var fs = require("fs");
 // request node library
 var request = require("request");
 // twitter library
 // might have to go in a folder ./keys
 var LiriTwitterBOT = require("./key.js");
 var twitter = require("twitter"); 

 var task = process.argv[2]; 
 var inquiry = process.argv.slice(3).join("+")

 // twitter call

 var tweets = new twitter(LiriTwitterBOT.LiriTwitterBOT);
 var tSearch = { 
 	screen_name: "DaveNaimi",
 	count: 20,
 }

 var object = ""; // try to log stuff to log.txt

 function writeLog(textLog) { 
 	fs.appendFile("log.txt", textLog, function(err) {
 		if(err){
 			return console.log(err);
 		};
 		console.log("updated log.txt amigo") // uppdated log.txt
 	});
 }; // close write txt.log


 // switch statement for task

 switch (task) {
 	case "my-tweets":
 	fetchTweets();
 	break;
 	 case 'spotify-this-song':
    spotifySongInfo(inquiry);
    break;
 	case "movie-this":
    fetchMovieInfo(inquiry);
    break;
    case "do-what-it-says":
    randomTASKinquiry(inquiry);
    break;
  default: 
  console.log("Check spelling")
 };

 // twitter function begin
function fetchTweets() { 
tweets.get('statuses/user_timeline', tSearch, function(err, response) {
    if (err) {
      console.log(err);
    };
    console.log("Last tweets" + response.length )
   for ( var i = 0; i < response.length; i++) {
   	console.log(" Tweet# " + (i + 1) + "=" + response[i].text);
   	console.log("Published:" + response[i].created_at) // print publish date
   	logObject += ', ' + '#' + (i + 1) + " = " + response[i].text + response[i].created_at; //concatenation to log.txt
    };
   	logObject = task + "" + logObject + "\n"; // task to beginning
   	writeLog(logObject); // write to log.txt
   }); 
}; // end of fetch tweet

// spotify function
function spotifySongInfo(inquiry) {
	if (!inquiry) {
		inquiry = "black+mambo"; //assigned default in case no inquiry entered after task
  }
  var queryUrl = 'https://api.spotify.com/v1/search?q=' + inquiry + '&limit=5&type=track';	
  request(queryUrl, function(err, response, body) { //SpotifyAPI-call
    if (err) {
      console.log(err);
    }
    body = JSON.parse(body);
    for (var i = 0; i < body.tracks.items.length; i++) {
      console.log('artist(s) = ' + body.tracks.items[i].artists[0].name);
      console.log('song title = ' + body.tracks.items[i].name);
      console.log('preview = ' + body.tracks.items[i].preview_url);
      console.log('album = ' + body.tracks.items[i].album.name);
      
      //inquiry request and response concatenation to log.txt
      logObject = task + ", " + inquiry + ", " + body.tracks.items[i].artists[0].name + ", " + body.tracks.items[i].name + ", " + body.tracks.items[i].preview_url + ", " + body.tracks.items[i].album.name + "\n";
    }; //END-for-loop
    writeLog(logObject); //write to log.txt
  }); 
}


// omdb function
function fetchMovieInfo(inquiry) {
  if (!inquiry) { 
    inquiry = "jumanji"; //default if no inquiry is typed into the request argv
  };
  var queryUrl = 'http://www.omdbapi.com/?t=' + inquiry + '&y=&plot=short&r=json&tomatoes=true';
  request(queryUrl, function(err, response, body) { //OMDB-call
    if (err) {
      console.log(err);
    }
    body = JSON.parse(body);
    
    console.log('title = ' + body.Title);
    console.log('year released = ' + body.Year);
    console.log('actors = ' + body.Actors);
    console.log('plot summary = ' + body.Plot);
    console.log('countries = ' + body.Country);
    console.log('languages = ' + body.Language);
    console.log('IMDB rating = ' + body.imdbRating);
    console.log('Rotten Tomatoes RATING = ' + body.tomatoRating);
    console.log('Rotten Tomatoes URL = ' + body.tomatoURL);
    
    //inquiry request and response concatenation to log.txt
    logObject = task + ", " + inquiry + ", " + body.Title + ", " + body.Year + ", " + body.Actors + ", " + body.Plot + ", " + body.Country + ", " + body.Language + ", " + body.imdbRating + ", " + body.tomatoRating + ", " + body.tomatoURL + "\n";
    writeLog(logObject); //write to log.txt
  }); 
}; 

function randomTASKinquiry(inquiry) {
  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    }
    var output = data.toString().split(','); //splits string from random.txt into an array
    task = output[0]; //set task from random.txt array
    inquiry = output[1]; //set request from random.txt array
    //runs new parameters back through switch case
    switch (task) {
      case 'my-tweets':
        fetchTweets();
        break;
      case 'spotify-this-song':
        spotifySongInfo(inquiry);
        break;
      case 'movie-this':
        fetchMovieInfo(inquiry);
        break;
        
      default:
        console.log("Check Spelling please");
    }; 
  }); 
}; 


// console.log(JSON.stringify(result[0], null, 2));








