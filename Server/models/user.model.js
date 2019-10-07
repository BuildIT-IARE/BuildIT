// MONGOOSE SCHEMA
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    password: String,
    name: String,
    email: {type: String, lowercase: true, required: [true, "can't be blank"], index: true},
    admin: String,
    totalScore: {type: Number, default: 0},
    isVerified: {type: Boolean, default: false}
}, {timestamps: true});

userSchema.index({email: -1, username: 1}, {unique: true});
module.exports = mongoose.model('User', userSchema);
