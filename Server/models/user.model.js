// MONGOOSE SCHEMA
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


var Schema = mongoose.Schema;

var userSchema = new Schema({
  
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    index: true,
  },
  password: String,
  name: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    index: true,
  },
  phone: {
    type: Number,
    default: 0
  },
  countDate: String,
  photo: {
    data: Buffer,
    contentType: String
  },
  admin: String,
  branch: String,
  totalScore: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifyToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true
});

userSchema.plugin(uniqueValidator, {
  message: "is already taken."
});

module.exports = mongoose.model("User", userSchema);