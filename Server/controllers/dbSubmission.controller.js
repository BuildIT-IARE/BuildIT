const DBSub = require("../models/dbSubmission.model.js");
const sqlCon = require("./sqlDBConnector.js");
var moment = require("moment");

exports.create = (req, res) => {
    sqlCon.query("CREATE TABLE "+req.body.tableName+req.body.rollNumber+" AS SELECT * FROM "+req.body.tableName,function(err,result){
        if (err){
            return res.status(500).send({
                success: false,
                message:
                err.message || "Some error occurred while retrieving solution table for the question." + req.body.questionId,
            });
        }
        console.log("User Table created");
        console.log(result,"This is user table");
        var sqlCode = req.body.sqlCode.replace(req.body.tableName,req.body.tableName+req.body.rollNumber)
        sqlCon.query(sqlCode,function(err1,result1){
            if (err1){
                return res.status(500).send({
                    success: false,
                    message:
                    err1.message || "Some error occurred while retrieving solution table for the question." + req.body.questionId,
                });
            }
            console.log("User SQL code is executed");
            console.log(result1,"This is user output");
            result1 = result1.slice(-1).pop()
            //drop the table
            sqlCon.query("DROP TABLE "+req.body.tableName+req.body.rollNumber,function(err2,result2){
                var score=0;
                questionHiddenOutput = (req.body.questionHiddenOutput)
                console.log(questionHiddenOutput)
                result1 = (result1);
                console.log(result1);
                var color = "red";
                if(JSON.stringify(questionHiddenOutput) === JSON.stringify(result1[0]))
                {
                    score=100;
                    color = "green";
                }
                // Create a Submission
                const submission = new DBSub({
                    dbSessionId: req.body.dbSessionId,
                    questionId: req.body.questionId,
                    rollNumber: req.body.rollNumber,
                    sqlCode: req.body.sqlCode,    
                    score: score,
                    submissionTime: moment(),
                    tableName: req.body.tableName,
                    color: color,
                });
                submission
                .save()
                .then((data) => {
                    // console.log(data);
                    return callback(null, data);
                })
                .catch((err) => {
                    return callback("Error occurred while Submitting.(DB)", null);
                });
            });
        });
    })
};

exports.evaluateCode = (req, res) => {
    sqlCon.query("CREATE TABLE "+req.body.tableName+req.body.rollNumber+" AS SELECT * FROM "+req.body.tableName,function(err,result){
        if (err){
            return res.status(500).send({
                success: false,
                message:
                err.message || "Some error occurred while retrieving solution table for the question." + req.body.questionId,
            });
        }
        console.log("User Table created");
        console.log(result,"This is user table");
        var sqlCode = req.body.sqlCode.replace(req.body.tableName,req.body.tableName+req.body.rollNumber)
        sqlCon.query(sqlCode,function(err1,result1){
            if (err1){
                return res.status(500).send({
                    success: false,
                    message:
                    err1.message || "Some error occurred while retrieving solution table for the question." + req.body.questionId,
                });
            }
            console.log("User SQL code is executed");
            console.log(result1,"This is user output");
            result1 = result1.slice(-1).pop()
            //drop the table
            sqlCon.query("DROP TABLE "+req.body.tableName+req.body.rollNumber,function(err2,result2){
                if (err2){
                    return res.status(500).send({
                        success: false,
                        message:
                        err2.message || "Some error occurred while dropping solution table for the question." + req.body.questionId,
                    });
                }
                var score=0;
                questionHiddenOutput = (req.body.questionHiddenOutput)
                console.log(questionHiddenOutput)
                result1 = (result1);
                console.log(result1);
                if(JSON.stringify(questionHiddenOutput) === JSON.stringify(result1[0]))
                {
                    score=100;
                }
                return res.status(200).send({
                    success: true,
                    score: score,
                });
            });
        });
    })
};