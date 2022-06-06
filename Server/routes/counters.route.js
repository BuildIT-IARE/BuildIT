module.exports = (app) => {
  const counters = require("../controllers/counters.controller.js");
  app.get("/counters", counters.getCounts);
};
