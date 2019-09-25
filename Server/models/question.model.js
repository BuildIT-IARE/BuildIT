// MONGOOSE SCHEMA
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questionSchema = new Schema({
    questionId: String,
    questionName: String,
    questionDescriptionText: String, 
    questionInputText: String,
    questionOutputText: String,
    questionExampleInput: String,
    questionExampleOutput: String,
    questionHiddenInput1: String,
    questionHiddenInput2: String,
    questionHiddenInput3: String,
    questionHiddenOutput1: String,
    questionHiddenOutput2: String,
    questionHiddenOutput3: String,
    questionExplanation: String
});

module.exports = mongoose.model('Question', questionSchema);