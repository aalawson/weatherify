/* 
  Locations.js
  by Anna Lawson, Anfal Boussayoud, Lauren Tom, Nina Sabado 

  Javascript built to deal with finding location and weather, calling on IP API, Google API and OpenWeatherMap API
*/
  var GOOGLE_API_KEY = 'AIzaSyAXZufRi7zaaC4YS7MXV8oS9sduuPcgst8';
  var LOCATE_API_KEY = 'AIzaSyDdAeQrbuEWXNgfVmafLqFyGQcJFBulgLo';

// error: can't find user. location automatically set to New York.
function couldntFindMe() {
  document.getElementById('loc').value = "New York"; 
  document.getElementById('home-intro-error').innerHTML = '';
}

// error: user enters location that can't be found
function couldntFindLocation() {
  couldntFindMe();
  document.getElementById('home-intro-error').innerHTML = 'Oops! We couldn\'t find the location you entered';
}

// takes the user's IP address and returns their lat and long
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

// based on lat and long, finds the city & state of the user
function reverseGeocode(lat, lng) {
  $.ajax ({
    'url': 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + GOOGLE_API_KEY,
    'cache':true,
    success : function(data, textStats, XMLHttpRequest) {

      // Check to make sure at least one song was returned
      var isValid = data['results'][0] 
        && data['results'][0]['address_components'][3]  // sublocality
        && data['results'][0]['address_components'][4]; // locality
      
      if (!isValid) {
        couldntFindMe(); // let user know that no results were found
      } //Valid! Display first ten results
      
      else {
        document.getElementById('loc').value 
          = data['results'][0]['address_components'][3]['long_name'] + ", "
          + data['results'][0]['address_components'][4]['long_name'];
        curLocation = data['results'][0]['address_components'][3]['long_name'];
        document.getElementById('home-intro-error').innerHTML = '';
        return false;
      }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      couldntFindMe();

      // MAKE-ERROR-MSG!

    }
  });  
}

// based on address, returns location 
function getLocation(location, isReWeather) {
  glblIsReWeather = isReWeather;
  $.ajax ({
    'url': 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + GOOGLE_API_KEY,
    'cache':true,
    success : function(data, textStats, XMLHttpRequest) {
      // Check to make sure at least one song was returned
      var isValid = data['results'] && (data['results'].length > 0);
      if (!isValid) {
          couldntFindLocation(); // let user know that no results were found
      } //Valid!
      else {
        searchLocation(data['results'], isReWeather);
        return false;
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      couldntFindLocation();
      // MAKE-ERROR-MSG!
    }
  });
}

//based on lat and lng, calls getWeather to get the weather
function searchLocation(results, isReWeather) {
  glblIsReWeather = isReWeather;
  // In rare case of multiple results, Google Maps geocoder returns
  // most meaningful result first, so I just use index 0.
  var lat = results[0]['geometry']['location']['lat'];
  var lng = results[0]['geometry']['location']['lng'];
  var address = results[0]['formatted_address'];
  if (results[0]['address_components'][0]['long_name']) {
    curLocation = results[0]['address_components'][0]['long_name'];
  } else {
    curLocation = address;
  }
  document.getElementById('loc').value = curLocation;
  switchToCurrentPlaylist();
  document.getElementById('options-window').style.display = "none";  
  getWeather(lat, lng, isReWeather);
  return false;
}

