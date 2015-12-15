/* 
    Playlist.js
    by Anna Lawson, Anfal Boussayoud, Lauren Tom, Nina Sabado 

    Javascript built to deal with any playlist logic, calling on EchoNest + Spotify APIs
*/
var ECHONEST_API_KEY = 'UOLQFEZCTDHUNBF6K';
var ECONEST_API_KEY = 'LSQTUBGBNKDAXLM9H';

/* VARIABLES DEALING WITH PLAYLIST */
var songIdResults = [];			//array of spotify ids
var numResults = 40;

// Weatherify button calls this -- makes a playlist based on weather
function makeNewPlaylist() {
	document.getElementById('playlist-results').innerHTML = "<p id=\"loading-message\">...Loading...</p>";
	var location = document.getElementById('loc').value;
	if (isDrawerOpen) {
		toggleDrawer();
	}
	getLocation(location);
    return false;
}

/* Get seed song to set up echonest playlist */
function searchSeedSong(weatherMetrics) {
	
	var songSearchURL = 'http://developer.echonest.com/api/v4/song/search?song_type='
	var genreSelected = ($('input[name="genre"]:checked').val());
	var endYear = $("#decade :selected").val();

	var christmasPlaylist = $('input[name="christmasify"]:checked').val();

	if (!christmasPlaylist) {
		songSearchURL +='christmas:false';
	} else {
		songSearchURL += christmasPlaylist;
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
			'results' : '1',
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
			searchPlaylist(results['response']['songs'][0]['id']);
		}
	});
	return false;
}

//must error check genre up to 5
// Get Echonest playlist using seed song
function searchPlaylist(seed) {
	


	$.ajax({
		'url': 'http://developer.echonest.com/api/v4/playlist/static?bucket=id:spotify&bucket=tracks',
		'data': {
			'api_key': ECONEST_API_KEY,
			'type': 'song-radio',
			'song_id' : seed,
			'results' : numResults,
		},
		//callback function needs to be added here 
		'success': function(results) {
			createPlaylist(results);
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

function createPlaylist(results) {
	currentPlaylistName = nameTemp + "° and " + titlecase(nameWeather);
    
    currentPlaylist = {
        'name' 		: currentPlaylistName,
        'temp' 		: nameTemp,
        'weather'	: nameWeather,
        'songs' 	: [],
        'playerString' : ''
    }
    for (var i = 0; i < results['response']['songs'].length; i++) {
        if (results['response']['songs'][i]['tracks'][0]) {
            currentPlaylist['songs'].push( {
            'songName' : results['response']['songs'][i]['title'],
            'artist' : results['response']['songs'][i]['artist_name'],
            'artistId' : results['response']['songs'][i]['artist_foreign_ids'][0]['foreign_id'],
            'songId' : results['response']['songs'][i]['tracks'][0]['foreign_id'].replace('spotify:track:', ''),
         });    
        }
    }
    currentPlaylist['playerString'] = getPlayerString(currentPlaylist['songs']);
    displayPlaylist();
}

	