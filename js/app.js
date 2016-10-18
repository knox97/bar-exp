// MongoDB URL
// mongodb://knox:knox@ds061258.mlab.com:61258/bardb
//////////////////////////////////////////////////////////////
// Initial variables
//////////////////////////////////////////////////////////////
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var port = 3535;

mongoose.connect('mongodb://knox:knox@ds061258.mlab.com:61258/bardb');

//////////////////////////////////////////////////////////////
// Scheme for Registered users
//////////////////////////////////////////////////////////////
var registerSchema = new mongoose.Schema({
	email: String,
	username: String,
	password: String,
	apw: String,
	sum_rates: Number,
	rating: Number,
	gpw: String,
	guest_ids: [Number],
	guest_list: [
		{name: String, state: String, order: [{title: String, about: String, price: String}]}
	],
	settings: {
		info:  {name: String, about: String, photo: String},
		menu: [{id: Number, title: String, about: String, price: String}],
		currency: String
	}
});

var RegisteredUsers = mongoose.model('RegisteredUsers', registerSchema);

//////////////////////////////////////////////////////////////
// REGISER API
//////////////////////////////////////////////////////////////
app.get('/register', function(req, res) {
	// maybe will need to change to .json if it will be hosted on the same domain
	console.log(req.query);
	var email = req.query.email;
	var user = req.query.user;
	var pw = req.query.pw;
	var status = 200;
	var returnMsg = '';
	var created = false;
	RegisteredUsers.findOne({email: email}, function(err, data) {
		if (err) return console.error(err);
		console.log(data, 'email');
		if (data != null) {
			returnMsg = 'EXIST';
		}
		if (data == null) {
			RegisteredUsers.findOne({username: user}, function(err, data) {
				if (err) return console.error(err);
				console.log(data, 'user');
				if (data == null) {
					var newUser = new RegisteredUsers({
						email: email,
						username: user,
						password: pw,
						sum_rates: 0,
						rating: 5,
						apw: '',
						gpw: '',
						guest_ids: [],
						guest_list: [],
						settings: {
							info: {name: '', about: '', photo: ''},
							menu: [],
							currency: ''
						}
					});

					newUser.save(function(err, data) {
						if (err) return console.error(err);
						//console.dir(data);
					});
					returnMsg = 'CREATED';	
					created = true;
				}
				if (data != null) {
					returnMsg = 'EXIST';
					
				}
			});
		}
		
		res.jsonp({stats: status, return: returnMsg, created: created});
	});
	
})
//////////////////////////////////////////////////////////////
// LOGIN API
//////////////////////////////////////////////////////////////
app.get('/login', function(req, res) {
	var user = req.query.user;
	var pw = req.query.pw;
	var status = 200;
	var returnMsg = '';

	RegisteredUsers.findOne({username: user, password: pw}, function(err, data) {
		if (err) return console.error(err);
		console.log(data);
		if (data == null) {
			returnMsg = 'WRONG';
		}
		if (data != null) {
			returnMsg = 'LOGGED';
		}
		res.jsonp({stats: status, return: returnMsg});
	});
});

//////////////////////////////////////////////////////////////
// SET INFO API (sets info about company)
//////////////////////////////////////////////////////////////
app.get('/setInfo', function(req, res) {
	var name = req.query.name;
	var about = req.query.about;
	var photo = req.query.photo;
	var username = req.query.username;

	
	RegisteredUsers.findOne({username: username}, 'settings email username password', function(err, user) {
		if (err) return console.error(err);
		console.log(user);
		user.settings.info.name = name;
		user.settings.info.about = about;
		user.settings.info.photo = photo;
		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp({status: "SUCCESS"});
		});
	})
});

//////////////////////////////////////////////////////////////
// GET INFO API (gets info about company)
//////////////////////////////////////////////////////////////
app.get('/getInfo', function(req, res) {
	var username = req.query.username;

	RegisteredUsers.findOne({username: username}, 'username settings.info', function(err, user) {
		if (err) return console.error(err);
		res.jsonp({data: user.settings.info});
	});
});

