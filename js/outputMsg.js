

function logError(text) {
	$('.error-message').text(text);
	$('.error-message').css('visibility', 'visible');
	$('.error-message').css('opacity', '1');
	setTimeout(function() {
		$('.error-message').css('visibility', '0');
		setTimeout(function() {
			$('.error-message').css('visibility', 'hidden');
		}, 200);
	}, 1000);
}



function logSuccess(text) {
	$('.success-message').text(text);
	$('.success-message').css('visibility', 'visible');
	$('.success-message').css('opacity', '1');
	setTimeout(function() {
		$('.success-message').css('visibility', '0');
		setTimeout(function() {
			$('.success-message').css('visibility', 'hidden');
		}, 200);
	}, 1000);
}


function logInfo(text) {
	$('.info-message div').text(text);
	$('.info-message').css('visibility', 'visible');
	$('.info-message').css('opacity', '1');
}

function closeInfo() {
	$('.info-message').css('opacity', '0');
	setTimeout(function() {
		$('.info-message').css('visibility', 'hidden');
	}, 200);
}
