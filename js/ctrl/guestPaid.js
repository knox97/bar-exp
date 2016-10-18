var username = window.localStorage.getItem('user');
var guest = window.localStorage.getItem('guest');

var app = angular.module('guestPaidPage', []);

// add translations

app.controller('data', function($scope) {
	// add translations to scope
});

// initializes all the scripts on start
init();

function init() {
	var guest = window.localStorage.getItem('guest');
	var title = guest.split('-');
	title[0] = title[0].split('')
		.map(function(c, i) {
			if (i == 0)
				return c.toUpperCase();
			return c;
		}).join('');
	title = title.join(' ');
	$('.header').text(title);
}

function confirmPayment() {
	var url = `http://localhost:3535/getGuestState?username=${username}&guest=${guest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			if (data == 'SERVED') {
				logError('You didnt pay yet');
			}
			else {
				logSuccess('Bill paid, thank you for visitng us');
				window.location.href = 'guestRate.html';
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}