const FacultyResume = require("../models/facultyResume.model.js");
//.replace(/(\r\n|\n|\r)/gm, "")
exports.create = (req, res) => {
  emailsArray = [];
  var emailsCount = 1;
  while (req.body["Email" + emailsCount]) {
    emailsArray.push(req.body["Email" + emailsCount]);
    emailsCount++;
  }

  degreesArray = [];
  if (req.body["Degree"]) {
    degreesArray.push(req.body["Degree"]);
  }
  var degreesCount = 1;
  while (req.body["Degree" + degreesCount]) {
    degreesArray.push(req.body["Degree" + degreesCount]);
    degreesCount++;
  }

  specializationsArray = [];
  if (req.body["Specialization"]) {
    specializationsArray.push(req.body["Specialization"]);
  }
  var specializationsCount = 1;
  while (req.body["Specialization" + specializationsCount]) {
    specializationsArray.push(
      req.body["Specialization" + specializationsCount]
    );
    specializationsCount++;
  }

  yearOfPassArray = [];
  if (req.body["YearOfPass"]) {
    yearOfPassArray.push(req.body["YearOfPass"]);
  }
  var yearOfPassCount = 1;
  while (req.body["YearOfPass" + yearOfPassCount]) {
    yearOfPassArray.push(req.body["YearOfPass" + yearOfPassCount]);
    yearOfPassCount++;
  }

  marksArray = [];
  if (req.body["marks"]) {
    marksArray.push(req.body["marks"]);
  }
  var marksCount = 1;
  while (req.body["marks" + marksCount]) {
    marksArray.push(req.body["marks" + marksCount]);
    marksCount++;
  }

  universityArray = [];
  if (req.body["University"]) {
    universityArray.push(req.body["University"]);
  }
  var universityCount = 1;
  while (req.body["University" + universityCount]) {
    universityArray.push(req.body["University" + universityCount]);
    universityCount++;
  }

  experienceArray = [];
  if (req.body["Experience"]) {
    experienceArray.push(req.body["Experience"]);
  }
  var experienceCount = 1;
  while (req.body["Experience" + experienceCount]) {
    experienceArray.push(req.body["Experience" + experienceCount]);
    experienceCount++;
  }

  roleArray = [];
  if (req.body["Role"]) {
    roleArray.push(req.body["Role"]);
  }
  var roleCount = 1;
  while (req.body["Role" + roleCount]) {
    roleArray.push(req.body["Role" + roleCount]);
    roleCount++;
  }

  workAddressArray = [];
  if (req.body["WorkAddress"]) {
    workAddressArray.push(req.body["WorkAddress"]);
  }
  var workAddressCount = 1;
  while (req.body["WorkAddress" + workAddressCount]) {
    workAddressArray.push(req.body["WorkAddress" + workAddressCount]);
    workAddressCount++;
  }

  var empStartDateArray = [];
  if (req.body["empStartDate"]) {
    empStartDateArray.push(req.body["empStartDate"]);
  }
  var empStartDateCount = 1;
  while (req.body["empStartDate" + empStartDateCount]) {
    empStartDateArray.push(req.body["empStartDate" + empStartDateCount]);
    empStartDateCount++;
  }

  var adminStartDateArray = [];
  if (req.body["adminStartDate"]) {
    adminStartDateArray.push(req.body["adminStartDate"]);
  }
  var adminStartDateCount = 1;
  while (req.body["adminStartDate" + adminStartDateCount]) {
    adminStartDateArray.push(req.body["adminStartDate" + adminStartDateCount]);
    adminStartDateCount++;
  }

  var empEndDateArray = [];
  if (req.body["empEndDate"]) {
    empEndDateArray.push(req.body["empEndDate"]);
  }
  var empEndDateCount = 1;
  while (req.body["empEndDate" + empEndDateCount]) {
    empEndDateArray.push(req.body["empEndDate" + empEndDateCount]);
    empEndDateCount++;
  }

  var adminEndDateArray = [];
  if (req.body["adminEndDate"]) {
    adminEndDateArray.push(req.body["adminEndDate"]);
  }
  var adminEndDateCount = 1;
  while (req.body["adminEndDate" + adminEndDateCount]) {
    adminEndDateArray.push(req.body["adminEndDate" + adminEndDateCount]);
    adminEndDateCount++;
  }

  var adminTimePeriodArray = [];
  if (req.body["Period"]) {
    adminTimePeriodArray.push(req.body["Period"]);
  }
  var adminTimePeriodCount = 1;
  while (req.body["Period" + adminTimePeriodCount]) {
    adminTimePeriodArray.push(req.body["Period" + adminTimePeriodCount]);
    adminTimePeriodCount++;
  }

  var adminWorkAddressArray = [];
  if (req.body["adminWorkAddress"]) {
    adminWorkAddressArray.push(req.body["adminWorkAddress"]);
  }
  var adminWorkAddressCount = 1;
  while (req.body["adminWorkAddress" + adminWorkAddressCount]) {
    adminWorkAddressArray.push(
      req.body["adminWorkAddress" + adminWorkAddressCount]
    );
    adminWorkAddressCount++;
  }

  var adminRoleArray = [];
  if (req.body["adminRole"]) {
    adminRoleArray.push(req.body["adminRole"]);
  }
  var adminRoleCount = 1;
  while (req.body["adminRole" + adminRoleCount]) {
    adminRoleArray.push(req.body["adminRole" + adminRoleCount]);
    adminRoleCount++;
  }

  var identityWebsiteArray = [];
  if (req.body["IdentityWebsite"]) {
    identityWebsiteArray.push(req.body["IdentityWebsite"]);
  }
  var identityWebsiteCount = 1;
  while (req.body["IdentityWebsite" + identityWebsiteCount]) {
    identityWebsiteArray.push(
      req.body["IdentityWebsite" + identityWebsiteCount]
    );
    identityWebsiteCount++;
  }

  var identityURLArray = [];
  if (req.body["IdentityURL"]) {
    identityURLArray.push(req.body["IdentityURL"]);
  }
  var identityURLCount = 1;
  while (req.body["IdentityURL" + identityURLCount]) {
    identityURLArray.push(req.body["IdentityURL" + identityURLCount]);
    identityURLCount++;
  }

  var publicationArray = [];
  if (req.body["Publication"]) {
    publicationArray.push(req.body["Publication"]);
  }
  var publicationCount = 1;
  while (req.body["Publication" + publicationCount]) {
    publicationArray.push(req.body["Publication" + publicationCount]);
    publicationCount++;
  }

  var conferenceArray = [];
  var conferenceCount = 1;
  while (req.body["Conference" + conferenceCount]) {
    conferenceArray.push(req.body["Conference" + conferenceCount]);
    conferenceCount++;
  }

  var patentArray = [];
  var patentCount = 1;
  while (req.body["Patent" + patentCount]) {
    patentArray.push(req.body["Patent" + patentCount]);
    patentCount++;
  }

  var textBooksArray = [];
  var textBooksCount = 1;
  while (req.body["TextBooks" + textBooksCount]) {
    textBooksArray.push(req.body["TextBooks" + textBooksCount]);
    textBooksCount++;
  }
  // console.log(req.body);
  FacultyResume
    //findOneAndUpdate creates a new Doc if query is not found or updates the existing if found
    .findOneAndUpdate(
      { resumeId: req.body.username },
      {
        $set: {
          resumeId: req.body.username,
          themeId: req.body.theme,
          imgURL: req.body.imageURL,
          name: req.body.Name,
          fatherName: req.body.FatherName,
          designation: req.body.Designation,
          department: req.body.Department,
          officeAddress: req.body.OfficeAddress,
          dob: req.body.DOB,
          age: req.body.Age,
          mobileNumber: req.body.MobileNumber,
          email: emailsArray,
          degree: degreesArray,
          specialization: specializationsArray,
          yearOfPass: yearOfPassArray,
          marks: marksArray,
          university: universityArray,
          experience: experienceArray,
          role: roleArray,
          workAddress: workAddressArray,
          empStartDate: empStartDateArray,
          adminStartDate: adminStartDateArray,
          empEndDate: empEndDateArray,
          adminEndDate: adminEndDateArray,
          adminTimePeriod: adminTimePeriodArray,
          adminWorkAddress: adminWorkAddressArray,
          adminRole: adminRoleArray,
          research: req.body.Research,
          identityWebsite: identityWebsiteArray,
          identityURL: identityURLArray,
          publication: publicationArray,
          conference: conferenceArray,
          patent: patentArray,
          textBooks: textBooksArray,
          themeId: req.body.themeId,
        },
      },
      { upsert: true }
    )
    .then((resume) => {
      res
        .status(200)
        .send("Update Successfully Go Back and Click on My Resume");
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        message: "Error Occurred with  " + req.params.resumeId,
      });
    });
};

exports.findAll = (req, res) => {
  FacultyResume.find()
    .then((resumes) => {
      if ("department" in req.body) {
        var myArr = new Array();
        for (var i = 0; i < resumes.length; i++) {
          if (
            resumes[i].resumeId.slice(0, 2) == req.body.year &&
            resumes[i].resumeId.slice(6, 8) == req.body.branch
          ) {
            myArr.push(resumes[i]);
          }
        }
        res.send(myArr);
      } else {
        res.send(resumes);
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while retrieving Resumes.",
      });
    });
};

exports.findOne = (req, res) => {
  FacultyResume.findOne({ resumeId: req.params.username })
    .then((resume) => {
      res.send(resume);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "You have no Resumes",
      });
    });
};

exports.delete = (req, res) => {
  FacultyResume.deleteOne({
    resumeId: req.params.username,
  })
    .then(() => {
      res.status(200).send("Resume Deleted!");
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Resume not found",
      });
    });
};