//////////////////////////////////////////////////////////////
// ADD ITEM TO MENU (adds an item to menu)
//////////////////////////////////////////////////////////////
app.get('/addItemToMenu', function(req, res) {
	var title = req.query.title;
	var about = req.query.about;
	var price = req.query.price;
	var username = req.query.username;

	console.log(title, about, price, username);
	// add to database
	RegisteredUsers.findOne({username: username}, 'email food_id settings username', function(err, user) {
		if (err) return console.error(err);
		console.log(user);
		user.settings.menu.push({id: user.food_id, title: title, about: about, price: price});
		user.food_id += 1;
		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp({data: "success", id: user.settings});
		});

	});

	/*RegisteredUsers.update({username: username}, {$push: {"messages": {title: title, msg: msg}}},
    {safe: true, upsert: true}, function(err, data) {
    	if (err) return console.error(err);
    	res.jsonp(data);
    });*/
});

//////////////////////////////////////////////////////////////
// REMOVE ITEM FROM MENU (removes an item from menu)
//////////////////////////////////////////////////////////////
app.get('/removeItemFromMenu', function(req, res) {
	var username = req.query.username;
	var id = req.query.id;

	// remove from array of food, forEach if (current.id === id) menu.splice(i, 1)
	// .save
	// OR GOOGLE how to delete certain object from array in MongoDB
});

//////////////////////////////////////////////////////////////
// GET ITEM BY ID
//////////////////////////////////////////////////////////////
app.get('/getMenuItemByID', function(req, res) {
	var id = req.query.id;
	var username = req.query.username;

	console.log(id, username);
	// get item from database
	RegisteredUsers.findOne({username: username}, 'username settings.menu', function(err, user) {
		if (err) return console.error(err);
		user.settings.menu.forEach(function(item) {
			if (item._id == id) {
				res.jsonp(item)
			}
		});
		console.log(user);
	});
});

//////////////////////////////////////////////////////////////
// SET ITEM BY ID
//////////////////////////////////////////////////////////////
app.get('/setMenuItemByID', function(req, res) {
	var id = req.query.id;
	var username = req.query.username;
	var title = req.query.title;
	var about = req.query.about;
	var price = req.query.price;

	console.log(id, username, title, about, price);
	// get/set item from database
	RegisteredUsers.findOne({username: username}, 'username settings.menu', function(err, user) {
		var notEdited = true;
		user.settings.menu.forEach(function(item) {
			if (item._id == id && notEdited) {
				item.title = title;
				item.about = about;
				item.price = price;
				notEdited = false;
			}

		});
		user.save(function(err, userUpdated) {
			if (err) return console.log(err);
			res.jsonp({status: "SUCCESS"});
		});
	});
});

//////////////////////////////////////////////////////////////
// DELETE ITEM BY ID
//////////////////////////////////////////////////////////////
app.get('/deleteMenuItemByID', function(req, res) {
	var id = req.query.id;
	var username = req.query.username;

	console.log(id, username);
	
	RegisteredUsers.findOne({username: username}, 'username settings.menu', function(err, user) {
		if (err) return console.error(err);
		var indexToDelete = null;
		
		user.settings.menu.pull({_id: id})
		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp({status: 'SUCCESS'});
		});
	});
});


//////////////////////////////////////////////////////////////
// GET MENU ITEMS (gets all the items on the menu in JSON)
//////////////////////////////////////////////////////////////
app.get('/getMenu', function(req, res) {
	var username = req.query.username;

	// figure out how to get number of results with offset
	RegisteredUsers.findOne({username: username}, 'username settings', function(err, menu) {
		if (err) return console.error(err);
		console.log(menu);
		res.jsonp(menu.settings.menu);
	});
});

//////////////////////////////////////////////////////////////
// SET APW GPW AND CURRENCY (sets apw, gpw and currency)
//////////////////////////////////////////////////////////////
app.get('/setCurr', function(req, res) {
	var apw = req.query.apw;
	var gpw = req.query.gpw;
	var curr = req.query.curr;
	var username = req.query.username;

	// update/save database
	RegisteredUsers.findOne({username: username}, 'username apw gpw settings', function(err, user) {
		if (err) return console.error(err);
		user.apw = apw;
		user.gpw = gpw;
		user.settings.currency = curr;

		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp({status: 'SUCCESS'});
		});
	});
});

//////////////////////////////////////////////////////////////
// GUEST LOGIN (logs guest in with gpw)
//////////////////////////////////////////////////////////////
app.get('/guestLogin', function(req, res) {
	var username = req.query.username;
	var gpw = req.query.gpw;

	// gets and checks if password is valid for username
	RegisteredUsers.findOne({username: username}, 'username gpw', function(err, user) {
		if (err) return console.error(err);
		if (user.gpw == gpw)
			res.jsonp({status: 'SUCCESS'});
		else
			res.jsonp({status: 'WRONG'});
	});
});

