const EmailQuestion = require("../models/emailQuestion.model.js");

exports.create = (req,res) => {
    const question = new EmailQuestion({
        emailId: req.body.emailId,
        emailQuestionId: req.body.emailQuestionId,
        emailQuestionName: req.body.emailQuestionName,
        emailTopic: req.body.emailTopic,
        emailScore : Number(req.body.emailScore),
        emailGuidelines : req.body.emailGuidelines
    });

    question
    .save()
    .then((data) => {
        res.status(200).send("Question Created Successfully")
    })
    .catch((err) => {
        res.status(500).send(err.message || "Error Creating an Email Question")
    })
}

//extract all questions of a contest
exports.findAll = (req,res) => {
    EmailQuestion.find({emailId : req.body.emailId})
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(500).send("Error while retrieving questions of Contest Id "+req.body.emailId)
    })
}

//find one question
exports.findOne = (req,res) => {
    EmailQuestion.find({emailQuestionId : req.body.emailQuestionId})
    .then((data) => {
        data = data[0];
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(500).send("Error fetching Question with Email Question Id "+req.body.emailQuestionId)
    })
}

//delete a question
exports.delete = (req,res) => {
    EmailQuestion.remove(
        {emailQuestionId : req.body.emailQuestionId},
        {
            justOne : true,
        }
    )
    .then((data) => {
        res.status(200).send("Question successfully deleted");
    })
    .catch((err) => {
        res.status(500).send("Could not Delete QUestion due to "+err.message);
    })
}
