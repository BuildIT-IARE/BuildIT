let middleware = require("../util/middleware.js");

module.exports = (app) => {
    const twilio = require('../controllers/twilio.controller');

    app.post('/sendOtp',twilio.sendOTP);

    app.post('/verifyOtp',twilio.verifyOTP);
}