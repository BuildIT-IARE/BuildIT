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
        Visitor.find({}).then((visitors) => {
          let count = visitors[0].CountValue + 1;
          Visitor.findOneAndUpdate(
            { personId: visitors[0].personId },
            { $set: { CountValue: count } }
          ).then((data) => {
            console.log(data);
          });
          const visitor = new Visitor({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            purpose: req.body.purpose,
            date: new Date(),
            personId: "IAREVISITOR" + count,
            allocatedId: "",
            photo: req.body.photo,
            status: "verified",
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
              res.send(0);
            });
        });
      } else {
        res.send(0);
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: " OTP Verification Failed!",
      });
    });
};
