'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		username: String,
	},
	books: [],
	notifications: []
});

module.exports = mongoose.model('User', User);
