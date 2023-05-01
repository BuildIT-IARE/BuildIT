const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } =
  process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const Visitor = require("../models/visitorAccess.model.js");
const encrypt = require("../encrypt.js");
exports.sendOTP = async (req, res) => {
  const countryCode = req.body.countryCode;
  const phoneNumber = req.body.phoneNumber;
  client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verifications.create({
      to: `+${countryCode}${phoneNumber}`,
      channel: "sms",
    })
    .then((data) => {
      res.status(200).send({
        success: true,
        message: "OTP sent!",
      });
    })
    .catch((err) => {
      res.status(400).send({
        error: err,
        message: err.message || "OTP failed to send",
      });
    });
};

exports.verifyOTP = (req, res) => {
  const countryCode = req.body.countryCode;
  const phoneNumber = req.body.phoneNumber;
  const otp = req.body.otp;
  client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verificationChecks.create({
      to: `+${countryCode}${phoneNumber}`,
      code: otp,
    })
    .then((resp) => {
      if (resp.valid) {
        Visitor.find({ phoneNumber: phoneNumber, status: "allocated" })
          .then((checkVisitor) => {
            if (checkVisitor.length == 0) {
              Visitor.find({}).then((visitors) => {
                let count = visitors[0].CountValue + 1;
                Visitor.findOneAndUpdate(
                  { personId: visitors[0].personId },
                  { $set: { CountValue: count } }
                ).then((data) => {
                  console.log(data);
                });
                if (req.body.name) {
                  const visitor = new Visitor({
                    name: req.body.name,
                    phoneNumber: req.body.phoneNumber,
                    purpose: req.body.purpose,
                    date: new Date(),
                    personId: "IAREVISITOR" + count,
                    allocatedId: "",
                    photo: req.body.photo,
                    status: "verified",
                    host: req.body.host,
                    address: req.body.address,
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
                      res.status(400).send({
                        error: true,
                      });
                    });
                } else {
                  Visitor.findOneAndUpdate(
                    {
                      phoneNumber: req.body.phoneNumber,
                    },
                    {
                      $set: {
                        purpose: req.body.purpose,
                        host: req.body.host,
                        status: "verified",
                      },
                    }
                  )
                    .then((visitor) => {
                      if (visitor) {
                        let pid = visitor.personId;
                        let spid = encrypt.encrypt(pid);
                        res.send({
                          success: true,
                          data: spid,
                        });
                      } else {
                        res.status(400).send({
                          error: true,
                        });
                      }
                    })
                    .catch((err) => {
                      res.status(400).send({
                        error: true,
                      });
                    });
                }
              });
            } else {
              console.log(checkVisitor, "Visitor already allocated");
              res.status(400).send({
                error: true,
                alert: true,
              });
            }
          })
          .catch((err) => {
            res.status(400).send({
              error: true,
            });
          });
      } else {
        res.status(400).send({
          error: true,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: " OTP Verification Failed!",
      });
    });
};

exports.allocateVisitor = async (req, res) => {
  console.log(req.body, 111111111111);
  const phoneNumber = "+91" + req.body.phoneNumber;
  var enstring = encrypt.encrypt(req.params.personId);
  client.messages
    .create({
      body:
        "Hello " +
        req.body.name +
        " your visitor pass for Institute of Aeronautical Engineering has been allocated click on the below link to download the pass https://buildit.iare.ac.in/visitorPass/" +
        enstring,
      from: "+19896449535",
      to: phoneNumber,
    })
    .then((message) => {
      console.log(message);
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
                  res.status(200).send({
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
    })
    .catch((err) => {
      res.status(300).send({
        error: true,
      });
    });
};
