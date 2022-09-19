const ResumeModels = require("../models/resume.model.js");
const Resume = ResumeModels.Resume;
const PersonalInfo = ResumeModels.PersonalInfo;
const EducationalInfo = ResumeModels.EducationalInfo;
const InternshipInfo = ResumeModels.InternshipInfo;
const CodingProfilesInfo = ResumeModels.CodingProfiles;

exports.create = (req, res) => {
  //extracting all socials
  //socialsArray = [[social1,social1url]...]
  socialsArray = [];
  var socialsCount = 1;
  while (req.body["Social" + socialsCount]) {
    var socials = [
      req.body["Social" + socialsCount],
      req.body["SocialURL" + socialsCount],
    ];
    socialsArray.push(socials);
    socialsCount++;
  }

  //extracting all internships names
  internshipNamesArray = [];
  internshipCompanyNamesArray = [];
  internshipCertificatesArray = [];
  internshipDescArray = [];
  internshipStartDatesArray = [];
  internshipEndDatesArray = [];
  var internshipCount = 1;
  while (req.body["IntershipName" + internshipCount]) {
    internshipNamesArray.push(req.body["IntershipName" + internshipCount]);
    internshipCompanyNamesArray.push(req.body["CompanyName" + internshipCount]);
    internshipCertificatesArray.push(
      req.body["CetificateURL" + internshipCount]
    );
    var InternDesc;
    if (req.body["InternDesc" + internshipCount] != undefined) {
      InternDesc = req.body["InternDesc" + internshipCount].replace(
        /(\r\n|\n|\r)/gm,
        ""
      );
    }
    internshipDescArray.push(InternDesc);
    internshipStartDatesArray.push(
      req.body["InternDateofStart" + internshipCount]
    );
    internshipEndDatesArray.push(req.body["InternDateofEnd" + internshipCount]);
    internshipCount++;
  }

  //extracting all achievements
  var achievementsArray = [];
  var achievementsCount = 1;
  while (req.body["Achievement" + achievementsCount]) {
    var achievement = [
      req.body["Achievement" + achievementsCount],
      req.body["AchievementDate" + achievementsCount],
    ];
    achievementsArray.push(achievement);
    achievementsCount++;
  }

  //extracting all personalSkills
  var personalSkillsArray = [];
  var personalSkillsCount = 1;
  while (req.body["Peskillname" + personalSkillsCount]) {
    var personalSkill = [
      req.body["Peskillname" + personalSkillsCount],
      req.body["pes" + personalSkillsCount],
    ];
    personalSkillsArray.push(personalSkill);
    personalSkillsCount++;
  }

  //extracting all professionalSkills
  var professionalSkillsArray = [];
  var professionalSkillsCount = 1;
  while (req.body["Prskillname" + professionalSkillsCount]) {
    var professionalSkill = [
      req.body["Prskillname" + professionalSkillsCount],
      req.body["prs" + professionalSkillsCount],
    ];
    professionalSkillsArray.push(professionalSkill);
    professionalSkillsCount++;
  }

  //extracting all projects
  var projectsArray = [];
  var projectsCount = 1;
  while (req.body["ProjectName" + projectsCount]) {
    var ProjectDesc;
    if (req.body["ProjectDesc" + projectsCount] != undefined) {
      ProjectDesc = req.body["ProjectDesc" + projectsCount].replace(
        /(\r\n|\n|\r)/gm,
        ""
      );
    }
    var project = [
      req.body["ProjectName" + projectsCount],
      req.body["ProjectURL" + projectsCount],
      ProjectDesc,
    ];
    projectsArray.push(project);
    projectsCount++;
  }

  //extracting all extracurricular
  var extraCurricularArray = [];
  var extraCurricularCount = 1;
  while (req.body["EActivity" + extraCurricularCount]) {
    extraCurricularArray.push(req.body["EActivity" + extraCurricularCount]);
    extraCurricularCount++;
  }

  var personalInfo = new PersonalInfo({
    firstName: req.body.Fname,
    lastName: req.body.Lname,
    city: req.body.City,
    country: req.body.Country,
    pinCode: req.body.PinCode,
    phoneNumber: req.body.Phone,
    emailId: req.body.Email,
    socials: socialsArray,
  });

  var educationalInfo = new EducationalInfo({
    schoolName: req.body.SchoolName,
    schoolLocation: req.body.SchoolLocation,
    schoolStartDate: req.body.ScDateofStart,
    schoolPassingDate: req.body.ScDateofPass,
    schoolScore: req.body.ScFinalScore,
    schoolScoreType: req.body.ScMarksType,
    schoolDesc: req.body.ScCourseDesc,
    interName: req.body.IntCollegeName,
    interLocation: req.body.IntColllegeLocation,
    interStartDate: req.body.IntDateofStart,
    interPassingDate: req.body.IntDateofPass,
    interScore: req.body.IntFinalScore,
    interScoreType: req.body.IntMarksType,
    interDesc: req.body.IntCourseDesc,
    collegeName: req.body.GraCollegeName,
    collegeLocation: req.body.GraColllegeLocation,
    collegeStartDate: req.body.GraDateofStart,
    collegePassingDate: req.body.GraDateofPass,
    collegeScore: req.body.GraFinalScore,
    collegeScoreType: req.body.GraMarksType,
    collegeDesc: req.body.ColCourseDesc,
  });

  var internshipInfo = new InternshipInfo({
    internshipName: internshipNamesArray,
    internshipCompanyName: internshipCompanyNamesArray,
    internshipCertificate: internshipCertificatesArray,
    internshipDesc: internshipDescArray,
    internshipStartDate: internshipStartDatesArray,
    internshipEndDate: internshipEndDatesArray,
  });

  var codingProfilesInfo = new CodingProfilesInfo({
    codeChefUsername: req.body.CodeChef,
    codeChefURL: req.body.CodeChefURL,
    codeChefRating: req.body.CodeChefRating,
    hackerRankUsername: req.body.Hackerrank,
    hackerRankURL: req.body.HackerrankURL,
    hackerRankBadges: req.body.HackerrankBadges,
    codeForcesUsername: req.body.Codeforces,
    codeForcesURL: req.body.CodeforcesURL,
    codeForcesRating: req.body.CodeforcesRating,
    geeksForGeeksUsername: req.body.GeeksforGeeks,
    geeksForGeeksURL: req.body.GeeksforGeeksURL,
    geeksForGeeksScore: req.body.GeeksforGeeksScore,
    interViewBitUsername: req.body.InterviewBit,
    interViewBitURL: req.body.InterviewBitURL,
    interViewBitScore: req.body.InterviewBitScore,
    leetCodeUsername: req.body.LeetCode,
    leetCodeURL: req.body.LeetCodeURL,
    leetCodeProblems: req.body.LeetCodeProblems,
    spojUsername: req.body.Spoj,
    spojURL: req.body.SpojURL,
    spojProblems: req.body.SpojProblems,
  });
  var brief;
  if (req.body.Brief != undefined) {
    brief = req.body.Brief.replace(/(\r\n|\n|\r)/gm, "");
  }

  Resume
    //findOneAndUpdate creates a new Doc if query is not found or updates the existing if found
    .findOneAndUpdate(
      { resumeId: req.body.username },
      {
        $set: {
          resumeId: req.body.username,
          themeId: req.body.theme,
          personalSkills: personalSkillsArray,
          professionalSkills: professionalSkillsArray,
          projects: projectsArray,
          achievements: achievementsArray,
          extraCurricular: extraCurricularArray,
          brief: brief,
          personalInfo: personalInfo,
          educationalInfo: educationalInfo,
          internshipInfo: internshipInfo,
          codingProfilesInfo: codingProfilesInfo,
        },
      },
      { upsert: true }
    )
    .then((resume) => {
      res
        .status(200)
        .send("Your Resume is Created! Go Back and click on My Resume");
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        message: "Error Occurred with  " + req.params.resumeId,
      });
    });
};

exports.findAll = (req, res) => {
  Resume.find()
    .then((resumes) => {
      if ("branch" in req.body) {
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
  Resume.findOne({ resumeId: req.params.username })
    .then((resume) => {
      res.send({
        success: true,
        data: resume,
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "You have no Resumes",
      });
    });
};

exports.delete = (req, res) => {
  Resume.deleteOne({
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
