
function setLang(lang) {
	var storage = window.localStorage;
	storage.setItem('local_lang', lang);
	console.log(storage.getItem('local_lang'));
}