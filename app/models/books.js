'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Books = new Schema({
    title: String,
    authors: String,
    desc: String,
    pages: Number,
    cover: String,
    user: String
});

module.exports = mongoose.model('Books', Books);
