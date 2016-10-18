

var app = angular.module('serviceLoginPage', []);

lang = {
	us: {
		login: 'Login',
		register: 'Register',
		email: 'Email',
		user: 'Username',
		pw: 'Password',
		emailPhold: 'Your email',
		userPhold: 'Your username',
		pwPhold: 'Your password',
		notPublic: 'not public',
		invalidForm: 'Invalid form',
		wrongUorPw: 'Wrong username or password',
		loggingIn: 'Logging in..',
		accExists: 'Account already exits',
		accCreated: 'Account successfuly created'
	},
	de: {
		login: 'Anmeldung',
		register: 'Registrieren',
		email: 'Email',
		user: 'Benutzername',
		pw: 'Passwort',
		emailPhold: 'Deine email',
		userPhold: 'Dein Benutzername',
		pwPhold: 'Ihr Passwort',
		notPublic: 'nicht öffentlich',
		invalidForm: 'Ungultiges Formular',
		wrongUorPw: 'Benutzername oder Passwort falsch',
		loggingIn: 'Einloggen..',
		accExists: 'Konto existiert bereits',
		accCreated: 'Konto erfolgreich erstellt'
	},
	rs: {
		login: 'Uloguj se',
		register: 'Registruj se',
		email: 'Email',
		user: 'Korisnicko Ime',
		pw: 'Lozinka',
		emailPhold: 'Vasa email adresa',
		userPhold: 'Vase korisnicko ime',
		pwPhold: 'Vasa lozinka',
		notPublic: 'nije javno',
		invalidForm: 'Nepravilna forma',
		wrongUorPw: 'Pogresno korisnicko ime ili lozinka',
		loggingIn: 'Logovanje..',
		accExists: 'Nalog vec postoji',
		accCreated: 'Nalog uspesno napravljen'
	}
}

var local_lang = window.localStorage.getItem('local_lang')
console.log(local_lang);
if (local_lang == undefined || local_lang == null || local_lang.trim() == '')
	local_lang = 'us';
var local = lang[local_lang]; 

app.controller('data', function($scope) {
	$scope.login = local.login;
	$scope.register = local.register;
	$scope.email = local.email;
	$scope.user = local.user;
	$scope.pw = local.pw;
	$scope.emailPhold = local.emailPhold;
	$scope.userPhold = local.userPhold;
	$scope.pwPhold = local.pwPhold;
	$scope.notPublic = local.notPublic;
	$scope.invalidForm = local.invalidForm;
	$scope.wrongUorPw = local.wrongUorPw;
	$scope.loggingIn = local.loggingIn;
	$scope.accExists = local.accExists;
	$scope.accCreated = local.accCreated;

});