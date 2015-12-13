
function changeToLocationPlayList() {
    document.getElementById('loc-playlist').setAttribute('class', 'selected type-form');
    document.getElementById('mood-playlist').setAttribute('class', 'unselected type-form');   
}

function changeToMoodPlaylist() {
    document.getElementById('loc-playlist').setAttribute('class', 'unselected type-form');
    document.getElementById('mood-playlist').setAttribute('class', 'selected type-form');   
}
// Switch Tab to Manage Groups
function switchToHome() {
    // Set group tab to selected
    document.getElementById('t1').setAttribute('class', 'selected tab');
    document.getElementById('t2').setAttribute('class', 'unselected tab');
    document.getElementById('t3').setAttribute('class', 'unselected tab');

    // Set group display to selected
    document.getElementById('home').setAttribute('class', 'selected body-content');
    document.getElementById('view-playlists').setAttribute('class', 'unselected body-content');
    document.getElementById('search').setAttribute('class', 'unselected body-content');
}

function switchToViewPlaylists() {
    document.getElementById('t1').setAttribute('class', 'unselected tab');
    document.getElementById('t2').setAttribute('class', 'selected tab');
    document.getElementById('t3').setAttribute('class', 'unselected tab');


    // Set group display to selected
    document.getElementById('home').setAttribute('class', 'unselected body-content');
    document.getElementById('view-playlists').setAttribute('class', 'selected body-content');
    document.getElementById('search').setAttribute('class', 'unselected body-content');
}

// Switch Tab to Search
function switchToSearch() {
// Set group tab to selected
    document.getElementById('t1').setAttribute('class', 'unselected tab');
    document.getElementById('t2').setAttribute('class', 'unselected tab');
    document.getElementById('t3').setAttribute('class', 'selected tab');


    // Set group display to selected
    document.getElementById('home').setAttribute('class', 'unselected body-content');
    document.getElementById('view-playlists').setAttribute('class', 'unselected body-content');
    document.getElementById('search').setAttribute('class', 'selected body-content');
}

function makeNewPlaylist() {
    console.log("changing screens");
    document.getElementById('home-intro-screen').setAttribute('class', 'unselected home-content');
    document.getElementById('home-new-playlist').setAttribute('class', 'selected home-content');
    document.getElementById('options-window').style.display = "none";   
    var location = document.getElementById('geo').value;
    getLocation(location);
    return false;
}

function getLocation(location) {
  $.ajax ({
    'url': 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + GOOGLE_API_KEY,
    'cache':true,
    success : function(data, textStats, XMLHttpRequest) {
        // Check to make sure at least one song was returned
        var isValid = data['results'] && (data['results'].length > 0);
        if (!isValid) {
          displayBadParamsError(); // let user know that no results were found
        } //Valid! Display first ten results
        else {
          searchLocation(data['results']);
        }

      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        displayBadParamsError();

      }
    });
}
function searchLocation(results) {
  // In rare case of multiple results, Google Maps geocoder returns
  // most meaningful result first, so I just use index 0.
  var lat = results[0]['geometry']['location']['lat'];
  var lng = results[0]['geometry']['location']['lng'];
  var address = results[0]['formatted_address'];
  console.log(results);
  console.log("*****************");
  getWeather(lat, lng);
}

function getWeather(lat, lng) {
   document.getElementById('options-window').style.display = "block";
    $.ajax({
        'url': 'http://api.openweathermap.org/data/2.5/weather',
        'data': {
            'lat': lat,
            'lon': lng,
            'appid': '670b2cbcd683c42c5e41a0ed424b537b'
        },
        'success': function(results) {
            console.log(results);
        }
    });
    return false;
}