
var app = angular.module('whoArePage', []);

lang = {
	us: {
		title: 'Are you',
		option1: 'GUEST',
		wordOr: 'OR',
		option2: 'SERVICE'
	},
	de: {
		title: 'Bist Du',
		option1: 'GAST',
		wordOr: 'ODER',
		option2: 'DIENERSCHAFT'
	},
	rs: {
		title: 'Da li si',
		option1: 'GOST',
		wordOr: 'ILI',
		option2: 'POSLUGA'
	}
}

var local_lang = window.localStorage.getItem('local_lang')
console.log(local_lang);
var local = lang[local_lang]; 

app.controller('form', function($scope) {
	$scope.title = local.title;
	$scope.option1 = local.option1;
	$scope.wordOr = local.wordOr;
	$scope.option2 = local.option2;

});

