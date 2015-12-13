var isDrawerOpen = false;


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
