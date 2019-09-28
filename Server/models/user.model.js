// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    admin: String,
    totalScore: String
});

module.exports = mongoose.model('User', userSchema);
