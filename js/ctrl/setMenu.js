var app = angular.module('setMenuPage', []);
var username = window.localStorage.getItem('user');
var globalData = {
	currentID: null
};
// add language translations object here

app.controller('data', function($scope) {
	// add language translations from object above

});


//////////////////////////////////////////////////////////////
// Allowing only numbers and 1 dot in the price field
//////////////////////////////////////////////////////////////
$('#itemPrice').keypress(function(e) {
	var key = e.keyCode || e.which;
	var dot = $(this).val().match(/\./g);
	console.log(e, e.keyCode, e.which, dot, key);


	if ((key > 57 || key < 48) && key !== 46)
		e.preventDefault();

	if (dot !== null && dot.length > 0 && key === 46)
		e.preventDefault();
});

//////////////////////////////////////////////////////////////
// Validates form when Add button is clicked
//////////////////////////////////////////////////////////////
function validateData() {
	var title = $('#itemTitle').val();
	var desc = $('#itemDesc').val();
	var price = fixNumber($('#itemPrice').val());
	var x = title.replace(/[A-Z\d\s\&\,\.\!\?]/gi, '');
	var y = desc.replace(/[A-Z\d\s\&\,\.\!\?]/gi, '');
	var isInvalid = false;

	// Title validation
	if (!x && title.length > 0) {
		$('#itemTitle').css('border', '1px solid #252525');
	}
	else {
		$('#itemTitle').css('border', '1px solid red');
		isInvalid = true;
	}

	// Description validation
	if (!y && desc.length > 0) {
		$('#itemDesc').css('border', '1px solid #252525');
	}
	else {
		$('#itemDesc').css('border', '1px solid red');
		isInvalid = true;
	}

	// Price validation
	if (price.length > 0 && price !== '.') {
		$('#itemPrice').css('border', '1px solid #252525');
	}
	else {
		$('#itemPrice').css('border', '1px solid red');
		isInvalid = true;
	}

	// If form is invalid on submit
	if (isInvalid) {
		logError('Invalid form');
	}

	// If form is valid on submit
	if (!isInvalid) {
		var url = `http://localhost:3535/addItemToMenu?title=${title}&about=${desc}&price=${price}&username=${username}`;
		console.log(url, 'Executed');
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				console.log(data);
				logSuccess('Food item added');
				loadMenu(true);
				afterSaveDelete();
			},
			error: function(err) {
				console.log(err);
			}
		});
	}
}

//////////////////////////////////////////////////////////////
// LOAD MENU (loads menu from an API)
//////////////////////////////////////////////////////////////
function loadMenu(clear) {
	var url = `http://localhost:3535/getMenu?username=${username}`;

	if (clear !== undefined && clear)
		$('#menuList').html('');
	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			console.log(typeof data);
			data.forEach(function(item) {
				var html = `<div class="foodItem" id="${item._id}" onclick="javascript: editMenuItem(this.id)">
                    <h4 class="title">${item.title}</h4>
                    <p class="desc">${item.about}</p>
                    <p class="price">$${Number(item.price)}</p>
            	</div>`;
            	//console.log(html);
            	$('#menuList').append(html);
			});
			

		},
		error: function(err) {
			console.log(err);
		}
	});
}

//////////////////////////////////////////////////////////////
// EDIT MENU ITEM (edits menu item, aka delete or edit)
//////////////////////////////////////////////////////////////
function editMenuItem(id) {
	globalData.currentID = id;
	$('#addBtn').hide();
	$('#saveBtn').show();
	$('#deleteBtn').show();
	console.log(id);
	getItemByID(globalData.currentID, function(data) {
		console.log(data);
		$('#itemTitle').val(data.title);
		$('#itemDesc').val(data.about);
		$('#itemPrice').val(data.price);
		logInfo('');
	});
}

//////////////////////////////////////////////////////////////
// SAVE MENU ITEM (saves menu item)
//////////////////////////////////////////////////////////////
function saveMenuItem() {
	var title = $('#itemTitle').val();
	var about = $('#itemDesc').val();
	var price = fixNumber($('#itemPrice').val());
	var x = title.replace(/[A-Z\d\s\&\,\.\!\?]/gi, '');
	var y = about.replace(/[A-Z\d\s\&\,\.\!\?]/gi, '');
	var isInvalid = false;

	// Title validation
	if (!x && title.length > 0) {
		$('#itemTitle').css('border', '1px solid #252525');
	}
	else {
		$('#itemTitle').css('border', '1px solid red');
		isInvalid = true;
	}

	// Description validation
	if (!y && about.length > 0) {
		$('#itemDesc').css('border', '1px solid #252525');
	}
	else {
		$('#itemDesc').css('border', '1px solid red');
		isInvalid = true;
	}

	// Price validation
	if (price.length > 0 && price !== '.') {
		$('#itemPrice').css('border', '1px solid #252525');
	}
	else {
		$('#itemPrice').css('border', '1px solid red');
		isInvalid = true;
	}

	// If form is invalid on submit
	if (isInvalid) {
		logError('Invalid form');
	}

	if (!isInvalid) {
		setItemByID(globalData.currentID, title, about, price, function(data) {
			if (data.status == "SUCCESS") {
				logSuccess('Food item saved');
				loadMenu(true);
				afterSaveDelete();
			}
			else {
				logError('Something went wrong');
			}
		});
	}
}

//////////////////////////////////////////////////////////////
// DELETE MENU ITEM (deletes the item you have opened)
//////////////////////////////////////////////////////////////
function deleteMenuItem() {
	deleteItemByID(globalData.currentID, function(data) {
		if (data.status == "SUCCESS") {
			logSuccess('Food item is deleted');
			loadMenu(true);
			afterSaveDelete();
		}
		else {
			logError('Something went wrong');
		}
	});
}

//////////////////////////////////////////////////////////////
// AFTER SAVE BUTTON IS SUCCESFULY HIT OR DELETE
//////////////////////////////////////////////////////////////
function afterSaveDelete() {
	closeInfo(); 
	setTimeout(function() {
		$('#addBtn').hide(); 
		$('#saveBtn').hide(); 
		$('#deleteBtn').hide();
	}, 1000);
}

//////////////////////////////////////////////////////////////
// GET ITEM BY ID (gets an item via ID)
//////////////////////////////////////////////////////////////
function getItemByID(id, callback) {
	var url = `http://localhost:3535/getMenuItemByID?username=${username}&id=${id}`

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			callback(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

//////////////////////////////////////////////////////////////
// SET ITEM BY ID (sets an item via ID)
//////////////////////////////////////////////////////////////
function setItemByID(id, title, about, price, callback) {
	var url = `http://localhost:3535/setMenuItemByID?username=${username}&id=${id}&title=${title}&about=${about}&price=${price}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			callback(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

//////////////////////////////////////////////////////////////
// DELETE ITEM BY ID (deletes the item via ID)
//////////////////////////////////////////////////////////////
function deleteItemByID(id, callback) {
	var url = `http://localhost:3535/deleteMenuItemByID?username=${username}&id=${id}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function(data) {
			console.log(data, 'AJAX');
			callback(data);
		},
		error: function(err) {
			console.log(err)
		}
	});
}

//////////////////////////////////////////////////////////////
// Takes numbers like .35 or 35. and fixes them
//////////////////////////////////////////////////////////////
function fixNumber(n) {
	n = n.split('');

	if (n[0] == '.') {
		n = '0' + n.join('');
	}
	else if (n[n.length-1] == '.') {
		n.splice(n.length-1,1)
		n = n.join('');
	}
	else
		n = n.join('');
	
	return n;
}