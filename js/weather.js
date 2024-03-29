/* 
    Weather.js
    by Anna Lawson, Anfal Boussayoud, Lauren Tom, Nina Sabado 

    Javascript built to house algorithms that convert weather into song types
*/

/* VARIABLES DEALING WITH PLAYLIST */
	var buffer_val = .01;
	var bufferMetrics = ['max_energy', 'min_energy', 'max_acousticness', 'min_acousticness'];
	var isOpposite = false;


/* WEATHER SECTION */

//takes in the lat/long and returns the local weather
function getWeather(lat, lng, isReWeather) {
	glblIsReWeather = isReWeather;
	$.ajax({
	  'url': 'http://api.openweathermap.org/data/2.5/weather',
	  'data': {
	    'lat': lat,
	    'lon': lng,
	    'units': 'imperial',
	    'appid': '670b2cbcd683c42c5e41a0ed424b537b'
	  },
	  success: function(results) {
	    processWeatherData(results, isReWeather);
	  },
	  error: function(results){
	    // MAKE-ERROR-MSG!
	  }
	});
	return false;
}

// Takes weather results and converts to a rating for getting music
function processWeatherData(weatherResults, isReWeather) {
	glblIsReWeather = isReWeather;
	var temp 		= weatherResults['main']['temp'];
	var tempString 	= temp.toString();
	if (tempString.indexOf('.') >= 0) {
		nameTemp		= tempString.substring(0, tempString.indexOf('.'));		
	} else {
		nameTemp = tempString;
	}
	var id = "0";
	if (weatherResults['weather'] && weatherResults['weather'][0]['id']) {
		id = weatherResults['weather'][0]['id'].toString();
	}

	getWeatherRating(id, temp, isReWeather);
}

//takes in the id/temp and sends it to searchSeedSong
function getWeatherRating(id, temp, isReWeather) {

	glblIsReWeather = isReWeather;
	var category = id.substring(0, 1);
	var rawSeverity = id.substring(1, id.length);

	if (category == '9' && Number(rawSeverity) >= 50) {
		category = '10';
	}

	var weatherParams 	= categoryChart[category][rawSeverity];
	nameWeather			= weatherParams[2];
	var weatherMetrics 	= musicChart[weatherParams[0]];
	/*var maxenergy = weatherMetrics['max_energy'];
	var minenergy = weatherMetrics['max_energy'];	
	var maxtempo = weatherMetrics['min_tempo'];
	var mintempo = weatherMetrics['max_tempo'];
	var maxaccousticness = weatherMetrics['min_accousticness'];
	var minaccousticness = weatherMetrics['max_accousticness'];*/

	if (isOpposite) {
		weatherParams = getOppositeDayMetrics(weatherParams);
		nameWeather = weatherParams[2];
		weatherMetrics = musicChart[weatherParams[0]];
		getOppositeDayTemp();
		updatePlaylistTopBar();

		// Now get seed song to make playlist
		searchSeedSong(weatherMetrics, .7, temp, isReWeather);
	} else {
		updatePlaylistTopBar();

		// Now get seed song to make playlist
		searchSeedSong(weatherMetrics, .7, temp, isReWeather);
	}
}

//flips the metrics of the current weather
function getOppositeDayTemp() {
	var tempDiff = 50 - Number(nameTemp);
	var oppositeTemp = 50 + tempDiff;
	nameTemp = oppositeTemp.toString();
	return oppositeTemp.toString();
}

//changes the intensity of metrics depending on category
function bufferSeverity(category) {

	//done to remove 0-index
	cat_val = parseInt(category[1]) + 1;

	//multiplies by current buffer val
	mbuff = (cat_val * buffer_val);

	//holds weatherMetrics pre-buffering
	weatherMetrics = musicChart[category[0]];

	//goes through each metric and updates intensity 
	for(var i in bufferMetrics) {

		if (parseFloat(weatherMetrics[bufferMetrics[i]]) >= .1){
			weatherMetrics[bufferMetrics[i]] = ''+(parseFloat(weatherMetrics[bufferMetrics[i]] - .1) + mbuff);
		}
	}
	
	return weatherMetrics;
}

