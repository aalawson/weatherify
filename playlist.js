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

function getWeather(lat, lng) {
    $.ajax({
        'url': 'http://api.openweathermap.org/data/2.5/weather',
        'data': {
            'lat': lat,
            'lon': lng,
            'units': 'imperial',
            'appid': '670b2cbcd683c42c5e41a0ed424b537b'
        },
        'success': function(results) {
            console.log(results);
        }
    });
    return false;
}
