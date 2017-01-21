$(document).ready(function() {
	if (document.location.protocol == "http:") {
		$('#welcome').html('Please use a <a href="https://mattgaskey.github.io/weather" target="_blank" class="secure">secure connection</a> to access the weather.');
	} else if (document.location.protocol == "https:") {
		weather();
	}


$('#unit-shift').on('click', function(e) {
	e.preventDefault();
	var units = $('#temp').html();
	var reg = /[0-9]|\-/g;
	var tempToChange = (units.match(reg)).join('');
	var FtoC = Math.round((tempToChange-32)*5/9);
	var CtoF = Math.round((tempToChange*9/5)+32);
	
	if (units.endsWith('F')) {
		$('#temp').html(FtoC + '&deg; C');
	} else if (units.endsWith('C')) {
		$('#temp').html(CtoF + '&deg; F');
	}
});//change units

function weather() {
	//set lat and lon
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			//call the dark sky API
			$.ajax ({
				url: 'https://api.darksky.net/forecast/172d27f028a3a6160fba28d9b4150805/' + lat + ',' + lon + '?exclude=minutely,hourly,daily,alerts,flags',
				dataType: 'jsonp',
				success: function(currentWeather) {
						var conditions = currentWeather.currently.summary;
						var icon = currentWeather.currently.icon;
						var temp = Math.round(currentWeather.currently.temperature);
						var tempC = Math.round((temp-32)*5/9);
					
						$('#conditions').html(conditions);
						$('#temp').html(temp + '&deg; F');
					
						switch(icon) {
							case "clear-day":
							case "clear-night":
								$('.icon').append('<div class="sun"><div class="rays"></div></div>');
								break;
							case "cloudy":
							case "fog":
								$('.icon').append('<div class="cloud"></div><div class="cloud"></div>');
								break;
							case "rain":
							case "sleet":
								$('.icon').append('<div class="cloud"></div><div class="rain"></div>');
								break;
							case "partly-cloudy-day":
							case "partly-cloudy-night":
								$('.icon').append('<div class="cloud"></div><div class="sun"><div class="rays"></div></div>');
								break;
							case "snow":
								$('.icon').append('<div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div>');
								break;
							default:
								$('.icon').append('<div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div>');
						}
						
				} //success
			}); //dark sky API
			//reverse geo lookup API
			$.ajax ({
				url: 'https://maps.googleapis.com/maps/api/geocode/json?sensor=false&result_type=political&latlng=' + lat + ',' + lon + '&key=AIzaSyB8Fl-tGTLdXXVnamStRJwD1ZDaOsx8IKI',
				dataType: 'json',
				success: function(location) {
						var city = location.results[0].formatted_address;
						$('#city').html(city);
				} //success
			}) //reverse geo lookup API
		}); //getCurrentPosition
	} //geolocation
} //weather
}); //document.ready