// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var courseSchema = new Schema({
    courseId: String,
    courseName: String 
  });

module.exports = mongoose.model('Course', courseSchema);
