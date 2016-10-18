
var app = angular.module('setCurrPage', []);

app.controller('data', function($scope) {
	$scope.adminPwInfo = 'The password you will need to change the information about the company and menu, you should not give this password to your employees';
	$scope.currencyInfo = 'This is the currency that prices in your menu will use';
	$scope.guestPwInfo = 'This is the password that your customers will use to access the menu and call orders';
	$('#adminPwInfo').click(function() {
		logInfo($scope.adminPwInfo);
	});
	$('#guestPwInfo').click(function() {
		logInfo($scope.guestPwInfo);
	});
	$('#currencyInfo').click(function() {
		logInfo($scope.currencyInfo);
	});
});


//////////////////////////////////////////////////////////////
// Sets currency awp and gwp
//////////////////////////////////////////////////////////////
function setCurrData() {
	var apw = $('#adminPw').val();
	var gpw = $('#guestPw').val();
	var curr = $('#curr').val();
	var x = apw.replace(/[A-Z\d]/gi,'');
	var y = gpw.replace(/[A-Z\d]/gi,'');
	var isInvalid = false;
	var username = window.localStorage.getItem('user');

	// validation
	if (!x && apw.length > 0) {
		$('#adminPw').css('border', '1px solid #252525');
	}
	else {
		$('#adminPw').css('border', '1px solid red');
		isInvalid = true;
	}

	if (!y && gpw.length > 0) {
		$('#guestPw').css('border', '1px solid #252525');
	}
	else {
		$('#guestPw').css('border', '1px solid red');
		isInvalid = true;
	}

	if (isInvalid) {
		logError('Invalid form');
	}

	// if valid do AJAX call
	if (!isInvalid) {
		var url = `http://localhost:3535/setCurr?apw=${apw}&gpw=${gpw}&curr=${curr}&username=${username}`;

		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				console.log(data);
				if (data.status == "SUCCESS")
					logSuccess('Data saved');
				else
					logError('Something went wrong');
			},
			error: function(err) {
				console.log(err);
			}
		});
	}

}