const Event = require("../models/codechefEvents.model.js");

//create or update the event in database
exports.create = (req, res) => {

  let username = req.decoded.username;
  if (
    !(
      username === "admin" ||
      username === "21951A05Z9" ||
      username === "19951A0535"
    )
  ) {
    return res.status(400).send({
      success: false,
      message: "Unauthorized access!",
    });
  }

  const event = new Event({
    eventName: req.body.eventName,
    eventPoster: req.body.eventPoster,
    eventDay: req.body.eventDay,
    eventMonth: req.body.eventMonth,
    eventYear: req.body.eventYear,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    duration: req.body.duration,
    rating: req.body.rating,
    contestLink: req.body.contestLink,
    div1: req.body.div1,
    div2: req.body.div2,
    div3: req.body.div3,
  });
  event
    .save()
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: err.message || "Some error occurred while updating the Event.",
      });
    });
};

exports.findAll = (req, res) => {
  Event.find()
    .then((events) => {
      res.send(events);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};
