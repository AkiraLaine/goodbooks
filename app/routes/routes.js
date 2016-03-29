'use strict';

var path = process.cwd();
var Users = require('../models/users.js');
var Books = require("../models/books.js")

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}


	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});
	
	app.route("/profile")
		.get(isLoggedIn, function(req,res){
			res.sendFile(path + "/public/profile.html")	
		});
		
	app.route("/browse")
		.get(isLoggedIn, function(req,res){
			res.sendFile(path + "/public/browse.html")
		})

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
		
	app.route("/getuser")
		.get(isLoggedIn, function(req,res){
			res.send(req.user)	
		})
		
	app.route("/delete")
		.get(function(req,res){
			Users.find({"github.id": req.user.github.id}).remove().exec(function(err,data){
				console.log(err);
			});
			res.redirect("/")
		})
		
	app.route("/api/addbook")
		.post(function(req,res){
			console.log(req.body)
			Users.update({"github.id": req.user.github.id}, {$push: {"books": req.body}}).exec(function(err,data){
				console.log(err)
			});
		})
	
	app.route("/api/allbooks")
		.get(function(req,res){
			var shelf = []
			Books.find({}, function (err, books) {
				res.json(books);
			});
		})
		.post(function(req,res){
			var newBook = new Books();
			newBook.title = req.body.title;
			newBook.authors = req.body.authors;
			newBook.desc = req.body.desc;
			newBook.pages = req.body.pages;
			newBook.cover = req.body.cover;
			newBook.save();
		})	
		
	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}));
};
