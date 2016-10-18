// Script for verification and API calls for register/login

console.log('LOGIN SYSTEM v1.2 by KnoX97');

function login() {
	console.log('Login called');
	var user = $('#loginUser').val();
	var pw = $('#loginPw').val();

	var x = pw.replace(/[A-Z\d]/gi, '').length;
	var y = user.replace(/[A-Z\d]/gi, '').length;

	var invalid = false;

	if (!x && pw.length) {
		// Valid
		$('#loginPw').css('border', '1px solid #252525');
		$('#loginPw2').css('border', '1px solid #252525');
	}
		
	else {
		// Invalid
		$('#loginPw').css('border', '1px solid red');
		$('#loginPw2').css('border', '1px solid red');
		invalid = true;
	}

	if (!y && user.length)
		// Valid
		$('#loginUser').css('border', '1px solid #252525');
	else {
		// Invalid
		$('#loginUser').css('border', '1px solid red');
		invalid = true;
	}

	console.log(invalid);

	if (invalid)
		logError(local.invalidForm);

	if (!invalid) {
		var url = `http://localhost:3535/login?user=${user}&pw=${pw}`;
		console.log(url, 'test');
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				console.log(data);
				if (data.return == 'WRONG')
					logError(local.wrongUorPw);
				if (data.return == 'LOGGED') {
					logSuccess(local.loggingIn);
					window.localStorage.setItem('user', user);
					window.location.href = 'serviceHome.html';
				}
			},
			error: function(error) {
				console.log(error)
			}

		});
	}
	console.log('Login executed');
}

function register() {
	console.log('Register called');
	var email = $('#registerEmail').val();
	var user = $('#registerUser').val();
	var pw = $('#registerPw').val();
	var pw2 = $('#registerPw2').val();
	console.log(email, user, pw, pw2);

	var x = pw.replace(/[A-Z\d]/gi, '').length;
	var y = user.replace(/[A-Z\d]/gi, '').length;
	var z = email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi);

	var invalid = false;

	if (!x && pw.length && pw === pw2) {
		// Valid
		$('#registerPw').css('border', '1px solid #252525');
		$('#registerPw2').css('border', '1px solid #252525');
	}
		
	else {
		// Invalid
		$('#registerPw').css('border', '1px solid red');
		$('#registerPw2').css('border', '1px solid red');
		invalid = true;
	}

	if (!y && user.length)
		// Valid
		$('#registerUser').css('border', '1px solid #252525');
	else {
		// Invalid
		$('#registerUser').css('border', '1px solid red');
		invalid = true;
	}
		
	if (z !== null)
		// Valid
		$('#registerEmail').css('border', '1px solid #252525');
	else {
		// Invalid
		$('#registerEmail').css('border', '1px solid red');
		invalid = true;
	}
	console.log(invalid)

	if (invalid)
		logError(local.invalidForm);

	if (!invalid) {
		var url = `http://localhost:3535/register?email=${email}&user=${user}&pw=${pw}`;

		$.ajax({
			type: "GET",
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				console.log(data);
				if (data.return == 'EXIST')
					logSuccess(local.accExists);
				if (data.return == 'CREATED' || data.return.trim() == '') {
					logSuccess(local.accCreated);
					window.localStorage.setItem('user', user);
					setTimeout(function() {window.location.href = 'initInfo.html';}, 10);
				}
			},
			error: function(err) {
				console.log(err);
			}
		});
	}

	console.log('Register executed');
}