var username = window.localStorage.getItem('user');

var app = angular.module('guestLoginPage', []);

// add translations

app.controller('data', function($scope) {
	// add translations to scope
	$scope.guestPwInfo = 'The password the place you are at provides for you (its usually on the table somewhere)';
	$('#gpwInfo').click(function() {
		logInfo($scope.guestPwInfo);
	});
});


function guestLogin() {
	var gpw = $('#gpw').val();

	// validation
	if (!gpw) {
		$('#gpw').css('border', '1px solid red');
		logError('Invalid form');
	}
	else
		$('#gpw').css('border', '1px solid #252525');

	// make an AJAX call to API
	var url = `http://localhost:3535/guestLogin?username=${username}&gpw=${gpw}`;

	if (gpw)
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				if (data.status == "SUCCESS") {
					logSuccess('Access granted');
					addGuest();
					window.location.href = 'guestOrder.html';
				}
				else if (data.status == "WRONG") {
					logError('Wrong password');
				}
				else {
					logError('Something went wrong');
				}
			},
			error: function(err) {
				console.log(err);
			}

		});
}

function addGuest() {
	var url = `http://localhost:3535/addGuest?username=${username}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			console.log(data);
			window.localStorage.setItem('guest', data.name);
		},
		error: function(err) {
			console.log(err);
		}
	});
}