
// Switch Tab to Manage Groups
function switchToHome() {
    // Set group tab to selected
    document.getElementById('t1').setAttribute('class', 'selected tab');
    document.getElementById('t2').setAttribute('class', 'unselected tab');
    document.getElementById('t3').setAttribute('class', 'unselected tab');

    // Set group display to selected
    document.getElementById('home-new-playlist').setAttribute('class', 'selected body-content');
    document.getElementById('view-playlists').setAttribute('class', 'unselected body-content');
    document.getElementById('search').setAttribute('class', 'unselected body-content');
}

function switchToViewPlaylists() {
    document.getElementById('t1').setAttribute('class', 'unselected tab');
    document.getElementById('t2').setAttribute('class', 'selected tab');
    document.getElementById('t3').setAttribute('class', 'unselected tab');


    // Set group display to selected
    document.getElementById('home-new-playlist').setAttribute('class', 'unselected body-content');
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
    document.getElementById('home-new-playlist').setAttribute('class', 'unselected body-content');
    document.getElementById('view-playlists').setAttribute('class', 'unselected body-content');
    document.getElementById('search').setAttribute('class', 'selected body-content');
}