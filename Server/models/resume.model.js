// MONGOOSE SCHEMA
const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var personalInfoSchema = new Schema ({
    firstName : String,
    lastName : String,
    city : String,
    country: String,
    pinCode : Number,
    phoneNumber : Number,
    emailId : String,
    socials : Array,
})

var educationalInfoSchema = new Schema ({
    schoolName : String,
    schoolLocation : String,
    schoolStartDate: String,
    schoolPassingDate: String,
    schoolScore : String,
    schoolScoreType : String,
    schoolDesc : String,
    interName : String,
    interLocation : String,
    interStartDate: String,
    interPassingDate: String,
    interScore : String,
    interScoreType : String,
    interDesc : String,
    collegeName : String,
    collegeLocation : String,
    collegeStartDate: String,
    collegePassingDate: String,
    collegeScore : String,
    collegeScoreType : String,
    collegeDesc : String,
})

var internshipInfoSchema = new Schema ({
    internshipName : Array,
    internshipCompanyName: Array,
    internshipCertificate : Array,
    internshipDesc : Array,
    internshipStartDate : Array,
    internshipEndDate : Array,
})

var codingProfilesSchema = new Schema ({
    codeChefUsername: String,
    codeChefURL : String,
    codeChefRating : Number,
    hackerRankUsername : String,
    hackerRankURL : String,
    hackerRankBadges : Number,
    codeForcesUsername : String,
    codeForcesURL : String,
    codeForcesRating : Number,
    geeksForGeeksUsername : String,
    geeksForGeeksURL : String,
    geeksForGeeksScore : Number,
    interViewBitUsername : String,
    interViewBitURL : String,
    interViewBitScore : Number,
    leetCodeUsername : String,
    leetCodeURL : String,
    leetCodeProblems : Number,
    spojUsername : String,
    spojURL : String,
    spojProblems : Number,
})

var resumeSchema = new Schema ({
    //resumeId is RollNumber to differentiate among others
    resumeId: String,
    personalInfo : personalInfoSchema,
    educationalInfo : educationalInfoSchema,
    brief : String,
    personalSkills : Array, // array will look something like this [[C++,3],[Py,4]]
    professionalSkills : Array,
    internshipInfo : internshipInfoSchema,
    projects : Array, // array will look like [[project name,project desc,project url]]
    codingProfilesInfo : codingProfilesSchema,
    achievements: Array, // arrays will look like this [[achievement name,achievement date]]
    extraCurricular : Array,
    themeId : String,
});

module.exports = {
    Resume: mongoose.model("Resume", resumeSchema),
    PersonalInfo : mongoose.model("PersonalInfo",personalInfoSchema),
    EducationalInfo : mongoose.model("EducationalInfo",educationalInfoSchema),
    InternshipInfo : mongoose.model("InternshipInfo",internshipInfoSchema),
    CodingProfiles : mongoose.model("CodingProfiles",codingProfilesSchema),
};