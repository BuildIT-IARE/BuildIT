const Counter = require("../models/counters.model.js");
var today = new Date();
exports.getCounters = (req,res) => {
    Counter.find({})
    .then((counter) => {
        res.status(200).send(counter);
    })
    .catch((err) => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving counters.",
        });
    });
}
exports.updateDay = (req,res) => {
    Counter.findOneAndUpdate(
        {},
        {
            $set: {
                prevDay : today.getDay(),
            },
            $inc: { 
                weeklyCount: Number(req.params.count)
            },
        },
    )
    .then((counter) => {
        res.status(200).send(counter);
    })
    .catch((err) => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while updating prevDay.",
        });
    });
}
exports.updateWeek = (req,res) => {
    Counter.findOneAndUpdate(
        {},
        {
            $set: {
                prevDay : today.getDay(),
                weeklyCount : 0,
            },
        },
    )
    .then((counter) => {
        res.status(200).send(counter);
    })
    .catch((err) => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while updating prevDay.",
        });
    });
}