//////////////////////////////////////////////////////////////
// ADD GUEST (adds guest to company guest_list)
//////////////////////////////////////////////////////////////
app.get('/addGuest', function(req, res) {
	var username = req.query.username;

	// add guest to the database
	// {name: String, state: String, order: [{title: String, about: String, price: String}]}
	RegisteredUsers.findOne({username: username}, 'username guest_ids guest_list', function(err, user) {
		if (err) return console.error(err);
		console.log(user);
		
		// find free ID slot
		var newID = 1;
		while (newID) {
			if (user.guest_ids.indexOf(newID) < 0) {
				user.guest_ids.push(newID);
				break;
			}
			newID += 1;
		}

		// add guest to the guest list
		var newGuest = {
			name: `guest-${newID}`,
			state: 'WAITING',
			order: []
		};
		user.guest_list.push(newGuest);

		// update guests
		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp({status: 'SUCCESS', name: 'guest-' + newID});
		});
	});
});

//////////////////////////////////////////////////////////////
// GET ALL GUESTS (gets array of guests)
//////////////////////////////////////////////////////////////
app.get('/getGuests', function(req, res) {
	var username = req.query.username;

	// get guests from db
	RegisteredUsers.findOne({username: username}, 'username guest_list', function(err, user) {
		if (err) return console.error(err);
		res.jsonp(user.guest_list);
	});
});

//////////////////////////////////////////////////////////////
// GET GUEST ORDER (gets order list of a guest)
//////////////////////////////////////////////////////////////
app.get('/getGuestOrder', function(req, res) {
	var username = req.query.username;
	var name = req.query.name;

	RegisteredUsers.findOne({username: username}, 'username guest_list', function(err, user) {
		if (err) return console.error(err);

		user.guest_list.forEach(function(guest) {
			if (guest.name == name)
				res.jsonp(guest.order);
		});
	});
});

//////////////////////////////////////////////////////////////
// ADD GUEST ORDER (adds guest order)
//////////////////////////////////////////////////////////////
app.get('/addGuestOrder', function(req, res) {
	var username = req.query.username;
	var title = req.query.title;
	var about = req.query.about;
	var price = req.query.price;
	var name = req.query.guest;

	//console.log(username, title, about, price, name);

	// add order to guest's order
	RegisteredUsers.findOne({username: username}, 'username guest_list', function(err, user) {
		if (err) return console.error(err);

		user.guest_list.forEach(function(guest) {
			if (guest.name == name)
				guest.order.push({
					title: title,
					about: about,
					price: price
				});
		});

		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp(user.guest_list);
		});
	});
});

//////////////////////////////////////////////////////////////
// REMOVE GUEST ORDER (removes guest order)
//////////////////////////////////////////////////////////////
app.get('/removeGuestOrder', function(req, res) {
	var username = req.query.username;
	var id = req.query.id;
	var name = req.query.guest;

	//console.log(username, id, name);
	// remove item from order list of a guest
	RegisteredUsers.findOne({username: username}, 'username guest_list', function(err, user) {
		if (err) return console.error(err);

		user.guest_list.forEach(function(guest) {
			if (guest.name == name) {
				guest.order.forEach(function(item, i) {
					if (item._id == id) {
						guest.order.splice(i, 1);
					}
				});
			}
		});

		user.save(function(err, userUpdated) {
			if (err) return console.error(err);

			res.jsonp({status: 'SUCCESS'});
		});
	});
});

//////////////////////////////////////////////////////////////
// PLACE ORDER (sets guests state to ORDERED)
//////////////////////////////////////////////////////////////
app.get('/placeOrder', function(req, res) {
	var username = req.query.username;
	var name = req.query.guest;

	// set guest state to ORDERED
	RegisteredUsers.findOne({username: username}, 'username guest_list', function(err, user) {
		if (err) return console.error(err);

		user.guest_list.forEach(function(guest) {
			if (guest.name == name)
				guest.state = 'ORDERED';
		});

		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp({status: 'SUCCESS'});
		});
	});
});

