var GOOGLE_API_KEY = 'AIzaSyAXZufRi7zaaC4YS7MXV8oS9sduuPcgst8';
var LOCATE_API_KEY = 'AIzaSyDdAeQrbuEWXNgfVmafLqFyGQcJFBulgLo';
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
    var location = document.getElementById('loc').value;
    getLocation(location);

    var playerHtml = '<iframe src="https://embed.spotify.com/?uri=spotify:trackset:';

    //adds 20 songs to the playlist 
    // for (var i = 0; i < 20; i++) {
    //   playerHtml += SONG URI ;
    // }

    playerHtml += '5Z7ygHQo02SUrFmcgpwsKW,1x6ACsKV4UdWS2FMuPFUiT,4bi73jCM02fMpkI11Lqmfe';

    playerHtml += '" frameborder="0" allowtransparency="true"></iframe>';

    $('playlist-results').append(playerHtml);

    return false;
}

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
        console.log(data);
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

function editPlaylist(){
  var timeP = (getElementById('timePeriod').value);
  var popularity = (getElementById('popularity').value)/100;
  var wordiness = (getElementById('wordiness').value)/100;

  console.log("time period: " + timeP);
  console.log("popularity " + popularity);
  console.log("wordiness " + wordiness)



  return false; 
}