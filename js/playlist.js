var ECONEST_API_KEY = 'LSQTUBGBNKDAXLM9H';
var isDrawerOpen = false;

var songIdResults;			//array of spotify ids
var currentPlaylist ='';	//keeps in memory current playlist
var numResults = 20;

/* FORMATTING SECTION */
function toggleDrawer() {
	isDrawerOpen = !isDrawerOpen;
	if (isDrawerOpen) {
		openDrawer();
	} else {
		closeDrawer();
	}
}

function openDrawer() {
	document.getElementById('options-window').style.display = "block";
	document.getElementById('fine-tune-span').innerHTML = "&#9650 Fine tune my playlist";
}
function closeDrawer() {
	document.getElementById('options-window').style.display = "none";	
	document.getElementById('fine-tune-span').innerHTML = "&#9660 Fine tune my playlist";
}


/* PLAYLIST SECTION */
function makeWeatherPlaylist(results) {
	var temp = results['main']['temp'];
	var tempString = temp.toString();
	document.getElementById('weather-report').innerHTML =
		"Today in " + results['name'] + " it\'s " + tempString.substring(0, tempString.indexOf('.')) + "&#176F";
	var id = "0";
	if (results['weather'] && results['weather'][0]['id']) {
		id = results['weather'][0]['id'].toString();
	}
	getRating(id);
}

function getRating(id) {
	console.log(id);
	var category = id.substring(0, 1);
	console.log(category);
	var rawSeverity = id.substring(1, id.length);
	console.log(category);
	console.log(rawSeverity);
	if (category == '9' && Number(rawSeverity) >= 50) {
		category = '10';
	}

	var weatherParams = categoryChart[category][rawSeverity];
	var weatherMetrics = convertWeather(weatherParams[0]);
	/*var maxenergy = weatherMetrics['max_energy'];
	var minenergy = weatherMetrics['max_energy'];	
	var maxtempo = weatherMetrics['min_tempo'];
	var mintempo = weatherMetrics['max_tempo'];
	var maxaccousticness = weatherMetrics['min_accousticness'];
	var minaccousticness = weatherMetrics['max_accousticness'];*/
	searchMusic(weatherMetrics);
}

function convertWeather(id) {
	return (musicChart[id]);
}


function searchMusic(weatherMetrics) {
	
	var genreCheckboxes = document.getElementsByName('genre');
	console.log(genreCheckboxes);
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
			'results' : numResults,
			'style' : genreSelected,
			'artist_end_year_before' : endYear,
		},
		//callback function needs to be added here 
		'success': function(results) {
			console.log('ECHONEST RESULTS');
			console.log(results);
			getSongIds(results);
		}
	});
	return false;
}


function getSongIds(results) {
	playlistIds = [];
	var songIdRequests = [];	//reset requests array
	songIdResults = [];			//reset results array
	var artist;
	var name;

	console.log("^^^^^^^^^^");
	console.log(results);
	for (var i = 0; i < results['response']['songs'].length; i++) {
		artist = results['response']['songs'][i]['artist_name'];
		name = results['response']['songs'][i]['title'];
		songIdRequests.push(getSongId(artist, name));

	}

	$.when($, songIdRequests).done(function() {
        songIdResults = arguments;
        //console.log(songIdResults);
        //console.log(songIdRequests);
        //currentPlaylist = ""; //reset current playlist
        displayPlaylist(songIdRequests);
        console.log(currentPlaylist);
    });
}

function displayPlaylist(results) {
	for (var i = 0; i < results.length; i++) {
		console.log(results);
		currentPlaylist += results[i].id;
		currentPlaylist += ',';
	}
}



