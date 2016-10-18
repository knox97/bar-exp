var username = window.localStorage.getItem('user');
var guest = window.localStorage.getItem('guest');
var rating = null;

var app = angular.module('guestPaidPage', []);

// add translations

app.controller('data', function($scope) {
	// add translations to scope
});

function rate(stars) {
	rating = stars;

	switch (rating) {
		case '1':
			$('#1').css('color', '#EE0');
			$('#2').css('color', '#555');
			$('#3').css('color', '#555');
			$('#4').css('color', '#555');
			$('#5').css('color', '#555');
			break;
		case '2':
			$('#1').css('color', '#EE0');
			$('#2').css('color', '#EE0');
			$('#3').css('color', '#555');
			$('#4').css('color', '#555');
			$('#5').css('color', '#555');
			break;
		case '3':
			$('#1').css('color', '#EE0');
			$('#2').css('color', '#EE0');
			$('#3').css('color', '#EE0');
			$('#4').css('color', '#555');
			$('#5').css('color', '#555');
			break;
		case '4':
			$('#1').css('color', '#EE0');
			$('#2').css('color', '#EE0');
			$('#3').css('color', '#EE0');
			$('#4').css('color', '#EE0');
			$('#5').css('color', '#555');
			break;
		case '5':
			$('#1').css('color', '#EE0');
			$('#2').css('color', '#EE0');
			$('#3').css('color', '#EE0');
			$('#4').css('color', '#EE0');
			$('#5').css('color', '#EE0');
			break;
	}
}

function sendRate() {
	// dont forget to DELETE GUEST From guest_list and guest_ids
	if (rating !== null) {
		var url = `http://localhost:3535/submitRating?username=${username}&rate=${rating}`;

		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				if (data.status == 'SUCCESS') {
					logSuccess('Rating submited');
					removeGuest();
					window.location.href = 'findPlace.html';
				}
				else
					logError('Something went wrong');
			},
			error: function(err) {
				console.log(err);
			}
		});
	}
	else {
		logError('You didnt rate yet');
	}
}

function removeGuest() {
	var url = `http://localhost:3535/removeGuest?username=${username}&guest=${guest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			console.log(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}