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
var glblIsReWeather = false;
var glblCurWeatherMetrics;
var glblCurDanceability;
var glblCurMaxDanceability;
var glblCurHappiness;
var glblCurEnergy;
var glblCurTempo;
var isMood;
var moodId = '';
var moodTemp = '';

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

function makeMoodPlaylist() {
	var mood = $("#mood option:selected").val();
	isMood = true;

	// hardcoded values for mood
	switch(mood){
		case 'angry':
			moodId += 212;
			moodTemp += 30;
			break;
		case 'happy':
			moodId += 800;
			moodTemp += 82;
			break;
		case 'sad':
			moodId += 521;
			moodTemp += 44;
			break;
		case 'calm':
			moodId += 952;
			moodTemp += 68;
			break;
		default:
			moodId += 500;
			moodTemp += 50;
			break;
	}

	nameTemp = moodTemp;
	nameWeather = mood;

	getWeatherRating(moodId, moodTemp);
	switchToCurrentPlaylist();
}

function makeNewPlaylistWrapper(isReWeather) {
	isOpposite = false;
	if(document.getElementById('loc-rad').checked) {
		isMood = false;
	} else {
		isMood = true;
	}
	if(isMood){
		getWeatherRating(moodId, moodTemp, false);
	} else{
		makeNewPlaylist(isReWeather);
	}
	
}

// Weatherify button calls this -- makes a playlist based on weather
function makeNewPlaylist(isReWeather) {
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
		danceability = ($('input[name="danceability"]')[0]['valueAsNumber']/10);
		if (danceability >= .6) {
			danceability = .5; //for range .8-1, which is max range
		}
	}
	else {
		if (temp > 100) {
			tempToDance = 100;
		} else if (temp < 0) {
			tempToDance = 0;
		} else tempToDance = temp;

		danceability = (tempToDance * .5) / 100; // where min danceability is .6, max will be 1
		$("input[name='danceability']").val((temp + .2)/10.0) // set value of slider
	}
	return danceability;
}

function getHappiness(weatherMetrics, isReWeather) {
	var happiness;
	var maxHappiness;
	if (isReWeather) {
		happiness = ($('input[name="happiness"]')[0]['valueAsNumber']/10);
		if (happiness > .5) {
			happiness = .5; //for range .8-1, which is max range
		}
		maxHappiness = happiness + 0.5;
	} else {
		happiness = weatherMetrics['min_valence'];
		maxHappiness = weatherMetrics['max_valence'];
		$("input[name='happiness']").val(((happiness+maxHappiness)/2)*10);
	}
	return [happiness, maxHappiness];
}

function getEnergy(weatherMetrics, isReWeather) {
	var energy;
	var maxEnergy;
	if (isReWeather) {
		energy = ($('input[name="energy"]')[0]['valueAsNumber']/10);
		if (energy >= .5) {
			energy = .5; //for range .8-1, which is max range
		}
		maxEnergy = energy + 0.5;
	} else {
		energy = weatherMetrics['min_energy'];
		maxEnergy = weatherMetrics['max_energy'];
		$("input[name='energy']").val(((energy+maxEnergy)/2.0)*10);
	}
	return [energy, maxEnergy];
}

function getTempo(weatherMetrics, isReWeather) {
	var tempo;
	var maxTempo;
	if (isReWeather) {
		tempo = ($('input[name="tempo"]')[0]['valueAsNumber']);
		if (tempo >= 200) {
			tempo = 200; //for range .8-1, which is max range
		}
		maxTempo = tempo + 70;
	} else {
		tempo = weatherMetrics['min_tempo'];
		maxTempo = weatherMetrics['max_tempo'];
		$("input[name='tempo']").val((tempo+maxTempo)/2.0);
	}
	return [tempo, maxTempo];
}

function getChristmas(isReWeather) {
	if (isReWeather) {
		var christmasPlaylist = $('input[name="christmasify"]:checked').val();
		if (!christmasPlaylist) {
			return 'christmas:false';
		} else {
			return christmasPlaylist;
		}
	} else {
		$("input[name='christmasify']").attr('checked', false);
		return 'christmas:false';
	}
}

