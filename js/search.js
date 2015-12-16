var searchQuery = "";
var offset = 0; //index of the first song displayed in the current set of 10 displayed
var total = 0;
var mostRecentSearchResults = {};

$("#search-form").keypress(function(e) {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if (keycode == '13') {
    e.preventDefault();
    searchSpotify();
  }
});

// Searches spotify, updates trackData, and displays first 10 songs for user.
function searchSpotify() {
  // reset info about past searches
  offset = 0;
  total = 0;
  searchQuery = "";
  mostRecentSearchResults = {};

  // Get new info from form
	var artist = document.getElementById("artist").value;
  var song = document.getElementById("song").value;
	var album = document.getElementById("album").value;

	var params = {
        'artist': artist,
        'album' : album,
        'track' : song
	};

  // If no parameters were entered, let user know & stop.
  if(!artist && !song && !album) {
    displayNoParamsError();
  } // Otherwise, we can search for results!
  else {
    //Create query string using filters
	  searchQuery = "";
	  for (var key in params) {
		  if (params[key].length > 0) {
			  if (params[key].includes(' ')){
				  params[key] = "\"" + params[key] + "\""; //if multiple words, put in quotes
			  }
        searchQuery += key + ":" + params[key] + " ";
		  }
	  }
	  searchQuery = searchQuery.substring(0, searchQuery.length-1); //strip off last " "
	
    getResults();
  }
}

function getResults() {
  $.ajax ({
      'url': 'http://api.spotify.com/v1/search',
      'data': {'q':searchQuery, 'type': 'track', 'limit' : '10','offset': offset, 'market':'US'},
      'cache': true,
      success : function(data, textStats, XMLHttpRequest) {
        // Check to make sure at least one song was returned
        var isValid = data['tracks'] && data['tracks']['items'] && (
            data['tracks']['items'].length > 0);
        if (!isValid) {
          displayBadParamsError(); // let user know that no results were found
        } //Valid! Display first ten results
        else {
          total = data['tracks'].total;
          displayTen(data);
        }

      },
      error: function(jqXHR, textStatus, errorThrown) {
        displayBadParamsError();

      }
    });
}

function displayNoParamsError() {
  displayErrorMessage("<p id=\"error\"> Oops! You must enter" +
      " at least one of the following: artist, song, album.</p>");
}

function displayBadParamsError() {
  displayErrorMessage("<p id=\"error\"> No results matched your search parameters. </p>");
}

function displayErrorMessage(error) {
    var resultsHTML = "<h2 id=\"search-songs-results-header\">Results</h2>";
    resultsHTML += error;
    document.getElementById('search-songs-results-div').innerHTML = resultsHTML;
}

function displayNextTen() {
  window.scrollTo(0, 100);
  offset += 10;
  getResults();
}

function displayPrevTen() {
  window.scrollTo(0, 100);
  offset -= 10;
  getResults();
}

//Displays ten songs starting at index
function displayTen(trackData) {
       /*   if (results['response']['songs'][i]['tracks'][0]) {
            currentPlaylist['songs'].push( {
            'songName' : results['response']['songs'][i]['title'],
            'artist' : results['response']['songs'][i]['artist_name'],
            'artistId' : results['response']['songs'][i]['artist_foreign_ids'][0]['foreign_id'],
            'songId' : results['response']['songs'][i]['tracks'][0]['foreign_id'].replace('spotify:track:', ''),
         });  */
  
  //Add Spotify PlayButtons for ten songs, starting at startIndex of track list
  //If fewer than ten songs exist starting from startIndex, then display however
  //many are left. When index is out of range, just clears the results.
  var numberOfTracks = trackData['tracks']['items'].length;
  mostRecentSearchResults = trackData;
  var allPlayButtonsHTML = "<h2 id=\"results-header\">Results</h2><table>";
  for (var i = 0; i < 10 && i < total - offset; i++) {
    var uri = trackData['tracks']['items'][i].uri; 
    var name = trackData['tracks']['items'][i].name; 
    var artist = trackData['tracks']['items'][i]['artists'][0].name;

    var playButtonHTML =
        "<tr><td><button type=\"button\" id=\"add-" + i + '\"' +
                " class=\"g-button form-box\" onclick=\"addSong(this.id); return false;\">&#43</button>" +
                '</td><td><div id=\"frame-div-" + i +"\" class=\"frame-div\">' + 
          " <div id=\"popup-" + i + "\" class=\"popup\" style=\"display:block;\">\"" + name +
              "\"<br> " + artist +
          "</div>" +
          " <iframe src=\"https://embed.spotify.com/?uri=" + uri + "\" width=\"400\" height=\"80\"" +
            " frameborder=\"0\" allowtransparency=\"true\" title=\"" + name + "\"></iframe>" +
        " </div></td></tr>";
    allPlayButtonsHTML += playButtonHTML;
  }
  var resultsHTML = allPlayButtonsHTML + "</table> <div id=\'page-control\'>";
  document.getElementById('search-songs-results-div').innerHTML = resultsHTML;

  // Display next and prev page buttons when applicable
  var prevPage = offset > 0; //boolean: should there be a prev page button?
  var nextPage = (total - offset - 10) > 0; //same for next
  var pageControlHTML = "";
  if (prevPage) {
    pageControlHTML += "<div id=\"prev-div\"><input type=\"button\" class=\"page-control-button\"" + 
        "value=\"&larr; Previous Page\"onclick=\"displayPrevTen();\"/></div>";
  }
  if (nextPage) {
     pageControlHTML += "<div id=\"next-div\"><input type=\"button\" class=\"page-control-button\"" + 
        "value=\"Next Page &rarr;\"onclick=\"displayNextTen();\"/></div>";
  }
  document.getElementById('page-control').innerHTML = pageControlHTML;
}

