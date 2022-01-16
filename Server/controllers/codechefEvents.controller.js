const Event = require("../models/codechefEvents.model.js");

//create or update the event in database
exports.create = (req, res) => {
  console.log("done");
  const event = new Event({
    EventName: req.body.EventName,
    Eventposter: req.body.Eventposter,
    Eventday: req.body.Eventday,
    Eventmonth: req.body.Eventmonth,
    Eventyear: req.body.Eventyear,
    Starttime: req.body.Starttime,
    Endtime: req.body.Endtime,
    Duration: req.body.Duration,
    Rating: req.body.Rating,
    Contestlink: req.body.Contestlink,
    DIV1: req.body.DIV1,
    DIV2: req.body.DIV2,
    DIV3: req.body.DIV3,
  });
  event
    .save()
    .then((data) => {
      res.send("Successfully updated");
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while updating the Event.",
      });
    });
};

exports.findAll = (req, res) => {
  Event.find({})
    .sort({ _id: -1 })
    .limit(4)
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};
