var username = window.localStorage.getItem('user');

var app = angular.module('setInfoPage', []);

// add language support here

app.controller('data', function($scope) {
	// set language variables
	$scope.companyNameInfo = 'Name of your company';
	$scope.aboutCompanyInfo = 'Write about your company';
	$('#companyNameInfo').click(function() {
		logInfo($scope.companyNameInfo);
	});
	$('#aboutCompanyInfo').click(function() {
		logInfo($scope.aboutCompanyInfo);
	});
});

loadCurrentInfo();

//////////////////////////////////////////////////////////////
// LOAD CURRENT INFO (loads current info about company)
//////////////////////////////////////////////////////////////
function loadCurrentInfo() {
	var url = `http://localhost:3535/getInfo?username=${username}`;
	console.log(url, 'ttt');
	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			console.log(data);
			$('#companyName').val(data.data.name);
			$('#companyAbout').val(data.data.about);
		},
		error: function(err) {
			console.log(err);
		}
	});
}


//////////////////////////////////////////////////////////////
// checks if fields are valid and saves data
//////////////////////////////////////////////////////////////
function validate() {
	var name = $('#companyName').val();
	var about = $('#companyAbout').val();
	var x = name.replace(/[A-Z\d\s\&\,\.]/gi, '');
	var y = about.replace(/[A-Z\d\s\,\.\&]/gi, '');
	var isInvalid = false;

	if (!x && name.length) {
		$('#companyName').css('border', '1px solid #252525');
	}
	else {
		$('#companyName').css('border', '1px solid red');
		isInvalid = true;
	}

	if (!y && about.length) {
		$('#companyAbout').css('border', '1px solid #252525');
	}
	else {
		$('#companyAbout').css('border', '1px solid red');
		isInvalid = true;
	}

	if (isInvalid)
		logError('Invalid form');

	if (!isInvalid && username != null) {
		// ajax call to database
		var url = `http://localhost:3535/setInfo?name=${name}&about=${about}&photo=test.jpg&username=${username}`;

		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				console.log(data);
				if (data.status == "SUCCESS")
					logSuccess('Info updated');
				else
					logError('Something went wrong');
			},
			error: function(err) {
				console.error(err);
			}
		});

	}

}