function getSongId(artist, name) {
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
	  		console.log(data);
	        // Check to make sure at least one song was returned
	        var isValid = data['tracks'] && data['tracks']['items'] && (
	        	data['tracks']['items'].length > 0);
	        if (!isValid) {
	         numResults--;
	         console.log(numResults + " not valid");// displayBadParamsError(); // let user know that no results were found
	        } //Valid! push to songIdResults
	        else {
	        	console.log("*@@@@@@@@@@@@*");
	        	console.log(data['tracks']['items'][0]);
	        	songIdResults.push(data['tracks']['items'][0]);
	        	currentPlaylist += data['tracks']['items'][0].id;
	        	currentPlaylist += ',';
	        	console.log(songIdResults);
	        }

	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	    	console.log(errorThrown);
	    	console.log(textStatus);
	        //displayBadParamsError();

	    }
	});
}


function makeNewPlaylist() {
  var location = document.getElementById('loc').value;
  if (isDrawerOpen) {
  	toggleDrawer();
  }
  getLocation(location);
  $('#playlist-results').empty();
  var playerHtml = '<br><br><iframe src="https://embed.spotify.com/?uri=spotify:trackset:';

    // if you want:
    //playerHtml += PLAYLIST NAME

    //adds 20 songs to the playlist 
    //need function that generates playlist based on weather 
    //playerHtml += '6t1VvXUla9YRJ4EV1SPJFZ,4HaRqrk4LRjCiQBqtMc6NE,65wx71brAmEQz66GXXF8gI,7fnnkYFOPqdzVYd339U7TM,07pChN3h9EciKJussyb8Hu';
    playerHtml += currentPlaylist;
    playerHtml += '" frameborder="0" width="640px" height="700" align="center" allowtransparency="true"></iframe>';

    $('#playlist-results').append(playerHtml);
    console.log(playerHtml);  
    return false;
}


function saveCurrentPlaylist() {
	//this function will add the current playlist to the database
}

function showPlaylist() {
	//for saved playlists, location and/or weather and playlist should be saved
}

/* VARIABLES FOR INFORMATION */
var categoryChart = {
	'2' : {
		'00' : ['2', '0', 'thunderstorm with light rain'],
		'01' : ['2', '1', 'thunderstorm with rain'],
		'02' : ['2', '2','thunderstorm with heavy rain'],
		'10' : ['2', '3', 'light thunderstorm'],
		'11' : ['2', '4', 'thunderstorm'],
		'12' : ['2', '5', 'heavy thunderstorm'],
		'21' : ['2', '6', 'ragged thunderstorm'],
		'30' : ['2', '7', 'thunderstorm with light drizzle'],
		'31' : ['2', '8', 'thunderstorm with drizzle'],
		'32' : ['2', '9', '	thunderstorm with heavy drizzle']
	},
	'3' : {
		'00' : ['3', '0', 'light intensity drizzle'],
		'01' : ['3', '1', 'drizzle'],
		'02' : ['3', '2','heavy intensity drizzle'],
		'10' : ['3', '3', 'light intensity drizzle rain'],
		'11' : ['3', '4', 'drizzle rain'],
		'12' : ['3', '5', 'heavy intensity drizzle rain'],
		'13' : ['3', '6', 'shower rain and drizzle'],
		'14' : ['3', '7', 'heavy shower rain and drizzle'],
		'21' : ['3', '8', 'shower drizzle']
	},
	'5' : {
		'00' : ['5', '0', 'light rain'],
		'01' : ['5', '1', 'moderate rain'],
		'02' : ['5', '2','heavy intensity rain'],
		'03' : ['5', '3', 'very heavy rain'],
		'04' : ['5', '4', 'extreme rain	'],
		'11' : ['5', '5', 'freezing rain'],
		'20' : ['5', '6', '	light intensity shower rain'],
		'21' : ['5', '7', 'shower rain'],
		'22' : ['5', '8', 'heavy intensity shower rain'],
		'31' : ['5', '9', 'ragged shower rain']
	},
	'6' : {
		'00' : ['6', '0', 'light snow'],
		'01' : ['6', '1', 'snow'],
		'02' : ['6', '2','heavy snow'],
		'11' : ['6', '3', 'sleet'],
		'12' : ['6', '4', 'shower sleet'],
		'15' : ['6', '5', 'light rain and snow'],
		'16' : ['6', '6', 'rain and snow'],
		'20' : ['6', '7', 'light shower snow'],
		'21' : ['6', '8', 'shower snow'],
		'22' : ['6', '9', 'heavy shower snow']
	},
	'7' : {
		'01' : ['7', '0', 'mist'],
		'11' : ['7', '1', 'smoke'],
		'21' : ['7', '2', 'haze'],
		'31' : ['7', '3', 'sand/dust whirls'],
		'41' : ['7', '4', 'fog'],
		'51' : ['7', '5', 'sand'],
		'61' : ['7', '6', 'dust'],
		'62' : ['7', '7', 'volcanic ash'],
		'71' : ['7', '8', 'squalls'],
		'81' : ['7', '9', 'tornado'],
	},

	'8' : {
		'00' : ['8', '0', 'sky is clear'],
		'01' : ['8', '1', 'few clouds'],
		'02' : ['8', '2', 'scattered clouds'],
		'03' : ['8', '3', 'broken clouds'],
		'04' : ['8', '4', 'overcast clouds'],
	},

	'9' : {
		'00' : ['9', '0', 'tornado'],
		'01' : ['9', '1', 'tropical storm'],
		'02' : ['9', '2', 'hurricane'],
		'03' : ['9', '3', 'cold'],
		'04' : ['9', '4', 'hot'],
		'05' : ['9', '5', 'windy'],
		'06' : ['9', '6', 'hail'],
	},

	'10' : {
		'50' : ['10', '0', 'calm'],
		'51' : ['10', '0', 'calm'],
		'52' : ['10', '1', 'light breeze'],
		'53' : ['10', '2', 'gentle breeze'],
		'54' : ['10', '3', 'moderate breeze'],
		'55' : ['10', '4', 'fresh breeze'],
		'56' : ['10', '5', 'strong breeze'],
		'57' : ['10', '6', 'high wind, near gale'],
		'58' : ['10', '6', 'gale'],
		'59' : ['10', '7', 'severe gale'],
		'60' : ['10', '8', 'storm'],
		'61' : ['10', '9', 'violent storm'],
		'62' : ['10', '9', 'hurricane']
	}
}

