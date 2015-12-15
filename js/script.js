// STUFF TO REPLACE IN THE FUTURE
// // MAKE-ERROR-MSG! >> when ajax calls fail

/* 
    Script.js
    by Anna Lawson, Anfal Boussayoud, Lauren Tom, Nina Sabado 

    Javascript built to deal with any HTML behavior, and contains API keys as global variables
*/

/* VARIABLES FOR SCRIPT.JS */ 
var isDrawerOpen = false;

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





