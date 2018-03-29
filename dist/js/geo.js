window.onload = function() {
  var startPos;
  var geoOptions = {
     timeout: 10 * 1000,
	 //enableHighAccuracy: true,
	 maximumAge: 5 * 60 * 1000
  }

  var geoSuccess = function(position) {
   // startPos = position;
	localStorage.lat = position.coords.latitude;
	localStorage.lon = position.coords.longitude;
    /*document.getElementById('startLat').innerHTML = startPos.coords.latitude;
    document.getElementById('startLon').innerHTML = startPos.coords.longitude;*/
  };
  var geoError = function(error) {
    console.log('Error occurred. Error code: ' + error.code);
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
}