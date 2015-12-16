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
var curLocation = '';

var currentPlaylist = {}; 

/* VARIABLES FOR SCRIPT.JS */ 
var isFineTuneOpen = false;
var isAddAndRemoveOpen = false;
var scrollVertOffset = 0;

function setup() {
    document.getElementById('search').style.display = "none";
    if (isFineTuneOpen) {
        closeFineTune();
    }
    if (isAddAndRemoveOpen) {
        closeAddAndRemove();
    }
    findMe();
}
// Toggle "Fine Tune" drawer open and close
function toggleFineTune() {
    isFineTuneOpen = !isFineTuneOpen;
    console.log(isFineTuneOpen);
    if (isFineTuneOpen) {
        openFineTune();
        if (isAddAndRemoveOpen) {
            closeAddAndRemove();
        }
    } else {
        closeFineTune();
    }
}
// Toggle "Fine Tune" drawer open and close
function toggleAddAndRemove() {
    isAddAndRemoveOpen = !isAddAndRemoveOpen;
    console.log(isAddAndRemoveOpen);
    if (isAddAndRemoveOpen) {
        openAddAndRemove();
        if (isFineTuneOpen) {
            closeFineTune();
        }
    } else {
        closeAddAndRemove();
    }
}


function openFineTune() {
    isFineTuneOpen = true;
    document.getElementById('options-window').style.display = "block";
    document.getElementById('fine-tune-span').innerHTML = "&#9650 Fine tune my playlist";
}

function openAddAndRemove() {
    isAddAndRemoveOpen = true;
    document.getElementById('add-and-remove-window').style.display = "block";
    document.getElementById('add-and-remove-span').innerHTML = "&#9650 Add/Remove Songs";
    console.log("refreshing table");
    refreshAddRemoveTable();
}

function closeFineTune() {
    isFineTuneOpen = false;
    document.getElementById('options-window').style.display = "none";   
    document.getElementById('fine-tune-span').innerHTML = "&#9660 Fine tune my playlist";
}

function closeAddAndRemove() {
    isAddAndRemoveOpen = false;
    document.getElementById('add-and-remove-window').style.display = "none";
    document.getElementById('add-and-remove-span').innerHTML = "&#9660 Add/Remove Songs";
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
    checkIfNeedToSave();
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
    closeFineTune();
    closeAddAndRemove();

    displayPlaylist();
} 

