
var app = angular.module('langPage', []);

app.controller('lang', function($scope) {
	$scope.languages = [
		{name: 'English (US)', src: 'img/flags/us.png', lang: 'us'},
		{name: 'German', src: 'img/flags/de.png', lang: 'de'},
		{name: 'Serbian', src: 'img/flags/rs.png', lang: 'rs'}
	];
});