/* VARIABLES FOR INFORMATION */
var categoryChart = {
	'2' : { // Thunderstorms
		'00' : ['11', '0', 'thunderstorm with light rain'],
		'01' : ['11', '1', 'thunderstorm with rain'],
		'02' : ['11', '2','thunderstorm with heavy rain'],
		'10' : ['11', '3', 'light thunderstorm'],
		'11' : ['11', '4', 'thunderstorm'],
		'12' : ['11', '5', 'heavy thunderstorm'],
		'21' : ['11', '6', 'ragged thunderstorm'],
		'30' : ['11', '7', 'thunderstorm with light drizzle'],
		'31' : ['11', '8', 'thunderstorm with drizzle'],
		'32' : ['11', '9', '	thunderstorm with heavy drizzle']
	},
	'3' : { // Drizzle
		'00' : ['3', '0', 'light intensity drizzle'],
		'01' : ['3', '1', 'drizzle'],
		'02' : ['3', '2','heavy intensity drizzle'],
		'10' : ['3', '3', 'light intensity drizzle rain'],
		'11' : ['3', '4', 'drizzle rain'],
		'12' : ['5', '5', 'heavy intensity drizzle rain'],
		'13' : ['5', '6', 'shower rain and drizzle'],
		'14' : ['5', '7', 'heavy shower rain and drizzle'],
		'21' : ['5', '8', 'shower drizzle']
	},
	'5' : { // Rains
		'00' : ['3', '0', 'light rain'],
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
	'6' : { // Snow
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
	'7' : { // Haziness & Severe
		'01' : ['7', '0', 'mist'],
		'11' : ['7', '1', 'smoke'],
		'21' : ['7', '2', 'haze'],
		'31' : ['7', '3', 'sand/dust whirls'],
		'41' : ['7', '4', 'fog'],
		'51' : ['7', '5', 'sand'],
		'61' : ['7', '6', 'dust'],
		'62' : ['10', '7', 'volcanic ash'],
		'71' : ['10', '8', 'squalls'],
		'81' : ['10', '9', 'tornado'],
	},

	'8' : { // Cloudiness
		'00' : ['1', '0', 'sky is clear'], //move to happy weathers category
		'01' : ['8', '1', 'few clouds'], //move to happy weathers category
		'02' : ['8', '2', 'scattered clouds'],
		'03' : ['8', '3', 'broken clouds'],
		'04' : ['8', '4', 'overcast clouds'],
	},

	'9' : { // Severe
		'00' : ['11', '9', 'tornado'],
		'01' : ['11', '9', 'tropical storm'],
		'02' : ['11', '9', 'hurricane'],
		'03' : ['10', '0', 'cold'], //
		'04' : ['1', '3', 'hot'], // move to happy weathers category
		'05' : ['11', '9', 'windy'],
		'06' : ['11', '9', 'hail'],
	},

	'10' : { // Calm & Severe Windws
		'50' : ['10', '0', 'calm'],
		'51' : ['10', '0', 'calm'],
		'52' : ['10', '1', 'light breeze'],
		'53' : ['10', '2', 'gentle breeze'],
		'54' : ['11', '3', 'moderate breeze'],
		'55' : ['11', '4', 'fresh breeze'],
		'56' : ['11', '5', 'strong breeze'],
		'57' : ['11', '6', 'high wind, near gale'],
		'58' : ['11', '6', 'gale'],
		'59' : ['11', '7', 'severe gale'],
		'60' : ['11', '8', 'storm'],
		'61' : ['11', '9', 'violent storm'],
		'62' : ['11', '9', 'hurricane']
	}
}

var musicChart = {
	// Happy things --faster, higher energy
	'1' : {
		'max_energy' : '1',
		'min_energy' : '.6',
		'min_valence' : '.6',
		'max_valence' : '1',
		'max_tempo' : '500',
		'min_tempo' : '100',
	},// Light Rain/ Drizzle --moderately slow sad music
	'3' : {
		'max_energy' : '0.5',
		'min_energy' : '0',
		'min_valence' : '0',
		'max_valence' : '.5',
		'max_tempo' : '140',
		'min_tempo' : '0',
	}, // Heavy Rain / Drizzle -- slow sad music
	'5' : {
		'max_energy' : '0.5',
		'min_energy' : '0',
		'min_valence' : '0',
		'max_valence' : '.5',
		'max_tempo' : '120',
		'min_tempo' : '0',
	}, // Snow -- Not anything too fast, low energy, some acousticness
	'6' : {
		'max_energy' : '0.6',
		'min_energy' : '0.2',
		'min_valence' : '.2',
		'max_valence' : '.7', //snow could be more positive than rain
		'max_tempo' : '180',
		'min_tempo' : '0',
	}, // Hazy Things
	'7' : {
		'max_energy' : '0.5',
		'min_energy' : '0',
		'min_valence' : '0',
		'max_valence' : '.7',
		'max_tempo' : '160',
		'min_tempo' : '0',
	}, // Cloudy
	'8' : {
		'max_energy' : '0.5',
		'min_energy' : '0',
		'min_valence' : '0',
		'max_valence' : '.5',
		'max_tempo' : '150',
		'min_tempo' : '0',
	}, // Calm
	'10' : {
		'max_energy' : '.5',
		'min_energy' : '0',
		'min_valence' : '.2',
		'max_valence' : '.7',
		'max_tempo' : '180',
		'min_tempo' : '0',
	},
    // Very Severe Things
	'11' : {
		'max_energy' : '1',
		'min_energy' : '.5',
		'min_valence' : '0',
		'max_valence' : '.5',
		'max_tempo' : '500',
		'min_tempo' : '0',
	}
}

function getOppositeDayMetrics(weatherMetric) {
	var category = weatherMetric[0];
	var severity = weatherMetric[1];
	// Clear and calm map to violent storm
	if (category == '1' || category == '10') {
		return ['11', '9', 'violent storm'];
	} // Precipitations maps to clear skies
	else if (category == '3' || category == '5' || category == '6' || category == '7' || category == '8') {
		return ['1', '0', 'sky is clear'];
	} // Severe weather maps to calm
	else if (category == '11') {
	    return ['10', '0', 'calm'];
	}
}
