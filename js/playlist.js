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
var playlists = [];	
var currentPlaylistIndex = -1;	//number of echonest results

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
		genreSelected = '';
	}

	var endYear = $("decade :selected").val();
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

			'artist_end_year_before' : endYear,

		}
	if (genreSelected.length >= 1) {
	    data.style = genreSelected;
	    console.log(genreSelected);
	}

	console.log(data);

	
	$.ajax({
		'url': 'http://developer.echonest.com/api/v4/song/search',
		'data': data,
		//callback function needs to be added here 
		'success': function(results) {
			// getSongIds(results);
			console.log(results);
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
			displayPlaylist(results);
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

// Make playbutton with all songs in playlist
function displayPlaylist(results) {
	console.log(results);
	var playlist = {
	    'name' : 'test-playlist',
	    'weather' : '68-and-sunny',
	    'songs' : [],
	    'playerString' : ''
	}
	for (var i = 0; i < results['response']['songs'].length; i++) {
		if (results['response']['songs'][i]['tracks'][0]) {
		    console.log(results['response']['songs'][i]['tracks']);
            playlist['songs'].push( {
         	'songName' : results['response']['songs'][i]['title'],
         	'artist' : results['response']['songs'][i]['artist_name'],
         	'artistId' : results['response']['songs'][i]['artist_foreign_ids'][0]['foreign_id'],
            'songId' : results['response']['songs'][i]['tracks'][0]['foreign_id'].replace('spotify:track:', ''),
         });	
		}
	}

	playlist['playerString'] = getPlayerString(playlist['songs']);
	playlists.push(playlist);
	currentPlaylistIndex = playlists.length - 1;
 	$('#playlist-results').empty();

	var playerHtml = '<br><br><iframe src="https://embed.spotify.com/?uri=spotify:trackset:';

    // if you want:
    //playerHtml += PLAYLIST NAME

    //adds 20 songs to the playlist 
    //need function that generates playlist based on weather 
    playerHtml += playlists[currentPlaylistIndex]['playerString'];
    playerHtml += '" frameborder="0" width="640px" height="700" align="center" allowtransparency="true"></iframe>';
    playerHtml += '<button type="button" id="open-search-button" class="g-button form-box" onclick="openSearchPopup(); return false;">&#43Add a song</button>';

    $('#playlist-results').append(playerHtml);
}

function showPlaylist() {
	//for saved playlists, location and/or weather and playlist should be saved
}

	