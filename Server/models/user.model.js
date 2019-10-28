// MONGOOSE SCHEMA
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useCreateIndex', true);


var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    password: String,
    name: String,
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], index: true},
    admin: String,
    branch: String,
    totalScore: {type: Number, default: 0},
    isVerified: {type: Boolean, default: false},
    verifyToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    ip: String
}, {timestamps: true});



userSchema.plugin(uniqueValidator, {message: 'is already taken.'});

module.exports = mongoose.model('User', userSchema);