/* 
    Playlist.js
    by Anna Lawson, Anfal Boussayoud, Lauren Tom, Nina Sabado 

    Javascript built to deal with any playlist logic, calling on EchoNest + Spotify APIs
*/
var ECHONEST_API_KEY = 'UOLQFEZCTDHUNBF6K';
var ECONEST_API_KEY = 'LSQTUBGBNKDAXLM9H';

/* VARIABLES DEALING WITH PLAYLIST */
var songIdResults = [];			//array of spotify ids
var currentPlaylist ='';	//keeps in memory current playlist
var numResults = 15; //number of echonest results

// Weatherify button calls this
function makeNewPlaylist() {
	var location = document.getElementById('loc').value;
	if (isDrawerOpen) {
		toggleDrawer();
	}
	getLocation(location);
	console.log("making new playlist");
    return false;
}
// Takes weather results and converts to a rating for getting music
function processWeatherData(weatherResults) {
	console.log(weatherResults);
	var temp = weatherResults['main']['temp'];
	var tempString = temp.toString();
	document.getElementById('weather-report').innerHTML =
		"Today in " + weatherResults['name'] + " it\'s " + tempString.substring(0, tempString.indexOf('.')) + "&#176F";
	var id = "0";
	if (weatherResults['weather'] && weatherResults['weather'][0]['id']) {
		id = weatherResults['weather'][0]['id'].toString();
	}
	getWeatherRating(id);
}

function searchMusic(weatherMetrics) {
	
	var genreCheckboxes = document.getElementsByName('genre');
	var genreSelected = '';
	for(var i = 0; i < genreCheckboxes.length; i++) {
		if(genreCheckboxes[i].checked) {
			genreSelected += genreCheckboxes[i].defaultValue;
			if (i>0 && i<genreCheckboxes.length) {
				genreSelected += ',';
			}
		}
	}
	if (!genreSelected) {
		genreSelected = 'all';
	}

	var endYear = $("decade :selected").val();
	
	$.ajax({
		'url': 'http://developer.echonest.com/api/v4/song/search',
		'data': {
			'api_key': ECONEST_API_KEY,
			'format' : 'json',
			'bucket' : 'id:spotify',
			'max_energy' : weatherMetrics['max_energy'],
			'min_energy' : weatherMetrics['min_energy'],
			'max_tempo' : weatherMetrics['max_tempo'],
			'min_tempo' : weatherMetrics['min_tempo'],
			'max_acousticness' : weatherMetrics['max_acousticness'],
			'min_acousticness' : weatherMetrics['min_acousticness'],
			'artist_min_hotttnesss' : '.8',	
			'results' : numResults,
			'style' : genreSelected,
			'artist_end_year_before' : endYear,
		},
		//callback function needs to be added here 
		'success': function(results) {
			console.log(results);
			getAllSongIds(results);
		}
	});
	return false;
}

function getAllSongIds(results) {
	playlistIds = [];
	var songIdRequests = [];	//reset requests array
	songIdResults = [];		//reset results array
	var artist;
	var name;
	console.log(results['response']['songs']);
	if (results['response'] && results['response']['songs']) {
		numResults = results['response']['songs'].length;	
		console.log(numResults);

		for (var i = 0; i < results['response']['songs'].length; i++) {
			artist = results['response']['songs'][i]['artist_name'];
			name = results['response']['songs'][i]['title'];
			songIdRequests.push(getSongId(artist, name));
		}
		console.log(songIdRequests.length);

		$.when($, songIdRequests).done(function() {
           console.log("done");
	    });		
    } else {
    	console.log("error message"); //ERROR MESSAGE HERE
    }

}

function getSongId(artist, name) {
	console.log("in getSongId");
	artist = artist.replace(/[^a-zA-Z0-9\s\:]/g, ' ');
	name = name.replace(/[^a-zA-Z0-9\s\:]/g, ' ');

	var params = {
		'artist': artist,
		'track': name
	}

    //Create query string using filters
    var query = "";
    for (var key in params) {
    	if (params[key].length > 0) {
    		if (params[key].includes(' ')){
				  params[key] = "\"" + params[key] + "\""; //if multiple words, put in quotes
			}
			query += key + ":" + params[key] + " ";
		}
	}
	query = query.substring(0, query.length-1); //strip off last " "


  	// artist = artist.replace(/\s/g, '+');
  	// var query = name + "+artist:" + artist;
  	return $.ajax ({
  		'url': 'http://api.spotify.com/v1/search',
  		'data': {'q':query, 'type': 'track', 'limit' : '1', 'market':'US'},
  		'cache': true,
  		success : function(data, textStats, XMLHttpRequest) {
	        // Check to make sure at least one song was returned
	        console.log("in success");
	        console.log(data['tracks']);
	        var isValid = data['tracks'] && data['tracks']['items'] && (
	        	data['tracks']['items'].length > 0);
	        console.log(isValid);
	        if (!isValid) {
	        	numResults--;
	         //console.log(numResults + " not valid");// displayBadParamsError(); // let user know that no results were found
	        } //Valid! push to songIdResults
	        else {
	        	console.log("in else");
	        	songIdResults.push(data['tracks']['items'][0]);
	        	currentPlaylist += data['tracks']['items'][0].id;
	        	currentPlaylist += ',';
	        	console.log(numResults);
	        }
	    	if (numResults == songIdResults.length) {
				displayPlaylist(songIdResults);
        	}
	        console.log(numResults);

	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        //displayBadParamsError();

	    }
	});
}

function displayPlaylist(results) {
	console.log("in displayPlaylist");
 	$('#playlist-results').empty();
	var playerHtml = '<br><br><iframe src="https://embed.spotify.com/?uri=spotify:trackset:';

    // if you want:
    //playerHtml += PLAYLIST NAME

    //adds 20 songs to the playlist 
    //need function that generates playlist based on weather 
    playerHtml += currentPlaylist;
    playerHtml += '" frameborder="0" width="640px" height="700" align="center" allowtransparency="true"></iframe>';

    $('#playlist-results').append(playerHtml);
}

function saveCurrentPlaylist() {
	//this function will add the current playlist to the database
}

function showPlaylist() {
	//for saved playlists, location and/or weather and playlist should be saved
}

	