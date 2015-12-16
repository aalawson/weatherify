/* 
    Playlist.js
    by Anna Lawson, Anfal Boussayoud, Lauren Tom, Nina Sabado 

    Javascript built to deal with any playlist logic, calling on EchoNest + Spotify APIs
*/
var ECHONEST_API_KEY = 'UOLQFEZCTDHUNBF6K';
var ECONEST_API_KEY = 'LSQTUBGBNKDAXLM9H';

/* VARIABLES DEALING WITH PLAYLIST */
var songIdResults = [];			//array of spotify ids
var numResults = 100;

$("#playlist-type-form").keypress(function(e) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if (keycode == '13') {
		e.preventDefault();
		makeNewPlaylist(isReWeather);
	}
});

$("#options-form").keypress(function(e) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if (keycode == '13') {
		e.preventDefault();
		makeNewPlaylist(isReWeather);
	}
});

function makeOppositeNewPlaylist(isReWeather) {
	isOpposite = true;
	makeNewPlaylist(isReWeather);
}


// Weatherify button calls this -- makes a playlist based on weather
function makeNewPlaylist(isReWeather) {
	console.log(":)");
	console.log("hallooooO" + isReWeather);

	if (currentPlaylist['isSaved']) {
		currentPlaylist['isSaved'] = false;
	}

	document.getElementById('playlist-results').innerHTML = "<p id=\"loading-message\">...Loading...</p>";
	var location = document.getElementById('loc').value;
	if (isFineTuneOpen) {
		toggleFineTune();
	} if (isAddAndRemoveOpen) {
		toggleAddAndRemove();
	}
	getLocation(location, isReWeather);
    return false;
}

/* Get seed song to set up echonest playlist */
function searchSeedSong(weatherMetrics, min_hot, temp, isReWeather) {

	console.log(isReWeather);
	
	var songSearchURL = 'http://developer.echonest.com/api/v4/song/search?song_type='
	var genreSelected = ($('input[name="genre"]:checked').val());
	var endYear = $("#decade :selected").val();

	var christmasPlaylist = $('input[name="christmasify"]:checked').val();

	if (!christmasPlaylist) {
		songSearchURL +='christmas:false';
	} else {
		songSearchURL += christmasPlaylist;
	}

	//uses current temp to map to danceability of a song <<---- this should be used by the home page button
	var tempToDance;
	var danceability;
	
	if(isReWeather) {
		danceability = ($('input[name="danceability"]')[0]['valueAsNumber']/10);
		data.min_energy = ($('input[name="energy"]')[0]['valueAsNumber']/10);
		data.max_energy = (($('input[name="energy"]')[0]['valueAsNumber']+2)/10)''
		data.min_tempo = ($('input[name="energy"]')[0]['valueAsNumber']);
	}
	else {
		if (temp > 100) {
			tempToDance = 100;
		} else if (temp < 0) {
			tempToDance = 0;
		} else tempToDance = temp;

		danceability = tempToDance / 130.0;
	}

	

	var data = {
			'api_key': ECONEST_API_KEY,
			'format' : 'json',
			'bucket' : 'id:spotify',
			'max_energy' : weatherMetrics['max_energy'],
			'min_energy' : weatherMetrics['min_energy'],
			'max_tempo' : weatherMetrics['max_tempo'],
			'min_tempo' : weatherMetrics['min_tempo'],
			'max_acousticness' : weatherMetrics['max_acousticness'],
			'min_acousticness' : weatherMetrics['min_acousticness'],
			'song_min_hotttnesss' : min_hot,
			'min_danceability' : danceability,
			'max_danceability' : danceability + 0.2,
			'results' : 1,
			//'song_type' : christmasPlaylist,
		}

	if (genreSelected && (genreSelected != 'all')) {
	    data.style = genreSelected;
	}

	if (endYear != 'all') {
		data.artist_end_year_before = endYear;		
	} 

	$.ajax({
		'url': songSearchURL,
		'data': data,
		//callback function needs to be added here 
		'success': function(results) {
			// No result for seed song
			if (results['response']['songs'].length == 0) {
				// Decrement min hot if possible
				if (min_hot != '0') {
					searchSeedSong(weatherMetrics, '0', temp, isReWeather); // lower min popularity if need be
				} else {
					displayNoPlaylistResultsError();
				}
			} // Seed song found 
			else {
				searchPlaylist(results['response']['songs'][0]['id'], min_hot, danceability, weatherMetrics);
			}
		}
	});
	return false;
}

