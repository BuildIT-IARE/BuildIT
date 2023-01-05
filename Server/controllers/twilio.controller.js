const { TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID} = process.env
const client = require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN);

exports.sendOTP = async(req,res) => {
    const {countryCode, phoneNumber } = req.body;
    client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verifications.create({
            to : `+${countryCode}${phoneNumber}`,
            channel : "sms",
    })
    .then((data) => {
        res.status(200).send({
            success : true,
            message : "OTP sent!"
        })
    })
    .catch((err) => {
        res.status(400).send({
            success : false,
            message : err.message || "OTP failed to send",
        })
    })
}

exports.verifyOTP = async(req,res) => {
    const {countryCode, phoneNumber, otp } = req.body;
    client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verificationChecks.create({
        to : `+${countryCode}${phoneNumber}`,
        code : otp,
    })
    .then((resp) => {
        if(resp.valid) {
            res.status(200).send({
                success : true,
                message : "OTP Verified!"
            })
        }
        else {
            res.status(200).send({
                success : false,
                message : "Wrong OTP entered"
            })
        }
    })
    .catch((err) => {
        res.status(400).send({
            success : false,
            message : " OTP Verification Failed!"
        })
    });
}
