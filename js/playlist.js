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
var isOpposite = false;
var glblCurWeatherMetrics;
var glblCurDanceability;
var glblCurHappiness;
var glblCurEnergy;

$("#playlist-type-form").keypress(function(e) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if (keycode == '13') {
		e.preventDefault();
		isReWeather = false;
		makeNewPlaylist(isReWeather);
	}
});

$("#options-form").keypress(function(e) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if (keycode == '13') {
		e.preventDefault();
		isReWeather = true;
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

function getDanceability(temp, isReWeather) {
    var tempToDance;
    var danceability;

	if(isReWeather) {
		console.log($('input[name="danceability"]'));
		danceability = ($('input[name="danceability"]')[0]['valueAsNumber']/10);
		console.log("COOLERRRRRR");
		if (danceability >.8) {
			danceability = .8; //for range .8-1, which is max range
		}
		console.log(danceability);
	}
	else {
		if (temp > 100) {
			tempToDance = 100;
		} else if (temp < 0) {
			tempToDance = 0;
		} else tempToDance = temp;

		danceability = (tempToDance * .6) / 100; // where min danceability is .6, max will be 1
	}
	return danceability;
}

function getHappiness(weatherMetrics, isReWeather) {
	var happiness;
	var maxHappiness;
	if (isReWeather) {
		happiness = ($('input[name="happiness"]')[0]['valueAsNumber']/10);
		if (happiness >.8) {
			happiness = .8; //for range .8-1, which is max range
		}
		if (happiness < 0.6) {
			maxHappiness = happiness + 0.4;
		} else maxHappiness = 1;
	} else {
		happiness = weatherMetrics['min_valence'];
		maxHappiness = weatherMetrics['max_valence'];
	}
	return [happiness, maxHappiness];
}

function getEnergy(weatherMetrics, isReWeather) {
	var energy;
	var maxEnergy;
	if (isReWeather) {
		energy = ($('input[name="energy"]')[0]['valueAsNumber']/10);
		if (energy >.8) {
			energy = .8; //for range .8-1, which is max range
		}
		if (energy < 0.6) {
			maxEnergy = energy + 0.4;
		} else maxEnergy = 1;
	} else {
		energy = weatherMetrics['min_energy'];
		maxEnergy = weatherMetrics['max_energy'];
	}
	return [energy, maxEnergy];
}

/* Get seed song to set up echonest playlist */
function searchSeedSong(weatherMetrics, min_hot, temp, isReWeather) {

	console.log(isReWeather);
	console.log("******************");
	console.log(weatherMetrics);
	
	var songSearchURL = 'http://developer.echonest.com/api/v4/song/search?song_type='
	var genreSelected = ($('input[name="genre"]:checked').val());
	var endYear = $("#decade :selected").val();

	// Is christmas
	var christmasPlaylist = $('input[name="christmasify"]:checked').val();
	if (!christmasPlaylist) {
		songSearchURL +='christmas:false';
	} else {
		songSearchURL += christmasPlaylist;
	}

	//uses current temp to map to danceability of a song
	var danceability = getDanceability(temp, isReWeather);
	var maxDanceability = 1;
	if (danceability < 0.6) {
		maxDanceability = danceability + 0.4;
	}

	var energyArr = getEnergy(weatherMetrics, isReWeather);
	var happyArr = getHappiness(weatherMetrics, isReWeather);

	var energy = energyArr[0];
	var maxEnergy = energyArr[1];

	var happiness = happyArr[0];
	var maxHappiness = happyArr[1];



	var data = {
			'api_key': ECONEST_API_KEY,
			'format' : 'json',
			'bucket' : 'id:spotify',
			'max_tempo' : weatherMetrics['max_tempo'],
			'min_tempo' : weatherMetrics['min_tempo'],
			'min_energy' : (energy).toString(),
			'max_energy' : (maxEnergy).toString(),
			'min_valence' : (happiness).toString(),
			'min_valence' : (maxHappiness).toString(),
			'song_min_hotttnesss' : min_hot,
			'min_danceability' : (danceability).toString(),
			'max_danceability' : (maxDanceability).toString(),
			'results' : '1',
			//'song_type' : christmasPlaylist,
		}

	if (genreSelected && (genreSelected != 'all')) {
	    data.style = genreSelected;
	}


	if (endYear != 'all') {
		data.artist_end_year_before = endYear;		
	} 
	console.log(data);
	glblCurWeatherMetrics = weatherMetrics;
	glblCurDanceability = danceability;
	glblCurEnergy = energyArr;
	glblCurHappiness = happyArr;

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
function searchPlaylist(seed, min_hot) {
	var weatherMetrics = glblCurWeatherMetrics;
	var danceability = glblCurDanceability;
	var maxDanceability = 1;
	if (danceability < 0.6) {
		maxDanceability = danceability + 0.4;
	}
	var energy = glblCurEnergy[0];
	var maxEnergy = glblCurEnergy[1];
	var happiness = glblCurHappiness[0];
	var maxHappiness = glblCurHappiness[1];

	$.ajax({
		'url': 'http://developer.echonest.com/api/v4/playlist/static?bucket=id:spotify&bucket=tracks',
		'data': {
			'api_key': ECONEST_API_KEY,
			'type': 'song-radio',
			'song_id' : seed,
			'song_min_hotttnesss' : min_hot,
			'max_energy' : (maxEnergy).toString(),
			'min_energy' : (energy).toString(),
			'max_tempo' : weatherMetrics['max_tempo'],
			'min_tempo' : weatherMetrics['min_tempo'],
			'min_valence' : (happiness).toString(),
			'max_valence' : (maxHappiness).toString(),
			'song_min_hotttnesss' : min_hot,
			'min_danceability' : (danceability).toString(),
			'max_danceability' : (maxDanceability).toString(),
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

	