var username = window.localStorage.getItem('user');
var currentGuest = null;
var currWindow = null;
var totalCost = [];
var app = angular.module('serviceHomePage', []);

// add translations

app.controller('data', function($scope) {
	// add translations to scope
});

// Initialize the page
init();

function init() {
	loadMenu();
	loadGuests()
}

function loadMenu() {
	var url = `http://localhost:3535/getMenu?username=${username}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			console.log(data);
			$('.menu').html('');
			data.forEach(function(item) {
				var html = `<div class="foodItem" id="${item._id}" onclick="javascript: addToOrder(this.id);">
		            <h4 class="title">${item.title}</h4>
		            <p class="desc">${item.about}</p>
		            <p class="price">$${item.price}</p>
		        </div>`;
		        $('.menu').append(html);
			});
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function loadGuests() {
	var url = `http://localhost:3535/getGuests?username=${username}`;
	$('#order').html('');
	$('#food').html('');
	$('#paying').html('');

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {

			// tracks number of guests in each tab
			var guestsIn = {
				order: 0,
				food: 0,
				paying: 0
			};

			// adds guests to the tab according to their state
			data.forEach(function(guest) {
				var title = guest.name.split('-');
				title[0] = title[0].split('')
					.map(function(c, i) {
						if (i == 0)
							return c.toUpperCase();
						return c;
					}).join('');
				title = title.join(' ');

				if (guest.state == "WAITING") {
					var html = `<div class="guest" id="${guest.name}" onclick="javascript: showAddFoodGuest(this.id);">
                                <h4 class="title">${title}</h4>
                            </div>`;
                    $('#order').append(html);
                    guestsIn.order += 1;
				}
				if (guest.state == "ORDERED") {
					var html = `<div class="guest" id="${guest.name}" onclick="javascript: showGuestFood(this.id);">
                                <h4 class="title">${title}</h4>
                            </div>`;
					$('#food').append(html);
					guestsIn.food += 1;
				}
				if (guest.state == "SERVED") {
					var html = `<div class="guest" id="${guest.name}" onclick="javascript: showGuestBill(this.id);">
                        <h4 class="title">${title}</h4>
                    </div>`;
                    $('#paying').append(html);
                    guestsIn.paying += 1;
				}
			});

			// Checks if theres not guest in some of the tabs
			Object.keys(guestsIn).forEach(function(key) {
				if (guestsIn[key] == 0) {
					$('#' + key).html(`<div class="guest">
                                <h4 class="title" style="text-align: center;">Currently No Guests</h4>
                            </div>`);
				}
			});
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function loadGuestOrder(guest, target) {
	$('.totalCost').text(`TOTAL: $0`);
	var url = `http://localhost:3535/getGuestOrder?username=${username}&name=${guest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			$('.' + target).html('');
			if (!data.length) {
				$('.orderList').html(`<div class="foodItem">
                    <h4 class="title" style="text-align: center;">Currently Empty</h4>
                </div>`)
			}
			else if (data.length > 0){
				data.forEach(function(food) {
					var html = `<div class="foodItem">
					<div class="row nopad">
						<div class="col-xs-10 nopad">
							<h4 class="title">${food.title}</h4>
		                    <p class="desc">${food.about}</p>
		                    <p class="price">$${food.price}</p>
						</div>
						<div class="col-xs-2 nopad" style="text-align: center; font-size: 30px;">
							<span style="float: right;" id="${food._id}" class="glyphicon glyphicon-remove-circle" onclick="javascript: removeFromOrder(this.id);"></span>
						</div>
					</div>
                    
                </div>`;
                	var curr = $('.totalCost').text().split('$')[1];
                	curr = Number(curr) +  Number(food.price);
                	console.log(curr);
                	$('.totalCost').text(`TOTAL: $${curr}`);
                	$('.' + target).append(html);
                	totalCost.push(food.price);
				});
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
	//console.log(totalCost, 'order');
	//setTimeout(function() {displayTotal();}, 10);
}

function addToOrder(id) {
	var title = $('#' + id + ' .title').text();
	var about = $('#' + id + ' .desc').text();
	var price = $('#' + id + ' .price').text();
	price = price.substring(1, price.length);
	//console.log(id, title, about, price);

	var url = `http://localhost:3535/addGuestOrder?username=${username}&title=${title}&about=${about}&price=${price}&guest=${currentGuest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			//console.log(data, 'order');
			loadGuestOrder(currentGuest, currWindow);
		},
		error: function(err) {
			console.log(err);
		}
	});
}