//////////////////////////////////////////////////////////////
// GUEST SERVED (sets guests state to SERVED)
//////////////////////////////////////////////////////////////
app.get('/guestServed', function(req, res) {
	var username = req.query.username;
	var name = req.query.guest;

	// set guest state to PAYING
	RegisteredUsers.findOne({username: username}, 'username guest_list', function(err, user) {
		if (err) return console.error(err);

		user.guest_list.forEach(function(guest) {
			if (guest.name == name)
				guest.state = 'SERVED';
			console.log(guest.name, guest.state);
		});

		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp({status: 'SUCCESS'});
		});
	});
});

//////////////////////////////////////////////////////////////
// GUEST PAID (sets guests state to PAID)
//////////////////////////////////////////////////////////////
app.get('/guestPaid', function(req, res) {
	var username = req.query.username;
	var name = req.query.guest;

	// set guest state to PAID
	RegisteredUsers.findOne({username: username}, 'username guest_list', function(err, user) {
		if (err) return console.error(err);

		user.guest_list.forEach(function(guest) {
			if (guest.name == name)
				guest.state = 'PAID';
		});

		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp({status: 'SUCCESS'});
		});
	});
});

//////////////////////////////////////////////////////////////
// GET GUEST STATE (gets guests state)
//////////////////////////////////////////////////////////////
app.get('/getGuestState', function(req, res) {
	var username = req.query.username;
	var name = req.query.guest;

	// get guest state
	RegisteredUsers.findOne({username: username}, 'username guest_list', function(err, user) {
		if (err) return console.error(err);
		var result = null;

		user.guest_list.forEach(function(guest) {
			if (guest.name == name)
				result = guest.state;
		});

		res.jsonp(result);
	});
});

//////////////////////////////////////////////////////////////
// SUBMIT RATING (submits rating)
//////////////////////////////////////////////////////////////
app.get('/submitRating', function(req, res) {
	var username = req.query.username;
	var rate = req.query.rate;

	// get/set user rating 
	RegisteredUsers.findOne({username: username}, 'username rating sum_rates', function(err, user) {
		if (err) return console.error(err);
		if (user.sum_rates)
			user.sum_rates += 1;
		else
			user.sum_rates += 2;

		var newRating = (user.rating + Number(rate)) / user.sum_rates;
		user.rating = newRating;
		
		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp({status: 'SUCCESS'});
		});
	});
});

//////////////////////////////////////////////////////////////
// REMOVE GUEST (removes guest from the list)
//////////////////////////////////////////////////////////////
app.get('/removeGuest', function(req, res) {
	var username = req.query.username;
	var name = req.query.guest;
	var id = Number(name.split('-')[1]);

	// delete/save guest_list guest_ids
	RegisteredUsers.findOne({username: username}, 'username guest_ids guest_list', function(err, user) {
		if (err) return console.error(err);

		var idDel = user.guest_ids.indexOf(id);
		console.log(idDel);
		if (idDel != -1)
			user.guest_ids.splice(idDel, 1);
		user.guest_list.forEach(function(guest, i) {
			if (guest.name == name)
				idDel = i;
		});
		if (idDel != -1)
			user.guest_list.splice(idDel, 1);

		user.save(function(err, userUpdated) {
			if (err) return console.error(err);
			res.jsonp({status: 'SUCCESS'});
		});
	});
});

//////////////////////////////////////////////////////////////
// ACCESS SETTINGS (check if apw matches with the input)
//////////////////////////////////////////////////////////////
app.get('/accessSettings', function(req, res) {
	var username = req.query.username;
	var apw = req.query.apw;

	// check if apw is same as input one
	RegisteredUsers.findOne({username: username}, 'username apw', function(err, user) {
		if (err) return console.error(err);
		if (user.apw == apw)
			res.jsonp({status: 'SUCCESS'});
		else
			res.jsonp({status: 'WRONG'});
	});
});

//////////////////////////////////////////////////////////////
// GET USERS (gets all users)
//////////////////////////////////////////////////////////////
app.get('/getUsers', function(req, res) {
	RegisteredUsers.find({}, 'username settings', function(err, users) {
		if (err) return console.error(err);

		res.jsonp(users);
	});
});

//////////////////////////////////////////////////////////////
// Starting a server on port thats defined on the top
//////////////////////////////////////////////////////////////
app.listen(port, function() {
	console.log(`Server running on port ${port}`);
});