// Switch Tab to Playlist
function switchToViewPlaylists() {
    checkIfNeedToSave();
    document.getElementById('t1').setAttribute('class', 'unselected tab');
    document.getElementById('t2').setAttribute('class', 'unselected tab');
    document.getElementById('t3').setAttribute('class', 'selected tab');


    // Set group display to selected
    document.getElementById('home').setAttribute('class', 'unselected body-content');
    document.getElementById('view-one').setAttribute('class', 'unselected body-content');
    document.getElementById('view-all').setAttribute('class', 'selected body-content');
    showAllPlaylists();
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

function checkIfNeedToSave() {
    //If current Playlist exists and is not saved, must decide what to do
    if (currentPlaylist['songs'] && currentPlaylist['isSaved'] == false) {
        //if it's a new playlist, ask user if they would like to save
        if (currentPlaylist['isNew']) {
            var name = prompt("Before you leave this page, would you like to save this playlist?\n" +
                "Press cancel to lose the playlist, or enter a name to save it", currentPlaylist['name']);
            if (name != null && name != '') {
                console.log("********");
                currentPlaylist['name'] = name;
                currentPlaylist['isNew'] = false;
                currentPlaylist['isSaved'] = true;
                checkPlaylistName();
                savePlaylist();
            } else { //if user pressed cancel
                currentPlaylist = {};
                nameTemp = '';
                nameWeather = '';
                curLocation = '';
            }
        } // if it's an existing playlist, automatically save it
        else {
            savePlaylist();
        }
    }
}

function checkPlaylistName() {
      // if it exists, append number to it
  if(store.get(currentPlaylist['name'])){
    var hasPlaylist = true;
    var i = 1;

    while(hasPlaylist){
      currentPlaylist['name'] += "-" + i;
      if(!store.get(currentPlaylist['name']))
        break;
      i++;
    }
  }
    document.getElementById('save-button-div').innerHTML 
      = '<button type="button" id="save-playlist-button" class="g-button disabled'
      + ' form-box" onclick="savePlaylist(); return false;">Saved</button>';
    document.getElementById('save-playlist-button').disabled = true;

    store.set(currentPlaylist['name'], currentPlaylist);
    refreshPlaylist();
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
  currentPlaylist['name'] = prompt("Enter a name for the playlists:", currentPlaylist['name']);
  currentPlaylist['isSaved'] = true;
  currentPlaylist['isNew'] = false;
  // if it exists, append number to it
  if(store.get(currentPlaylist['name'])){
    var hasPlaylist = true;
    var i = 1;

    while(hasPlaylist){
      currentPlaylist['name'] += "-" + i;
      if(!store.get(currentPlaylist['name']))
        break;
      i++;
    }
  }
    document.getElementById('save-button-div').innerHTML 
      = '<button type="button" id="save-playlist-button" class="g-button disabled'
      + ' form-box" onclick="savePlaylist(); return false;">Saved</button>';
    document.getElementById('save-playlist-button').disabled = true;

    store.set(currentPlaylist['name'], currentPlaylist);
    refreshPlaylist();
}

// save current playlist (update one)
function savePlaylist() {
  if (currentPlaylist['isNew']) {
    saveNewPlaylist();
  }
  currentPlaylist['isSaved'] = true;
  document.getElementById('save-button-div').innerHTML 
      = '<button type="button" id="save-playlist-button" class="g-button disabled'
      + ' form-box" onclick="savePlaylist(); return false;">Saved</button>';
  document.getElementById('save-playlist-button').disabled = true;

  store.set(currentPlaylist['name'], currentPlaylist);
  refreshPlaylist();
}

// rename chosen playlist
function renamePlaylist(name){
  var temp = store.get(name);
  var new_name = prompt("Please enter new playlist name.", temp['name']);
  if (!new_name) {
    //console error here
    console.log("NO NAME ENTERED");
  }
  else{
    temp['name'] = new_name;
    console.log(temp['name']);
  }

  store.set(temp['name'], temp);
  if (name != temp['name']) {
    store.remove(name);
  }
  showAllPlaylists();
}

// delete chosen playlist
function deletePlaylist(name) {
  var answer = confirm("Are you sure you want to delete this playlist, " + name + "?");
  if (answer) {
    store.remove(name);
  }
  showAllPlaylists();
}

// given the name of the Playlist, a new one is loaded
function choosePlaylist(name) {
  if(!store.get(name)){
    alert("oops, not a valid playlist");
    return;
  }
  currentPlaylist     = store.get(name);

  displayPlaylist();
  switchToCurrentPlaylist();
}

// delete all playlists
function deleteAllPlaylists() {
  // GIVE CONFIRMATION HERE!!
  confirm("Are you sure you want to delete all playlists?");
  confirm("REALLY REALLY sure?");
  store.clear();
}

// get all playlists
function showAllPlaylists(){
    console.log("**********");
    var viewAllHtml = '<h2> My Playlists </h2>';
    var playlistsHtml = '';
    store.forEach(function(key, val){
        playlistsHtml
          += '<div class=\"one-of-many-playlist-div\">'
          + '<a id=\'playlist-' + key 
          + '\' class=\"group-name\" href="#" onclick=\"switchToViewOneWrapper(this.id);return false;\"><span>' + key 
          + '</span></a>' 
          + '<a href="#" onclick="renamePlaylist(\'' + key + '\');"><small> rename </small></a>' 
          + '<a href="#" onclick="deletePlaylist(\'' + key + '\');"><small> delete </small></a>'
          + '</div>';
  });
    if (playlistsHtml.length == 0) {
        playlistsHtml += '<p> Oops. You do not have any saved playlists</p>';
    }
  document.getElementById('view-all').innerHTML = viewAllHtml += playlistsHtml;
}

function switchToViewOneWrapper(id) {
    id = id.replace('playlist-', '');
    currentPlaylist = {};
    store.forEach(function(key, val){
        if (key == id) {
            currentPlaylist = val;
        }
    });
    switchToCurrentPlaylist();
}

// taken from http://stackoverflow.com/questions/2970525/
function titlecase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function updatePlaylistTopBar() {
    console.log(glblIsReWeather);
    console.log(currentPlaylist['name']);
    console.log(nameTemp);
    console.log('');
    if (glblIsReWeather && currentPlaylist['name'] && currentPlaylist['name'].length > 0) {
        console.log("******");
         document.getElementById('playlist-name').innerHTML = currentPlaylist['name'].toUpperCase();
       if (!currentPlaylist['isSaved']) {
        document.getElementById('save-button-div').innerHTML = '<button type="button" id="save-playlist-button" class="g-button'
          + ' form-box" onclick="savePlaylist(); return false;">Save Playlist</button>';       
        } else {
            console.log("*********");
            document.getElementById('save-button-div').innerHTML = '<button type="button" id="save-playlist-button" class="g-button disabled'
            + ' form-box" onclick="savePlaylist(); return false;">Saved</button>';
            document.getElementById('save-playlist-button').disabled = true;
        }
        console.log("*********");
        document.getElementById('save-playlist-button').disabled = false;
        document.getElementById('drawers').style.display = "block";
        document.getElementById('playlist-results').innerHTML = '<p> ...Loading ...</p>'
    }
    else if ((!glblIsReWeather) && nameTemp.length > 0 && nameWeather.length > 0 && curLocation.length > 0) {
        document.getElementById('playlist-name').innerHTML = getPlaylistName().toUpperCase();
        if (!currentPlaylist['isSaved']) {
        document.getElementById('save-button-div').innerHTML = '<button type="button" id="save-playlist-button" class="g-button'
          + ' form-box" onclick="savePlaylist(); return false;">Save Playlist</button>';       
        } else {
            document.getElementById('save-button-div').innerHTML = '<button type="button" id="save-playlist-button" class="g-button disabled'
            + ' form-box" onclick="savePlaylist(); return false;">Saved</button>';
            document.getElementById('save-playlist-button').disabled = true;
        }

        document.getElementById('save-playlist-button').disabled = false;
        document.getElementById('drawers').style.display = "block";
        document.getElementById('playlist-results').innerHTML = '<p> ...Loading ...</p>'
    } else {
        document.getElementById('playlist-name').innerHTML = 'No playlist selected yet.';
        document.getElementById('playlist-results').innerHTML = "<p> Oops! No playlist selected. Select the \"My Playlists\" tab above to choose a playlist, or \"Home\" to make a new playlist.</p>";
        document.getElementById('drawers').style.display = "none";
    }
}

// Make playbutton with all songs in playlist
function displayPlaylist() {
    updatePlaylistTopBar();
    if (currentPlaylist['name']){
        $('#playlist-results').empty();
        var playerHtml  = '<iframe '
          + 'src="https://embed.spotify.com/?uri=spotify:trackset:';

        // adds songs to the player
        playerHtml  += currentPlaylist['playerString']
          + '" frameborder="0" width="640px" height="720"'
          + 'align="center" allowtransparency="true"></iframe>';

        $('#playlist-results').append(playerHtml);
    }
}

function displayNoPlaylistResultsError() {
    $('#playlist-results').empty();
    $('#playlist-results').append("<p id=\"error-message\"> Oops! No songs found matching your search parameters. Please try again. </p>");
}

function refreshAddRemoveTable() {
    var addSongsHtml = '<button type="button" id="open-search-button"'
      + 'class="g-button form-box" onclick="openSearchPopup();'
      + 'return false;">&#43Add a song</button>';
    var tableHtml = '';
    if (currentPlaylist['songs']) {
        console.log(currentPlaylist['songs']);
        tableHtml += '<table style=\"width:100%\">';
        for (var i = 0; i < currentPlaylist['songs'].length; i++) {
            tableHtml += '<tr><td>' + '<button type="button" id=\"delete-' + currentPlaylist['songs'][i]['songName'] + '\"' +
                ' class="g-button form-box" onclick="removeSong(this.id); return false;">&#8722</button></td>' +
                '<td><span class=\"table-song-name\">' + currentPlaylist['songs'][i]['songName'] + '</span><span class=\"table-artist-name\"> by ' + currentPlaylist['songs'][i]['artist'] + '</span></td></tr>';
        }
        tableHtml += '</table>';
    }
    if (tableHtml == '') {
        tableHtml = '<p><b>Oops!</b> There are no songs in this playlist </p>';
    }

    document.getElementById('add-and-remove-window').innerHTML = addSongsHtml + tableHtml;
}