function displayTotal() {
	var sum = 0;
	totalCost.pop();
	totalCost.forEach(function(price) {
		console.log(price, 'display');
		sum += Number(price);
	});
	$('.totalCost').text(`TOTAL: $${sum}`);
	console.log(totalCost, sum, 'total');
	totalCost = [];
}

function removeFromOrder(id) {
	var url = `http://localhost:3535/removeGuestOrder?username=${username}&id=${id}&guest=${currentGuest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			console.log(data);
			if (data.status == 'SUCCESS') {
				logSuccess('Item removed');
				console.log(currentGuest, currWindow);
				loadGuestOrder(currentGuest, currWindow);
			}
			else
				logError('Something went wrong');
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function placeOrder() {
	console.log(currentGuest);

	var url = `http://localhost:3535/placeOrder?username=${username}&guest=${currentGuest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			if (data.status == 'SUCCESS') {
				loadGuests();
				logSuccess('Order placed');
			}
			else {
				logError('Something went wrong');
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function guestServed() {
	var url = `http://localhost:3535/guestServed?username=${username}&guest=${currentGuest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			console.log(data);
			if (data.status == 'SUCCESS') {
				loadGuests();
				logSuccess('Guest is served');
			}
			else
				logError('Something went wrong');
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function guestPaid() {
	var url = `http://localhost:3535/guestPaid?username=${username}&guest=${currentGuest}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			if (data.status == 'SUCCESS') {
				loadGuests();
				logSuccess('Order is paid');
			}
			else
				logError('Something went wrong');
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function closeAddFoodGuest() {
	$('#addFoodGuest').css('visibility', 'hidden');
}

function showAddFoodGuest(id) {
	// will take id when integrated, for now only show
	var closeBtn = `<span class="glyphicon glyphicon-remove-circle" style="float: right;" onclick="javascript: closeAddFoodGuest();"></span>`;
	currentGuest = id;
	currWindow = 'orderList';
	$('#addFoodGuest .head').html($('#' + currentGuest + ' .title').text() + closeBtn);
	loadGuestOrder(currentGuest, currWindow);
	$('#addFoodGuest').css('visibility', 'visible');
}

function closeAddFoodGuestItem() {
	$('#addFoodGuestItem').css('visibility', 'hidden');
}

function showAddFoodGuestItem(id) {
	// will take id when integrated, for now only show
	$('#addFoodGuestItem').css('visibility', 'visible');
}

function closeGuestFood() {
	$('#guestFood').css('visibility', 'hidden');
}

function showGuestFood(id) {
	// will take id when integrated, for now only show
	var closeBtn = `<span class="glyphicon glyphicon-remove-circle" style="float: right;" onclick="javascript: closeGuestFood();"></span>`;
	currentGuest = id;
	currWindow = 'foodList';
	$('#guestFood .head').html($('#' + currentGuest + ' .title').text() + closeBtn);
	loadGuestOrder(currentGuest, currWindow);
	$('#guestFood').css('visibility', 'visible');
}

function closeGuestBill() {
	$('#guestBill').css('visibility', 'hidden');
}

function showGuestBill(id) {
	// will take id when integrated, for now only show
	var closeBtn = `<span class="glyphicon glyphicon-remove-circle" style="float: right;" onclick="javascript: closeGuestBill();"></span>`;
	currentGuest = id;
	currWindow = 'payingList';
	$('#guestBill .head').html($('#' + currentGuest + ' .title').text() + closeBtn);
	loadGuestOrder(currentGuest, currWindow);
	//setTimeout(function() {displayTotal();}, 10);
	$('#guestBill').css('visibility', 'visible');
}