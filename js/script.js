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

// save current playlist
function savePlaylist() {

    console.log(nameWeather);

    //store.set(Math.floor(Math.random()*100), "yo this is a thing");

    // store.forEach(function(key,val){
    //     console.log("The key (" + key + ") results in this val: " + val);
    // });

    store.clear();

}






