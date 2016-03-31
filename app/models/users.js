'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		username: String,
	},
	userinfo: {
		fullName: String,
		city: String,
		state: String,	
	},
	books: [],
	notifications: [],
	trades: []
});

module.exports = mongoose.model('User', User);
