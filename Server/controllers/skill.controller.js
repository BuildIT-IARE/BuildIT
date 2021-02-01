const Skill = require("../models/skill.model.js");
const WeekSkill = require("../models/weekSkill.model.js");
const inarray = require("inarray");
const xlsx = require("xlsx");

exports.createExcel = (req, res) => {
	if (req.files.upfile) {
	  	var file = req.files.upfile,
		name = file.name,
		type = file.mimetype;
	    var uploadpath = "../Public/current_leaderboard" + name;
	    file.mv(uploadpath, function (err) {
			if (err) {
				console.log("File Upload Failed", name, err);
				res.send("Error Occured!");
			} else {
				let wb = xlsx.readFile("../Public/current_leaderboard" + name);
				let ws = wb.Sheets["Sheet1"];
				let data = xlsx.utils.sheet_to_json(ws);
				let skill, weekSkill, week;
				WeekSkill.find()
					.then( (weekSkills) => {
						let currWeek = weekSkills.length || 0;
						week = "WEEK" + (currWeek + 1).toString();
						weekSkill = new WeekSkill({
							dateId: new Date(),
							weekId: week,
						});
						// Save Week Skill in the database
						weekSkill.save();
					})
					.catch((err) => {
						res.status(500).send({
						success: false,
						message:
							err.message ||
							"Some error occurred while retrieving skills.",
						});
					});
				Skill.find()
					.then((skills) => {
						for (let i = 0; i < data.length; i++) {
							skill = new Skill({
							weekId: week,
							rank: data[i].rank,
							rollNumber: data[i].rollNumber,
							name: data[i].name,
							hackerRank: data[i].hackerRank,
							codeChef: data[i].codeChef,
							codeforces: data[i].codeforces,
							interviewBit: data[i].interviewBit,
							spoj: data[i].spoj,
							geeksForGeeks: data[i].geeksForGeeks,
							buildIT: data[i].buildIT,
							overallScore: data[i].overallScore,
							weeklyPerformance: data[i].weeklyPerformance,
							});
							// Save Skill in the database
							skill.save();
						}
						res.send("Done! Uploaded files");
					})
					.catch((err) => {
						res.status(500).send({
							success: false,
							message:
							err.message ||
							"Some error occurred while retrieving skills.",
						});
					});
			}
	    });
	} else {
		res.send("No File selected !");
		res.end();
	}
};

exports.findAll = (req, res) => {
	Skill.find()
		.then((skill) => {
			res.send(skill);
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				message:
				err.message || "Some error occurred while retrieving skills.",
			});
		});
};

exports.findOne = (req, res) => {
	Skill.find({ weekId : req.params.week })
		.then((skill) => {
			if (!skill) {
				return res.status(404).send({
					success: false,
					message: "Week not found with week Id " + req.params.week,
				});
			}
			res.send(skill);
		})
		.catch((err) => {
			if (err.kind === "ObjectId") {
				return res.status(404).send({
					success: false,
					message: "Week not found with week Id  " + req.params.week,
				});
			}
			return res.status(500).send({
				success: false,
				message: "Error retrieving user with id " + req.params.week,
			});
		});
};

exports.findRecent = (req, res) => {
	Skill.find()
		.then((skill) => {
			if (!skill) {
				return res.status(404).send({
					success: false,
					message: "Week not found with week Id",
				});
			}
			let arr=[];
			let i = skill.length-1;
			let week = skill[i].weekId;
			while(i>=0 && skill[i].weekId === week ) {
				arr.push(skill[i]),
				i = i-1;
			}
			res.send(arr);
		})
		.catch((err) => {
			if (err.kind === "ObjectId") {
				return res.status(404).send({
					success: false,
					message: "Week not found with week Id",
				});
			}
			return res.status(500).send({
				success: false,
				message: "Error retrieving user with id",
			});
		});
};

exports.findAllWeeks = (req, res) => {
	WeekSkill.find()
    .then((weekSkill) => {
			res.send(weekSkill);
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
				message:
				err.message || "Some error occurred while retrieving weeks.",
			});
		});
}
