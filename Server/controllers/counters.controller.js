const Counter = require("../models/counters.model.js");
const Count = require("../models/count.model.js")
var today = new Date();

exports.addDayCount = (req, res) => {
  let counter = new Counter({
    date: new Date(),
    count: req.body.count,
  });

  counter
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message:
          err.message || "Some error occurred while creating the Contest.",
      });
    });
};

exports.getAllCounts = (req, res) => {
  Counter.find({})
    .sort({ _id: -1 })
    // .limit(8)
    .then((counter) => {
      res.status(200).send(counter);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving counters.",
      });
    });
};

exports.getCounts = (req, res)=>{
  Count.find({})
  .then((count)=>{
    sendData={success:true, data:count}
    res.send(sendData)
  })
  .catch((err)=>{
    sendData={success:true}
    res.send(sendData)
  })
}
