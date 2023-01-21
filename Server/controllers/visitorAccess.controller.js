const Visitor = require("../models/visitorAccess.model.js");
const encrypt = require("../encrypt.js");
exports.create = async (req, res) => {
  Visitor.find({}).then((visitors) => {
    let count = visitors[0].CountValue + 1;
    Visitor.findOneAndUpdate(
      { personId: visitors[0].personId },
      { $set: { CountValue: count } }
    ).then((data) => {
      console.log(data);
    });
    const visitor = new Visitor({
      name: req.body.Name,
      phoneNumber: req.body.Phone,
      purpose: req.body.Purpose,
      date: new Date(),
      personId: "IAREVISITOR" + count,
      allocatedId: "",
      status: "pending",
    });
    let pid = "IAREVISITOR" + count;
    let spid = encrypt.encrypt(pid);
    visitor
      .save()
      .then((data) => {
        res.send({
          success: true,
          data: spid,
        });
      })
      .catch((err) => {
        res.send({
          success: false,
          message: "Error while registration",
        });
      });
  });
};

exports.findAll = async (req, res) => {
  Visitor.find({})
    .then((visitors) => {
      res.send({
        success: true,
        data: visitors,
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        message: "Error retrieving data",
      });
    });
};

exports.deleteVisitor = async (req, res) => {
  Visitor.deleteOne({ personId: req.params.personId })
    .then(() => {
      res.send({
        success: true,
      });
    })
    .catch((err) => {
      res.send({
        error: true,
      });
    });
};

exports.allocateVisitor = async (req, res) => {
  Visitor.find({})
    .then((visitors) => {
      let data = visitors[1].visitorAllocatedId;
      let aid = "";
      for (i = 0; i < data.length; i++) {
        if (data[i][1] == "") {
          data[i][1] = req.params.personId;
          aid = data[i][0];
          break;
        }
      }
      Visitor.findOneAndUpdate(
        {
          personId: "allocation",
        },
        {
          $set: {
            visitorAllocatedId: data,
          },
        }
      )
        .then(() => {
          Visitor.findOneAndUpdate(
            { personId: req.params.personId },
            {
              $set: {
                status: "allocated",
                allocatedId: aid,
              },
            }
          )
            .then(() => {
              res.send({
                success: true,
              });
            })
            .catch((err) => {
              res.send({
                error: true,
              });
            });
        })
        .catch((err) => {
          res.send({
            error: true,
          });
        });
    })
    .catch((err) => {
      res.send({
        error: true,
      });
    });
};

exports.findOne = async (req, res) => {
  let deid = encrypt.decrypt(req.params.personId);
  Visitor.findOne({ personId: deid })
    .then((visitor) => {
      if (visitor) {
        res.send({
          success: true,
          data: visitor,
        });
      } else {
        res.send({
          success: false,
        });
      }
    })
    .catch((err) => {
      res.send({
        success: false,
      });
    });
};
