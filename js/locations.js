/* GLOBAL VARIABLIES */
var GOOGLE_API_KEY = 'AIzaSyAXZufRi7zaaC4YS7MXV8oS9sduuPcgst8';
var LOCATE_API_KEY = 'AIzaSyDdAeQrbuEWXNgfVmafLqFyGQcJFBulgLo';
var ECHONEST_API_KEY = 'UOLQFEZCTDHUNBF6K';




function couldntFindMe() {
    document.getElementById('loc').value = "New York"; 
    document.getElementById('home-intro-error').innerHTML = '';
}

function couldntFindLocation() {
    couldntFindMe();
    document.getElementById('home-intro-error').innerHTML = 'Oops! We couldn\'t find the location you entered';
}

function findMe() {

    $.getJSON('http://ip-api.com/json/?callback=?', function(data) {
        // Check to make sure at least one song was returned
        var isValid = data['lat'] && data['lon'];
        if (!isValid) {
          couldntFindMe(); // let user know that no results were found
        } //Valid! Display first ten results
        else {
          reverseGeocode(data['lat'], data['lon']);
          return false;
      }
  });   
}



function reverseGeocode(lat, lng) {
    $.ajax ({
      'url': 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + GOOGLE_API_KEY,
      'cache':true,
      success : function(data, textStats, XMLHttpRequest) {
        // Check to make sure at least one song was returned
        console.log(data['results'][0]);
        var isValid = data['results'][0] && data['results'][0]['formatted_address'];
        if (!isValid) {
          console.log("hi");
          couldntFindMe(); // let user know that no results were found
        } //Valid! Display first ten results
        else {
          console.log(data);
          document.getElementById('loc').value = data['results'][0]['formatted_address'];
          document.getElementById('home-intro-error').innerHTML = '';
          return false;
      }

  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
    console.log(textStatus);
    couldntFindMe();

}
});  
}
function getLocation(location) {
    $.ajax ({
        'url': 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + GOOGLE_API_KEY,
        'cache':true,
        success : function(data, textStats, XMLHttpRequest) {
            // Check to make sure at least one song was returned
            var isValid = data['results'] && (data['results'].length > 0);
            if (!isValid) {
                couldntFindLocation(); // let user know that no results were found
            } //Valid! Display first ten results
            else {
                searchLocation(data['results']);
                return false;
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            couldntFindLocation();

        }
    });
}

/* WEATHER SECTION */
function getWeather(lat, lng) {
  $.ajax({
    'url': 'http://api.openweathermap.org/data/2.5/weather',
    'data': {
      'lat': lat,
      'lon': lng,
      'units': 'imperial',
      'appid': '670b2cbcd683c42c5e41a0ed424b537b'
    },
    'success': function(results) {
      console.log(results);
      makeWeatherPlaylist(results);
    }
  });
  return false;
}

function searchLocation(results) {
  // In rare case of multiple results, Google Maps geocoder returns
  // most meaningful result first, so I just use index 0.
  var lat = results[0]['geometry']['location']['lat'];
  var lng = results[0]['geometry']['location']['lng'];
  var address = results[0]['formatted_address'];
  console.log(results);
  console.log("*****************");
  document.getElementById('home-intro-screen').setAttribute('class', 'unselected home-content');
  document.getElementById('home-new-playlist').setAttribute('class', 'selected home-content');
  document.getElementById('options-window').style.display = "none";  
  console.log(document.getElementById('options-window').style.display); 
  getWeather(lat, lng);
  return false;
}