//must error check genre up to 5
// Get Echonest playlist using seed song
function searchPlaylist(seed, min_hot, danceability, weatherMetrics) {
	
	$.ajax({
		'url': 'http://developer.echonest.com/api/v4/playlist/static?bucket=id:spotify&bucket=tracks',
		'data': {
			'api_key': ECONEST_API_KEY,
			'type': 'song-radio',
			'song_id' : seed,
			'song_min_hotttnesss' : min_hot,
			'results' : numResults,
		},
		//callback function needs to be added here 
		'success': function(results) {
			console.log(results);
			// Try to get at least 15 results
			if (results['response']['songs'].length < 15 && Number(min_hot) >= 0.2) {
				searchPlaylist(seed, (Number(min_hot) - .2 ).toString())
			} // If  any results were found, display them
			else if (results['response']['songs'].length > 0) {
				createPlaylist(results);
			} else {
				displayNoPlaylistResultsError();
			}
		}
	});
	return false;

}

function getPlayerString(songs) {
	var playerString = '';
	for (var i = 0; i < songs.length; i++) {
        playerString += songs[i]['songId'] + ',';
	}
    return playerString;
}

function getPlaylistName() {
	console.log(nameTemp);
	var name = '';
	if (nameTemp.length > 0 || nameWeather.length > 0 || curLocation.length > 0) {
		if (nameTemp.length > 0) {
            name += nameTemp + "° and ";
		} if (nameWeather.length > 0) {
			name += titlecase(nameWeather) + ' in ';
		} if (curLocation.length > 0) {
			name += curLocation;
		}
       return name;	
	}
	return '';
}

function createPlaylist(results) {
	currentPlaylistName = getPlaylistName();
    
    currentPlaylist = {
        'name' 		: currentPlaylistName,
        'temp' 		: nameTemp,
        'weather'	: nameWeather,
        'songs' 	: [],
        'playerString' : '',
        'isSaved' : false
    }

    for (var i = 0; i < results['response']['songs'].length; i++) {
        if (results['response']['songs'][i]['tracks'] && results['response']['songs'][i]['tracks'][0]) {

        	// See if there was an artist id
		    var artistId = '';
		    console.log()
		    if (results['response']['songs'][i]['artist_foreign_ids']
		    	&& results['response']['songs'][i]['artist_foreign_ids'][0]
		    	&& results['response']['songs'][i]['artist_foreign_ids'][0]['foreign_id']) {
		    	artistId = results['response']['songs'][i]['artist_foreign_ids'][0]['foreign_id'];
		    }
		    // See if there was a song Id
		    var songId = '';
		    if (results['response']['songs'][i]['tracks'][0]['foreign_id']) {
		    	songId = results['response']['songs'][i]['tracks'][0]['foreign_id'].replace('spotify:track:', '');
		    }

		    if (songId.length > 0) {
		        currentPlaylist['songs'].push( {
	            'songName' : results['response']['songs'][i]['title'],
	            'artist' : results['response']['songs'][i]['artist_name'],
	            'artistId' : artistId,
	            'songId' : songId,
	         });   	
		    } else {
		    	displayNoPlaylistResultsError();
		    }
 
        } else {
        	displayNoPlaylistResultsError();
        }
    }
    currentPlaylist['playerString'] = getPlayerString(currentPlaylist['songs']);
    updatePlaylistTopBar();
    displayPlaylist();

}

function removeSong(id) {
	id = id.replace('delete-', '');
	for (var i = 0; i < currentPlaylist['songs'].length; i++) {
		if (currentPlaylist['songs'][i]['songName'] == id) {
			currentPlaylist['songs'].splice(i, 1);
		}
	}
	refreshAddRemoveTable();
	savePlaylist();
}

function addSong(index) {
	index = index.replace('add-', '');
	var song = mostRecentSearchResults['tracks']['items'][index];
	console.log(song);
	var name = song.name; 
	var id = song.id;
    var artist = song['artists'][0].name;
    var artistId = song['artists'][0].id;

    if (currentPlaylist['songs']) {
    	currentPlaylist['songs'].push( {
            'songName' : name,
            'artist' : artist,
            'artistId' : artistId,
            'songId' : id,
         }); 
    	savePlaylist();
    }
    console.log(currentPlaylist['songs'].length);
    console.log(currentPlaylist['songs']);

}

function refreshPlaylist() {
	console.log("refreshing");
	refreshAddRemoveTable();
	currentPlaylist['playerString'] = getPlayerString(currentPlaylist['songs']);
	updatePlaylistTopBar();
	displayPlaylist();
}

	