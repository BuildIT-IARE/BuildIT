// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;


var facultyResumeSchema = new Schema ({
    //resumeId is RollNumber to differentiate among others
    resumeId: String,
    imgURL: String,
    name: String,
    fatherName: String,
    designation: String,
    department: String,
    officeAddress : String,
    dob: String,
    age: Number,
    mobileNumber: Number,
    email: Array, // array will look something like this [email1, email2]
    degree: Array, // array will look something like this [degree1, degree2]
    specialization: Array, // array will look something like this [sp1, sp2]
    yearOfPass: Array, // array will look something like this [yop1, yop2]
    marks: Array, // array will look something like this [marks1, marks2]
    university: Array, // array will look something like this [u1, u2]
    experience: Array, // array will look something like this [exp1, exp2]
    role: Array, // array will look something like this [role1, role2]
    workAddress: Array, // array will look something like this [wa1, wa2]
    empStartDate: Array, // array will look something like this [esd1, esd2] (employeeStartDate)
    empEndDate: Array, // array will look something like this [eed1, eed2]
    adminStartDate: Array, //Admin roles start date
    adminTimePeriod: Array,
    adminWorkAddress: Array,
    adminEndDate: Array,
    adminRole: Array,
    research: Array,
    identityWebsite: Array,
    identityURL : Array,
    publication: Array,
    conference: Array,
    patent: Array,
    textBooks: Array,
    themeId : {
        type: String,
        default: 0
    },
});

module.exports = mongoose.model("FacultyResume", facultyResumeSchema);