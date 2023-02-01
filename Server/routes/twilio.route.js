let middleware = require("../util/middleware.js");

module.exports = (app) => {
  const twilio = require("../controllers/twilio.controller");

  app.post("/sendOtp", twilio.sendOTP);

  app.post("/verifyOtp", twilio.verifyOTP);

  app.post(
    "/admin/allocateVisitor/:personId",
    middleware.checkTokenWatch,
    twilio.allocateVisitor
  );
};
