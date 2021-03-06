// variables
var CLIENT_ID = 'QGAQKTTZ2RIZAPVINPVPYZUQC0NIQG03QBTVRQ2GBCFKG021';
var CLIENT_SECRET = '42TRJYPM4LYMOZLVM3CCIA23AJWQK25FAG0DE45XUUP3A2D3';
var emptyNameTag = true;
var pos;

$( document ).ready(() => {
  setActive();
  $('.ui.orange.button').on('click', () => {
    APIcall();
  })
});

// menu
function setActive() {
  $('.ui.secondary.pointing.menu a').on('mouseenter', () => {
    $(this).closest('a').addClass('active item');
  });
  $('.ui.secondary.pointing.menu a').on('mouseleave', () => {
    $(this).closest('a').removeClass('active');
  });
}

function APIcall() {
  var end = `${pos.lat.toFixed(2)},${pos.lng.toFixed(2)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20170401&radius=1000&section=food&openNow=1`;
  var url = `https://api.foursquare.com/v2/venues/explore?limit=50&ll=${end}`;
  $.ajax({
    url: url,
    type: 'GET',
    dataType:'json',
    error: (request,error) => {
      console.log(error);
    },
    success: (data) => {
      var randomNumber = Math.floor(Math.random() * 10);
      console.log(randomNumber);
      var randomVenue = data.response.groups[0].items[randomNumber].venue.id;
      APIcallVenue(randomVenue);
    }
  });
}

function APIcallVenue(venue) {
  var end = `${pos.lat.toFixed(2)},${pos.lng.toFixed(2)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20170401&radius=1000&section=food&openNow=1`;
  var url = `https://api.foursquare.com/v2/venues/${venue}?limit=50&ll=${end}`;
  $.ajax({
    url: url,
    type: 'GET',
    dataType:'json',
    error: (request,error) => {
      console.log(error);
    },
    success: (data) => {
      var lat = data.response.venue.location.lat;
      var lng = data.response.venue.location.lng;
      var nameOfVenue = data.response.venue.name;
      renderVenue(data.response.venue);
      placeMarker(lat, lng, nameOfVenue);
    }
  });

}

//google geolocation
var map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.397, lng: -70.644},
    zoom: 13
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
      infoWindow.setContent('You are here!');
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

function placeMarker(lat, lng, nameOfVenue) {
  var myLatLng = {lat: lat, lng: lng};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: nameOfVenue
  });
}






// rendering a venue
function renderVenue(obj) {
  console.log(obj.tips.groups[0].items[0].text);
  var icon, star;
  if (obj.price.tier === '1') {
    icon = '<i class="dollar icon"></i>';
  } else if (obj.price.tier === '2') {
    icon = '<i class="dollar icon"></i><i class="dollar icon"></i>';
  } else if (obj.price.tier === '3' || obj.price.tier === '4') {
    icon = '<i class="dollar icon"></i><i class="dollar icon"></i><i class="dollar icon"></i>';
  }
  if (obj.rating > 0 && obj.rating <= 4) {
    star = '<i class="thumbs outline up icon"></i>';
  } else if (obj.rating > 4 && obj.rating <= 7) {
    star = '<i class="thumbs outline up icon"></i><i class="thumbs outline up icon"></i>';
  } else if (obj.rating > 7 && obj.rating <= 10) {
    star = '<i class="thumbs outline up icon"></i><i class="thumbs outline up icon"></i><i class="thumbs outline up icon"></i>';
  }
  if (emptyNameTag === true) {
    $('.venue').append(`
      <div class="info">
        <div class="headline"><spin id="peoplesay">People say:</spin> ${obj.tips.groups[0].items[0].text}</div><br>
        <div class="nameplace">${obj.name}</div><br>
        <div class="aboutplace">${obj.categories[0].name}</div><br>
        <div class="aboutplace">Price: ${obj.price.message}</div>
        <div class="aboutplace">${star} ${obj.rating}</div>
      </div>
    `);
    emptyNameTag = false;
    $('.loader').remove();
  } else {
    $('.info').remove();
    $('.venue').append(`
      <div class="info">
        <div class="headline"><spin id="peoplesay">People say:</spin> ${obj.tips.groups[0].items[0].text}</div><br>
        <div class="nameplace">${obj.name}</div><br>
        <div class="aboutplace">${obj.categories[0].name}</div><br>
        <div class="aboutplace">Price: ${obj.price.message}</div>
        <div class="aboutplace">${star} ${obj.rating}</div>
      </div>
    `);
  }
}

function checkingErrorPos() {
  if (pos === undefined) {
    $('.error').css('display', 'table');
  }
}

setTimeout(APIcall, 4000);
setTimeout(checkingErrorPos, 6000);
