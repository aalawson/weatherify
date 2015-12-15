// STUFF TO REPLACE IN THE FUTURE
// // MAKE-ERROR-MSG! >> when ajax calls fail

/* 
    Script.js
    by Anna Lawson, Anfal Boussayoud, Lauren Tom, Nina Sabado 

    Javascript built to deal with any HTML behavior, and contains API keys as global variables
*/

/* VARIABLES FOR ENTIRE PROGRAM, SAVING OF PROGRAM */
var nameWeather = '';
var nameTemp    = '';

var currentPlaylist = {};       //keeps in memory current playlist

/* VARIABLES FOR SCRIPT.JS */ 
var isDrawerOpen = false;
var scrollVertOffset = 0;

function setup() {
    document.getElementById('search').style.display = "none";
    findMe();
}
// Toggle "Fine Tune" drawer open and close
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

// Change to location playlist
function changeToLocationPlayList() {
  document.getElementById('loc-playlist').setAttribute('class', 'selected type-form');
  document.getElementById('mood-playlist').setAttribute('class', 'unselected type-form');   
}

// Change to mood playlist
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
    document.getElementById('view-one').setAttribute('class', 'unselected body-content');
    document.getElementById('view-all').setAttribute('class', 'unselected body-content');
}

function switchToCurrentPlaylist() {
        // Set group tab to selected
    document.getElementById('t1').setAttribute('class', 'unselected tab');
    document.getElementById('t2').setAttribute('class', 'selected tab');
    document.getElementById('t3').setAttribute('class', 'unselected tab');

    // Set group display to selected
    document.getElementById('home').setAttribute('class', 'unselected body-content');
    document.getElementById('view-one').setAttribute('class', 'selected body-content');
    document.getElementById('view-all').setAttribute('class', 'unselected body-content');
}

function switchToViewPlaylists() {
    document.getElementById('t1').setAttribute('class', 'unselected tab');
    document.getElementById('t2').setAttribute('class', 'unselected tab');
    document.getElementById('t3').setAttribute('class', 'selected tab');


    // Set group display to selected
    document.getElementById('home').setAttribute('class', 'unselected body-content');
    document.getElementById('view-one').setAttribute('class', 'unselected body-content');
    document.getElementById('view-all').setAttribute('class', 'selected body-content');
}

// Switch Tab to Search
function switchToSearch() {
    // Set group tab to selected
    document.getElementById('t1').setAttribute('class', 'unselected tab');
    document.getElementById('t2').setAttribute('class', 'unselected tab');
    document.getElementById('t3').setAttribute('class', 'unselected tab');

    // Set group display to selected
    document.getElementById('home').setAttribute('class', 'unselected body-content');
    document.getElementById('view-one').setAttribute('class', 'unselected body-content');
    document.getElementById('view-all').setAttribute('class', 'unselected body-content');
}

function openSearchPopup() {
    document.getElementById('search').style.display = "block";
    document.getElementById('search').style.backgroundColor = "white";
    setPopupDisplay();
}

function closeSearchPopup() {
    document.getElementById('search').style.display = "none";
    hidePopupDisplay();
}
// Helper for opening popups. Sets background transparent 'greyed out' mode
// and hides other tabs by setting them to display none.
function setPopupDisplay() {
  // Store scroll offset
  scrollVertOffset = window.pageYOffset;
  if (!scrollVertOffset) {
    scrollVertOffset = document.documentElement.scrollTop;
    if (! scrollVertOffset) {
      scrollVertOffset = 0;
    }
  }
  window.scrollTo(0, 100);

  // Change displays
  document.body.style.backgroundColor = 'rgba(0, 0, 0, .75)';
  document.getElementById('top-bar-hr').style.display = 'none';
  document.getElementById('nav-bar').style.display = 'none';

  // Hide previous content underneath popup window.
  if (document.getElementById('t1').getAttribute('class') == 'selected tab') {
    document.getElementById('home').setAttribute('class', 'unselected body-content');     
  } else if (document.getElementById('t2').getAttribute('class') == 'selected tab') {
    document.getElementById('view-one').setAttribute('class', 'unselected body-content');
  } else {
    document.getElementById('view-all').setAttribute('class', 'unselected body-content');    
  }
}

// Helper for removing popups. Restores background to white and resets display of
// selected tab.
function hidePopupDisplay() {
  document.body.style.backgroundColor = 'white';

  // Restore previous content underneath popup window.
  if (document.getElementById('t1').getAttribute('class') == 'selected tab') {
    document.getElementById('home').setAttribute('class', 'selected body-content');     
  } else if (document.getElementById('t2').getAttribute('class') == 'selected tab') {
    document.getElementById('view-one').setAttribute('class', 'selected body-content');
  } else {
    document.getElementById('view-all').setAttribute('class', 'selected body-content');
  }
  
  // Restore navigation bar & scroll
  document.getElementById('top-bar-hr').style.display = 'block';
  document.getElementById('nav-bar').style.display = 'inline-block';
  window.scrollBy(0, scrollVertOffset);
}

// save current playlist (make new one)
function saveNewPlaylist() {
  
  // if it exists, append number to it
  if(store.get(currentPlaylistName)){
    var hasPlaylist = true;
    var i = 1;

    while(hasPlaylist){
      currentPlaylistName += "-" + i;
      if(!store.get(currentPlaylistName))
        break;
      i++;
    }
  }

  savePlaylist();
}

// save current playlist (update one)
function savePlaylist() {
  store.set(currentPlaylistName, currentPlaylist);
}

// delete current playlist
function deletePlaylist() {
  store.remove(currentPlaylistName);
}

// given the name of the Playlist, a new one is loaded
function choosePlaylist(name) {
  if(!store.get(name)){
    // ERROR MESSAGE HERE
    return;
  }
  
  currentPlaylistName = name;
  currentPlaylist     = store.get(name);

  displayPlaylist();
}

// delete all playlists
function deleteAllPlaylists() {
  // GIVE CONFIRMATION HERE!!
  confirm("Are you sure you want to delete all playlists?");
  confirm("Sure?");
  confirm("REALLY REALLY sure?");
  store.clear();
}

// get all playlists
function getAllPlaylists(){
  store.forEach(function(key, val){
    // key gives the name of the playlist
    // val gives the array
  });
}

// taken from http://stackoverflow.com/questions/2970525/
function titlecase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Make playbutton with all songs in playlist
function displayPlaylist() {

    $('#playlist-results').empty();

    var playerHtml  = '<br/><h3>' + currentPlaylistName.toUpperCase()
      + '</h3 align="center"><br/><br/><iframe '
      + 'src="https://embed.spotify.com/?uri=spotify:trackset:';

    // adds songs to the player
    playerHtml  += currentPlaylist['playerString']
      + '" frameborder="0" width="640px" height="700"'
      + 'align="center" allowtransparency="true"></iframe>'

      + '<button type="button" id="save-playlist-button" class="g-button'
      + ' form-box" onclick="savePlaylist(); return false;">Save Playlist</button>'

      + '<button type="button" id="open-search-button"'
      + 'class="g-button form-box" onclick="openSearchPopup();'
      + 'return false;">&#43Add a song</button>';

    $('#playlist-results').append(playerHtml);
}

function showPlaylist() {
    //for saved playlists, location and/or weather and playlist should be saved
}




