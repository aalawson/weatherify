/* 
    Weather.js
    by Anna Lawson, Anfal Boussayoud, Lauren Tom, Nina Sabado 

    Javascript built to house algorithms that convert weather into song types
*/

    /* GLOBAL VARIABLES */
    var ECHONEST_API_KEY = 'UOLQFEZCTDHUNBF6K';
    var ECONEST_API_KEY = 'LSQTUBGBNKDAXLM9H';  

	function getRating(id) {
		var category = id.substring(0, 1);
		var rawSeverity = id.substring(1, id.length);

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
		weatherMetrics = musicChart['10'];
		
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
				'results' : numResults,
				'style' : genreSelected,
				'artist_end_year_before' : endYear,

			},
			//callback function needs to be added here 
			'success': function(results) {
				// getSongIds(results);
				console.log(results['response']);
			}
		});
		return false;
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
	function searchPlaylist(seed) {
		
		$.ajax({
			'url': 'http://developer.echonest.com/api/v4/playlist/static',
			'data': {
				'api_key': ECONEST_API_KEY,
				'format' : 'json',
				'type': 'song-radio',
				'bucket' : 'id:spotify',
				'song_id' : seed,
				'results' : numResults
				
				
			},
			//callback function needs to be added here 
			'success': function(results) {
				// getSongIds(results);
				console.log(results);
			}
		});
		return false;
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