var isDrawerOpen = false;

function makeNewPlaylist() {
    console.log("changing screens");
    document.getElementById('home-intro-screen').setAttribute('class', 'unselected home-content');
    document.getElementById('home-new-playlist').setAttribute('class', 'selected home-content');
    closeDrawer();
    return false;
}

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
}

function closeDrawer() {
    document.getElementById('options-window').style.display = "none";	
}