/* 
    Playlist.js
    by Anna Lawson, Anfal Boussayoud, Lauren Tom, Nina Sabado 

    Javascript built to deal with any playlist logic, calling on EchoNest + Spotify APIs
*/
var ECHONEST_API_KEY = 'UOLQFEZCTDHUNBF6K';
var ECONEST_API_KEY = 'LSQTUBGBNKDAXLM9H';

/* VARIABLES DEALING WITH PLAYLIST */
var songIdResults = [];			//array of spotify ids
var currentPlaylist = '';		//keeps in memory current playlist
var numResults = 40; 			//number of echonest results

// Weatherify button calls this -- makes a playlist based on weather
function makeNewPlaylist() {
	var location = document.getElementById('loc').value;
	if (isDrawerOpen) {
		toggleDrawer();
	}
	getLocation(location);
    return false;
}
// Takes weather results and converts to a rating for getting music
function processWeatherData(weatherResults) {
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
/*
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
} */

/* Get seed song to set up echonest playlist */
function searchSeedSong(weatherMetrics) {
	var genreSelected;

	genreSelected = ($('input[name="genre"]:checked').val());
	
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
			'results' : '1',
			'style' : genreSelected,
			'artist_end_year_before' : endYear,

		},
		//callback function needs to be added here 
		'success': function(results) {
			// getSongIds(results);
			searchPlaylist(results['response']['songs'][0]['id']);
		}
	});
	return false;
}

//must error check genre up to 5
// Get Echonest playlist using seed song
function searchPlaylist(seed) {
	
	$.ajax({
		'url': 'http://developer.echonest.com/api/v4/playlist/static',
		'data': {
			'api_key': ECONEST_API_KEY,
			'format' : 'json',
			'type': 'song-radio',
			'bucket' : 'id:spotify',
			'song_id' : seed,
			'results' : numResults,
		},
		//callback function needs to be added here 
		'success': function(results) {
			// getSongIds(results);
			getAllSongIds(results);
		}
	});
	return false;

}

// Take echonest playlist and convert to spotify song ids
function getAllSongIds(results) {
	playlistIds = [];
	var songIdRequests = [];	//reset requests array
	songIdResults = [];		//reset results array
	var artist;
	var name;
	if (results['response'] && results['response']['songs']) {
		numResults = results['response']['songs'].length;	

		for (var i = 0; i < results['response']['songs'].length; i++) {
			artist = results['response']['songs'][i]['artist_name'];
			name = results['response']['songs'][i]['title'];
			songIdRequests.push(getSongId(artist, name));
		}

		$.when($, songIdRequests).done(function() {
	    });		
    } else {
    	console.log("error message"); //ERROR MESSAGE HERE
    }

}

// Search spotify to get song id
function getSongId(artist, name) {
	artist = artist.replace(/[^a-zA-Z0-9\s\:]/g, ' ');
	name = name.replace(/[^a-zA-Z0-9\s\:]/g, ' ');
	currentPlaylist = '';

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
	        var isValid = data['tracks'] && data['tracks']['items'] && (
	        	data['tracks']['items'].length > 0);
	        if (!isValid) {
	        	numResults--;
	         //console.log(numResults + " not valid");// displayBadParamsError(); // let user know that no results were found
	        } //Valid! push to songIdResults
	        else {
	        	songIdResults.push(data['tracks']['items'][0]);
	        	currentPlaylist += data['tracks']['items'][0].id;
	        	currentPlaylist += ',';
	        }

	        // If this is the last callback, display results
	    	if (numResults == songIdResults.length) {
				displayPlaylist(songIdResults);
        	}

	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        //displayBadParamsError();
	        console.log("NEED ERROR MESSAGE HERE");

	    }
	});
}

// Make playbutton with all songs in playlist
function displayPlaylist(results) {
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

function showPlaylist() {
	//for saved playlists, location and/or weather and playlist should be saved
}

	