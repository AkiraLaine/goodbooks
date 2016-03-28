'use strict';

var express = require('express');
var routes = require('./app/routes/routes.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyParser     =         require("body-parser");
var app            =         express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);

app.use('/public', express.static(process.cwd() + '/public'));
app.use("/controllers", express.static(process.cwd() + "/app/controllers"))

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Server listening on port ' + port + '...');
});