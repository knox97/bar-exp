var username = window.localStorage.getItem('user');
var app = angular.module('guestOrderPage', []);

// add translations

app.controller('data', function($scope) {
	// add translations to scope
});

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

function confirmOrder() {
	var url = `http://localhost:3535/getGuestState?username=${username}&guest=${guest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			if (data == 'WAITING') {
				logError('Order not placed yet');
			}
			else {
				logSuccess('Order placed');
				window.location.href = 'guestFood.html';
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}
