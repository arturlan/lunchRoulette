// variables
var CLIENT_ID = 'QGAQKTTZ2RIZAPVINPVPYZUQC0NIQG03QBTVRQ2GBCFKG021';
var CLIENT_SECRET = '42TRJYPM4LYMOZLVM3CCIA23AJWQK25FAG0DE45XUUP3A2D3';

$( document ).ready(() => {
  setActive();
  $('.ui.orange.button').on('click', () => {
    APIcall();
  })
});

function setActive() {
  $('.ui.secondary.pointing.menu a').on('mouseenter', () => {
    $(this).closest('a').addClass('active item');
  });
  $('.ui.secondary.pointing.menu a').on('mouseleave', () => {
    $(this).closest('a').removeClass('active');
  });
}

function APIcall() {
  var end = `${pos.lat.toFixed(2)},${pos.lng.toFixed(2)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20170401&radius=500&section=food&openNow=1`;
  var url = `https://api.foursquare.com/v2/venues/explore?limit=50&ll=${end}`;
  $.ajax({
    url: url,
    type: 'GET',
    dataType:'json',
    error: (request,error) => {
      console.log(error);
    },
    success: (data) => {
        var randomVenue = Math.floor(Math.random() * 50);
        var lat = data.response.groups[0].items[randomVenue].venue.location.lat;
        var lng = data.response.groups[0].items[randomVenue].venue.location.lng;
        renderVenue(data.response.groups[0].items[randomVenue].venue)
        placeMarker(lat, lng);
    }
  });
}

//google geolocation
var map, infoWindow, pos;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 12
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function renderVenue(obj) {
  $('.venue').append(`<h1 class="name">${obj.name}</h1>`);
}

function placeMarker(lat, lng) {
  var myLatLng = {lat: lat, lng: lng};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });

}
