var username = window.localStorage.getItem('user');
var guest = window.localStorage.getItem('guest');

var app = angular.module('guestFoodPage', []);

// add translations

app.controller('data', function($scope) {
	// add translations to scope
});

// initializes all the scripts on start
init();

function init() {
	var guest = window.localStorage.getItem('guest');
	var title = guest.split('-');
	title[0] = title[0].split('')
		.map(function(c, i) {
			if (i == 0)
				return c.toUpperCase();
			return c;
		}).join('');
	title = title.join(' ');
	$('.header').text(title);
	loadGuestOrder(guest, 'order');
}

function loadGuestOrder(guest, target) {
	$('.totalCost').text(`TOTAL: $0`);
	var url = `http://localhost:3535/getGuestOrder?username=${username}&name=${guest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			console.log(data);
			$('.' + target).html('');
			if (!data.length) {
				$('.orderList').html(`<div class="foodItem">
                    <h4 class="title" style="text-align: center;">Currently Empty</h4>
                </div>`)
			}
			else if (data.length > 0){
				data.forEach(function(food) {
					var html = `<div class="foodItem">
                    <h4 class="title">${food.title}</h4>
                    <p class="desc">${food.about}</p>
                    <p class="price">$${food.price}</p>
                </div>`;
                	var curr = $('.totalCost').text().split('$')[1];
                	curr = Number(curr) +  Number(food.price);
                	$('.totalCost').text(`TOTAL: $${curr}`);
                	$('.' + target).append(html);
				});
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function getBill() {
	var url = `http://localhost:3535/getGuestState?username=${username}&guest=${guest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			if (data == 'ORDERED') {
				logError('You didnt get food yet');
			}
			else {
				logSuccess('Bill requested, please be patient.');
				window.location.href = 'guestPaid.html';
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}