/* Get seed song to set up echonest playlist */
function searchSeedSong(weatherMetrics, min_hot, temp, isReWeather) {
	var songSearchURL = 'http://developer.echonest.com/api/v4/song/search?song_type=';
	var genreSelected;

	songSearchURL += getChristmas(isReWeather);

	//Get user search parameters
	if (isReWeather){
		genreSelected = ($('input[name="genre"]:checked').val());
	} else {
		genreSelected= 'all';
		$('input[name="genre"]').prop('checked', true);
		//genreSelected = ($('input[name="genre"]').click('all'));
	}
	var endYear = $("#decade :selected").val();
	

	//uses current temp to map to danceability of a song
	var danceability = getDanceability(temp, isReWeather);
	var maxDanceability = 1;
	if (danceability > 0.5) {
		danceability = .5;
	}
	maxDanceability = danceability + 0.5;
	if (temp > 70) {
		maxDanceability = 1;
	}

	var energyArr = getEnergy(weatherMetrics, isReWeather);
	var happyArr = getHappiness(weatherMetrics, isReWeather);
	var tempoArr = getTempo(weatherMetrics, isReWeather);


	var energy = energyArr[0];
	var maxEnergy = energyArr[1];

	var happiness = happyArr[0];
	var maxHappiness = happyArr[1];

	var tempo = tempoArr[0];
	var maxTempo = tempoArr[1];


	var data = {
			'api_key': ECONEST_API_KEY,
			'format' : 'json',
			'bucket' : 'id:spotify',
			'max_tempo' : maxTempo,
			'min_tempo' : tempo,
			'min_energy' : (energy),
			'max_energy' : (maxEnergy),
			'min_valence' : (happiness),
			'max_valence' : (maxHappiness),
			'song_min_hotttnesss' : min_hot,
			'min_danceability' : danceability,
			'max_danceability' : maxDanceability,
			'results' : '1',
		}

	if (genreSelected && (genreSelected != 'all')) {
	    data.style = genreSelected;
	}


	if (endYear != 'all') {
		data.artist_end_year_before = endYear;		
	} 
	glblCurWeatherMetrics = weatherMetrics;
	glblCurDanceability = danceability;
	glblCurMaxDanceability = maxDanceability;
	glblCurEnergy = energyArr;
	glblCurHappiness = happyArr;
	glblCurTempo = tempoArr;

	$.ajax({
		'url': songSearchURL,
		'data': data,
		//callback function needs to be added here 
		'success': function(results) {
			// No result for seed song
			if (results['response']['songs'].length < 1) {
				// Decrement min hot if possible

				if (min_hot >= .1) {
						console.log('MIN HOT = ' + min_hot);
					searchSeedSong(weatherMetrics, (min_hot - .1), temp, isReWeather); // lower min popularity if need be
				} else {
					displayNoPlaylistResultsError();
				}
			} // Seed song found 
			else {

				searchPlaylist(results['response']['songs'], min_hot, danceability, weatherMetrics);
			}
		}
	});
	return false;
}

//must error check genre up to 5
// Get Echonest playlist using seed song
function searchPlaylist(seed, min_hot) {
	if (min_hot >= .5) {
		min_hot = .5;
	}
	var weatherMetrics = glblCurWeatherMetrics;
	var danceability = glblCurDanceability;
	var maxDanceability = glblCurMaxDanceability;
	var url = 'http://developer.echonest.com/api/v4/playlist/static?bucket=id:spotify&bucket=tracks';
	for (var i = 0; i < seed.length; i++) {
		url += '&song_id=' + seed[i]['id'];
	}


	var energy = glblCurEnergy[0];
	var maxEnergy = glblCurEnergy[1];
	var happiness = glblCurHappiness[0];
	var maxHappiness = glblCurHappiness[1];
	var tempo = glblCurTempo[0];
	var maxTempo = glblCurTempo[1];

	$.ajax({
		'url': url,
		'data': {
			'api_key': ECONEST_API_KEY,
			'type': 'song-radio',
			'max_energy' : (maxEnergy).toString(),
			'min_energy' : (energy).toString(),
			'max_tempo' : maxTempo,
			'min_tempo' : tempo,
			'min_valence' : (happiness),
			'max_valence' : (maxHappiness),
			'min_danceability' : danceability,
			'max_danceability' : maxDanceability,
			'results' : numResults,
		},
		//callback function needs to be added here 
		'success': function(results) {
			console.log("*****************");
			console.log(results['response']['songs'].length);
			console.log(results);
			// Try to get at least 15 results
			if (results['response']['songs'].length < 30 && min_hot >= 0.1) {
				searchPlaylist(seed, min_hot - .1);
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
	if (songs) {
		var playerString = '';
		for (var i = 0; i < songs.length; i++) {
	        playerString += songs[i]['songId'] + ',';
		}
	    return playerString;		
	} return '';

}

function getPlaylistName() {

	var name = '';

	if(isMood) {
		//get dropdown
		var mood = $("#mood option:selected").val();
		name += "The " + titlecase(mood) + " Playlist";
		return name;
	}

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
	return 'Untitled';
}

function createPlaylist(results) {

	currentPlaylistName = getPlaylistName();
    
    currentPlaylist = {
        'name' 		: currentPlaylistName,
        'temp' 		: nameTemp,
        'weather'	: nameWeather,
        'songs' 	: [],
        'playerString' : '',
        'isSaved' : false,
        'isNew' : true
    }

    for (var i = 0; i < results['response']['songs'].length; i++) {
        if (results['response']['songs'][i]['tracks'] && results['response']['songs'][i]['tracks'][0]) {

        	// See if there was an artist id
		    var artistId = '';
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

}

function refreshPlaylist() {
	refreshAddRemoveTable();
	currentPlaylist['playerString'] = getPlayerString(currentPlaylist['songs']);
	updatePlaylistTopBar();
	displayPlaylist();
}

	