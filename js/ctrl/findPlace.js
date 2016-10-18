var app = angular.module('findPlacePage', []);

// This is template for language translation based on picked language
lang = {
	us: {
		title: 'Find Place',
		inputTxt: 'Search your favorite place'
	},
	de: {
		title: 'Finden Platz',
		inputTxt: 'Suchen Sie Ihre Lieblingsplatz'
	},
	rs: {
		title: 'Pronadji Mesto',
		inputTxt: 'Pronadji svoje omiljeno mesto'
	}
}

var local_lang = window.localStorage.getItem('local_lang')
console.log(local_lang);
var local = lang[local_lang]; 
// End of template, copy this template to each app

app.controller('places', function($scope) {
	$scope.places = [
		{name: 'Apple', src: 'img/places/apple.jpg'},
		{name: 'Bing', src: 'img/places/bind.jpg'},
		{name: 'MLB', src: 'img/places/mlb.jpg'},
		{name: 'iHope', src: 'img/places/ihope.png'},
	];
	
	$scope.title = local.title;
	$scope.inputPlaceholder = local.inputTxt;
});

function getUsers() {
	var url = `http://localhost:3535/getUsers`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			console.log(data);
			data.forEach(function(user) {
				var info = user.settings.info;
				var html = `<div class="user" id="${user.username}" onclick="accessPlace(this.id);">
					<h3 class="header">${info.name}</h3>
					<p><b>About:</b> ${info.about}</p>
					<p><b>Currency:</b> ${user.settings.currency.toUpperCase()}</p>
					<p><b>Rating:</b> ${user.rating}</p>
				</div>
				`;
				$('.users').append(html);
			});
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function accessPlace(id) {
	window.localStorage.setItem('user', id);
	window.location.href = 'whoAre.html';
}