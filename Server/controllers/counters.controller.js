const Counter = require("../models/counters.model.js");
const Count = require("../models/count.model.js")
var today = new Date();

exports.getCounts = (req, res)=>{
  Count.find({})
  .then((count)=>{
    res.send(count)
  })
  .catch((err)=>{
    res.send("Error")
  })
}
