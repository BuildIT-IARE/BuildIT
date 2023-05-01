const Visitor = require("../models/visitorAccess.model.js");
const encrypt = require("../encrypt.js");
exports.create = async (req, res) => {
  Visitor.find({}).then((visitors) => {
    let count = visitors[0].countValue + 1;
    Visitor.findOneAndUpdate(
      { personId: visitors[0].personId },
      { $set: { countValue: count } }
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

exports.findOnePhone = async (req, res) => {
  console.log(331233123);
  Visitor.find({ phoneNumber: req.params.phoneNumber })
    .then((visitors) => {
      console.log(visitors, req.params.phoneNumber);
      if (visitors.length > 0) {
        res.send({
          success: true,
          data: visitors[0],
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

exports.deallocateVisitor = (req, res) => {
  console.log(req.params.personId);
  Visitor.find({})
    .then((visitors) => {
      let data = visitors[1].visitorAllocatedId;
      for (i = 0; i < data.length; i++) {
        if (data[i][1] === req.params.personId) {
          data[i][1] = "";
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
                status: "expired at" + new Date().toString(),
              },
            }
          )
            .then(() => {
              res.status(200).send({
                success: true,
              });
            })
            .catch((err) => {
              res.status(400).send({
                error: true,
              });
            });
        })
        .catch((err) => {
          res.status(400).send({
            error: true,
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        error: true,
      });
    });
};

exports.findOne = async (req, res) => {
  try {
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
  } catch {
    res.send({
      success: false,
    });
  }
};

exports.getAllocateData = async (req, res) => {
  Visitor.find({})
    .then((visitors) => {
      res.send({
        success: true,
        data: visitors[1],
      });
    })
    .catch((err) => {
      res.send({ success: false });
    });
};

exports.adminViewPass = async (req, res) => {
  let encrypted = encrypt.encrypt(req.params.personId);
  res.status(200).send({
    success: true,
    value: encrypted,
  });
};
