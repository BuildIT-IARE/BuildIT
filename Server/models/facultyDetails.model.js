const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const schema = mongoose.Schema;


const facultyDetailsSchema = new schema ({

    title: {
        type: String,
        required: true,
        enum: ['Dr.', 'Mr.', 'Ms.', 'Mrs.'],
        
    },

    id : {
        type: String,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        required: [true, "can't be blank"],
    },

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
    },

    phone: {
        type: String,
        default: "No number provided",
    },

    image: {
        type: String,
        default: "",
    },

    // 0 - active, 1 - inactive
    status: {
        type: Number,
        required: true,
        default: 0,
    },

    department: {
        type: String,
        required: true,
    },

    designation: {
        type: String,
        required: true,
    },  
});

facultyDetailsSchema.plugin(uniqueValidator, {
  message: "is already taken."
});

module.exports = mongoose.model("FacultyDetail", facultyDetailsSchema)