var musicChart = {
	'2' : {
		'max_energy' : '0.7',
		'min_energy' : '0.3',
		'max_tempo' : '500',
		'min_tempo' : '0',
		'max_acousticness' : '1',
		'min_acousticness' : '0.5',

	},
	'3' : {
		'max_energy' : '0.4',
		'min_energy' : '0.1',
		'max_tempo' : '500',
		'min_tempo' : '0',
		'max_acousticness' : '1',
		'min_acousticness' : '0.5',
	},
	'5' : {
		'max_energy' : '0.3',
		'min_energy' : '0.1',
		'max_tempo' : '500',
		'min_tempo' : '0',
		'max_acousticness' : '1',
		'min_acousticness' : '0.5',
	},
	'6' : {
		'max_energy' : '0.5',
		'min_energy' : '0.2',
		'max_tempo' : '500',
		'min_tempo' : '0',
		'max_acousticness' : '0.7',
		'min_acousticness' : '0.2',
	},
	'7' : {
		'max_energy' : '0.4',
		'min_energy' : '0',
		'max_tempo' : '500',
		'min_tempo' : '0',
		'max_acousticness' : '1',
		'min_acousticness' : '0.5',
	},

	'8' : {
		'max_energy' : '0.5',
		'min_energy' : '0.2',
		'max_tempo' : '500',
		'min_tempo' : '0',
		'max_acousticness' : '1',
		'min_acousticness' : '0.5',
	},

	'9' : {
		'max_energy' : '1',
		'min_energy' : '0.5',
		'max_tempo' : '500',
		'min_tempo' : '0',
		'max_acousticness' : '0.5',
		'min_acousticness' : '0',
	},

	'10' : {
		'max_energy' : '0.5',
		'min_energy' : '0',
		'max_tempo' : '500',
		'min_tempo' : '0',
		'max_acousticness' : '1',
		'min_acousticness' : '0',
	}
}